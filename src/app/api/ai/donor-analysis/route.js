import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { logger } from '@/lib/logger'

// Initialize OpenAI client
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = OPENAI_API_KEY ? new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: process.env.NODE_ENV === 'test'
}) : null

export async function POST(request) {
  try {
    const { donorId, type } = await request.json()

    // Fetch donor data
    const donor = await prisma.donor.findUnique({
      where: { id: parseInt(donorId) },
      include: {
        donations: {
          orderBy: { donationDate: 'desc' },
          include: {
            campaign: { select: { name: true } },
            event: { select: { name: true } }
          }
        },
        followUps: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      )
    }

    // Prepare data for AI analysis
    const donorSummary = {
      totalDonations: donor.donations.length,
      totalAmount: donor.donations.reduce((sum, d) => sum + d.amount, 0),
      averageGift: donor.donations.length > 0 
        ? donor.donations.reduce((sum, d) => sum + d.amount, 0) / donor.donations.length 
        : 0,
      daysSinceLastDonation: donor.donations.length > 0 
        ? Math.floor((new Date() - new Date(donor.donations[0].donationDate)) / (1000 * 60 * 60 * 24))
        : null,
      donationFrequency: donor.donations.length > 0 ? calculateDonationFrequency(donor.donations) : 'New donor',
      campaignParticipation: donor.donations.filter(d => d.campaign).length,
      eventParticipation: donor.donations.filter(d => d.event).length,
      followUpHistory: donor.followUps.length
    }

    let prompt = ''
    let analysis = ''

    switch (type) {
      case 'engagement_strategy':
        prompt = `Based on this donor profile, suggest a personalized engagement strategy:
        
Donor: ${donor.firstName} ${donor.lastName}
Email: ${donor.email || 'Not provided'}
Phone: ${donor.phone || 'Not provided'}
Location: ${donor.city ? `${donor.city}, ${donor.state}` : 'Not provided'}
Donor Type: ${donor.donorType}
Preferred Contact: ${donor.preferredContact}
Total Donations: ${donorSummary.totalDonations}
Total Amount: $${donorSummary.totalAmount}
Average Gift: $${donorSummary.averageGift.toFixed(2)}
Days Since Last Gift: ${donorSummary.daysSinceLastDonation || 'Never donated'}
Donation Frequency: ${donorSummary.donationFrequency}
Campaign Participation: ${donorSummary.campaignParticipation} campaigns
Event Participation: ${donorSummary.eventParticipation} events
Follow-up History: ${donorSummary.followUpHistory} interactions
Notes: ${donor.notes || 'None'}

Provide a concise, actionable engagement strategy. Format your response in markdown with:
- Use ## headers for main sections
- Use **bold** for key points
- Use numbered lists (1., 2., 3.) for sequential steps
- Use bullet points for lists of items

Focus on:
1. Recommended next steps (considering their preferred contact method)
2. Optimal communication timing
3. Suggested donation ask amount
4. Relationship building opportunities`
        break

      case 'risk_assessment':
        prompt = `Analyze the lapse risk for this donor and provide specific recommendations:
        
Donor Profile:
Name: ${donor.firstName} ${donor.lastName}
Donor Type: ${donor.donorType}
Location: ${donor.city ? `${donor.city}, ${donor.state}` : 'Not provided'}
Total Donations: ${donorSummary.totalDonations}
Total Given: $${donorSummary.totalAmount}
Days Since Last Gift: ${donorSummary.daysSinceLastDonation || 'No donations'}
Frequency Pattern: ${donorSummary.donationFrequency}
Engagement Level: ${donorSummary.followUpHistory} follow-ups
Campaign Participation: ${donorSummary.campaignParticipation} campaigns
Event Participation: ${donorSummary.eventParticipation} events
Notes: ${donor.notes || 'None'}

Assess the risk level (Low/Medium/High) and provide your analysis in markdown format:
- Use ## for section headers
- Use **bold** for the risk level and key terms
- Use bullet points for lists
- Use numbered lists for action items

Provide:
1. Risk factors identified
2. Recommended intervention timeline
3. Specific retention strategies`
        break

      case 'upgrade_potential':
        prompt = `Evaluate this donor's potential for gift upgrades:
        
Current Profile:
Name: ${donor.firstName} ${donor.lastName}
Donor Type: ${donor.donorType}
Location: ${donor.city ? `${donor.city}, ${donor.state}` : 'Not provided'}
Donation History: ${donorSummary.totalDonations} gifts totaling $${donorSummary.totalAmount}
Average Gift: $${donorSummary.averageGift.toFixed(2)}
Giving Pattern: ${donorSummary.donationFrequency}
Campaign Engagement: ${donorSummary.campaignParticipation > 0 ? 'Active' : 'Limited'}
Event Participation: ${donorSummary.eventParticipation} events
Notes: ${donor.notes || 'None'}

Provide upgrade assessment in well-formatted markdown:
- Use ## headers for main sections
- Use **bold** for key metrics and recommendations
- Use bullet points and numbered lists

Include:
1. Upgrade likelihood (Low/Medium/High)
2. Suggested ask amount
3. Best approach strategy
4. Timing recommendations`
        break

      default:
        analysis = generateBasicAnalysis(donor, donorSummary)
    }

    // Validate OpenAI configuration - REQUIRE real AI, no mock fallback
    const OPENAI_KEY = process.env.OPENAI_API_KEY
    
    // Try multiple models in order of preference
    const MODELS_TO_TRY = ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo']
    
    // Log configuration status (without exposing full key)
    logger.info('OpenAI Configuration Check', {
      hasKey: !!OPENAI_KEY,
      keyPrefix: OPENAI_KEY ? OPENAI_KEY.substring(0, 10) + '...' : 'none',
      modelsToTry: MODELS_TO_TRY,
      clientInitialized: !!openai
    })
    
    if (!OPENAI_KEY) {
      logger.error('OpenAI not configured', { hasKey: false })
      return NextResponse.json({
        error: 'AI service not configured',
        details: 'OpenAI API key not set',
        suggestion: 'Please check your .env file and restart the server'
      }, { status: 503 })
    }

    if (!openai) {
      logger.error('OpenAI client not initialized despite having credentials')
      return NextResponse.json({
        error: 'AI service initialization failed',
        details: 'OpenAI client could not be created with the provided credentials'
      }, { status: 503 })
    }

    // Call OpenAI API - try models until one works
    let usedModel = ''
    let lastError = null

    for (const model of MODELS_TO_TRY) {
      try {
        logger.info('Attempting OpenAI API call', { model, donorId })
        
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are an expert nonprofit fundraising consultant. Provide practical, actionable advice based on donor data. Be specific and considerate of nonprofit best practices. Format your response using markdown with headers (##), bullet points, bold text, and numbered lists for better readability."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })

        analysis = completion.choices[0].message.content
        usedModel = model
        logger.info('OpenAI API call successful', { donorId, model, responseLength: analysis.length })
        break // Success! Exit the loop
        
      } catch (modelError) {
        lastError = modelError
        logger.warn('Model not available, trying next', { 
          model, 
          error: modelError.message,
          status: modelError.status 
        })
        
        // If it's not a model access issue, stop trying
        if (modelError.status !== 403 && modelError.status !== 404) {
          break
        }
      }
    }

    // If no model worked, return error
    if (!analysis) {
      logger.error('All OpenAI models failed', { 
        error: lastError?.message, 
        status: lastError?.status,
        donorId 
      })
      
      let userMessage = lastError?.message || 'Unable to generate AI insights'
      let suggestion = 'Please check your OpenAI API key and try again'
      
      if (lastError?.status === 401) {
        userMessage = 'Invalid OpenAI API key'
        suggestion = 'Your API key appears to be invalid or expired. Please update it in the .env file'
      } else if (lastError?.status === 429) {
        userMessage = 'Rate limit exceeded'
        suggestion = 'Too many requests. Please wait a moment and try again'
      } else if (lastError?.status === 403 || lastError?.status === 404) {
        userMessage = 'No accessible AI models found'
        suggestion = 'Your OpenAI account does not have access to any models. Please check your OpenAI account settings or upgrade your plan.'
      }
      
      return NextResponse.json({
        error: 'AI analysis failed',
        details: userMessage,
        suggestion: suggestion,
        errorCode: lastError?.code || lastError?.status
      }, { status: 500 })
    }

    return NextResponse.json({
      donor: {
        id: donor.id,
        name: `${donor.firstName} ${donor.lastName}`,
        email: donor.email
      },
      analysisType: type,
      summary: donorSummary,
      analysis: analysis,
      isRealAI: true,
      source: `OpenAI ${usedModel}`,
      model: usedModel,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    logger.error('AI Analysis Error', { error: error.message, stack: error.stack })
    return NextResponse.json(
      { error: 'Failed to generate AI analysis' },
      { status: 500 }
    )
  }
}

function calculateDonationFrequency(donations) {
  if (donations.length < 2) return 'New donor'
  
  const sortedDates = donations.map(d => new Date(d.donationDate)).sort((a, b) => b - a)
  const daysBetween = []
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const days = Math.floor((sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24))
    daysBetween.push(days)
  }
  
  const averageDays = daysBetween.reduce((sum, days) => sum + days, 0) / daysBetween.length
  
  if (averageDays <= 30) return 'Monthly donor'
  if (averageDays <= 90) return 'Quarterly donor'
  if (averageDays <= 180) return 'Semi-annual donor'
  if (averageDays <= 365) return 'Annual donor'
  return 'Infrequent donor'
}

function generateMockAnalysis(type, donor, summary) {
  const templates = {
    engagement_strategy: `**Recommended Engagement Strategy for ${donor.firstName}:**

**Risk Level**: ${summary.daysSinceLastDonation > 180 ? 'High' : summary.daysSinceLastDonation > 90 ? 'Medium' : 'Low'}

**Next Steps:**
1. ${summary.daysSinceLastDonation > 90 ? 'Schedule immediate personal outreach call' : 'Send personalized thank you with impact story'}
2. ${summary.averageGift > 100 ? 'Invite to VIP donor event' : 'Include in newsletter with giving opportunities'}
3. Follow up within ${summary.daysSinceLastDonation > 180 ? '1 week' : '2-3 weeks'}

**Suggested Ask Amount**: $${Math.round(summary.averageGift * 1.25)} (25% increase from average)

**Communication Preference**: Based on history, ${summary.campaignParticipation > 0 ? 'responds well to campaign updates' : 'prefers direct personal communication'}`,

    risk_assessment: `**Donor Lapse Risk Assessment:**

**Risk Level**: ${summary.daysSinceLastDonation > 365 ? 'HIGH' : summary.daysSinceLastDonation > 180 ? 'MEDIUM' : 'LOW'}

**Key Risk Factors:**
- ${summary.daysSinceLastDonation} days since last donation
- ${summary.donationFrequency} giving pattern
- ${summary.followUpHistory < 2 ? 'Limited engagement history' : 'Good engagement history'}

**Recommended Timeline**: ${summary.daysSinceLastDonation > 180 ? 'Immediate action required' : 'Monitor and engage within 30 days'}

**Retention Strategies**:
1. Personal phone call or meeting
2. Share specific impact of their previous gifts
3. Offer involvement opportunity beyond giving
4. ${summary.averageGift > 250 ? 'Major gift cultivation track' : 'Upgrade cultivation program'}`,

    upgrade_potential: `**Gift Upgrade Assessment:**

**Upgrade Likelihood**: ${summary.totalDonations > 3 && summary.averageGift > 50 ? 'HIGH' : summary.totalDonations > 1 ? 'MEDIUM' : 'LOW'}

**Current Giving Pattern**: ${summary.donationFrequency} averaging $${summary.averageGift.toFixed(2)}

**Suggested Ask**: $${Math.round(summary.averageGift * 1.5)} (${Math.round(((summary.averageGift * 1.5) - summary.averageGift) / summary.averageGift * 100)}% increase)

**Best Approach**:
1. ${summary.campaignParticipation > 0 ? 'Campaign-based ask with specific project funding' : 'General operating support with clear impact metrics'}
2. Timing: ${summary.daysSinceLastDonation < 60 ? 'Strike while engagement is warm' : 'Rebuild relationship first'}
3. Format: ${summary.averageGift > 200 ? 'In-person meeting or phone call' : 'Personal letter or email'}`
  }

  return templates[type] || `Analysis for ${donor.firstName} ${donor.lastName} completed. Based on their giving history of ${summary.totalDonations} donations totaling $${summary.totalAmount}, we recommend continued stewardship and personalized engagement.`
}

function generateBasicAnalysis(donor, summary) {
  return `**Donor Profile Analysis for ${donor.firstName} ${donor.lastName}:**

**Giving Summary**: ${summary.totalDonations} donations totaling $${summary.totalAmount} (avg: $${summary.averageGift.toFixed(2)})

**Engagement Level**: ${summary.followUpHistory > 2 ? 'Highly engaged' : summary.followUpHistory > 0 ? 'Moderately engaged' : 'Low engagement'}

**Relationship Status**: ${summary.daysSinceLastDonation === null ? 'New prospect' : summary.daysSinceLastDonation < 90 ? 'Active donor' : summary.daysSinceLastDonation < 365 ? 'Recent donor' : 'Lapsed donor'}

**Recommended Actions**: Regular stewardship, ${summary.averageGift > 100 ? 'major gift consideration' : 'upgrade potential'}, and ${summary.daysSinceLastDonation > 180 ? 'immediate re-engagement needed' : 'continued cultivation'}.`
}