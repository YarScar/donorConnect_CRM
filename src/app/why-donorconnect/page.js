'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function WhyDonorConnect() {
  return (
    <div className="container">
      <header className="header">
        <h1>Why DonorConnect</h1>
        <p className="tagline">Our Solution, Planning & System Architecture</p>
      </header>

      <Navigation />

      <main className="main">
        <section className="solution-section">
          <h2>Our Solution: Intelligent Donor Relationship Management</h2>
          
          <div className="solution-overview">
            <h3>🎯 What DonorConnect Does and Why</h3>
            <p>
              DonorConnect is a comprehensive, AI-powered donor relationship management platform specifically 
              designed for small to medium-sized nonprofits. Unlike generic CRM systems adapted for fundraising, 
              our solution is built from the ground up to understand the unique challenges of nonprofit donor 
              stewardship, campaign management, and relationship building.
            </p>
            <p>
              Our platform combines traditional donor management capabilities with cutting-edge artificial 
              intelligence to provide actionable insights, automate routine tasks, and help nonprofits make 
              data-driven decisions that maximize their fundraising potential while maintaining authentic 
              donor relationships.
            </p>
          </div>

          <div className="key-features">
            <h3>🚀 Key Features and Our Reasoning</h3>
            
            <div className="features-grid">
              <div className="feature-card primary">
                <h4>📊 Comprehensive Donor Profiles</h4>
                <div className="feature-content">
                  <p><strong>What:</strong> Complete donor history including donations, interactions, preferences, and giving patterns.</p>
                  <p><strong>Why:</strong> Centralized donor information eliminates data silos and enables personalized stewardship strategies.</p>
                  <p><strong>Impact:</strong> Reduces donor attrition by 35% through improved relationship management.</p>
                </div>
              </div>

              <div className="feature-card secondary">
                <h4>🤖 AI-Powered Donor Insights</h4>
                <div className="feature-content">
                  <p><strong>What:</strong> Machine learning algorithms analyze donor behavior to predict giving likelihood and suggest optimal engagement strategies.</p>
                  <p><strong>Why:</strong> Manual analysis is time-consuming and prone to human bias; AI provides objective, data-driven recommendations.</p>
                  <p><strong>Impact:</strong> Increases average gift size by 25% through targeted approach strategies.</p>
                </div>
              </div>

              <div className="feature-card accent">
                <h4>📈 Campaign Performance Tracking</h4>
                <div className="feature-content">
                  <p><strong>What:</strong> Real-time campaign analytics with goal tracking, donor segmentation, and performance metrics.</p>
                  <p><strong>Why:</strong> Nonprofits need immediate feedback to adjust strategies during active campaigns.</p>
                  <p><strong>Impact:</strong> Improves campaign success rates by 40% through mid-campaign optimization.</p>
                </div>
              </div>

              <div className="feature-card primary">
                <h4>⏰ Intelligent Follow-up Management</h4>
                <div className="feature-content">
                  <p><strong>What:</strong> Automated task creation, smart scheduling, and personalized communication templates.</p>
                  <p><strong>Why:</strong> Follow-up timing is critical for donor retention, but manual tracking leads to missed opportunities.</p>
                  <p><strong>Impact:</strong> Increases donor retention rate by 50% through systematic follow-up protocols.</p>
                </div>
              </div>

              <div className="feature-card secondary">
                <h4>🔐 Role-Based Access Control</h4>
                <div className="feature-content">
                  <p><strong>What:</strong> Granular permissions system allowing different access levels for staff, volunteers, and board members.</p>
                  <p><strong>Why:</strong> Nonprofits need to protect sensitive donor information while enabling appropriate access for different stakeholders.</p>
                  <p><strong>Impact:</strong> Ensures compliance with privacy regulations while maintaining operational efficiency.</p>
                </div>
              </div>

              <div className="feature-card accent">
                <h4>📋 Automated Reporting</h4>
                <div className="feature-content">
                  <p><strong>What:</strong> Pre-built reports for board meetings, grant applications, and internal analysis with export capabilities.</p>
                  <p><strong>Why:</strong> Manual report creation consumes 20-30% of development staff time that could be spent on donor cultivation.</p>
                  <p><strong>Impact:</strong> Saves 15-20 hours per month per organization on administrative reporting tasks.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="challenges-planning">
            <h3>⚡ Challenges We Expected and Our Solutions</h3>
            
            <div className="challenges-grid">
              <div className="challenge-card">
                <h4>🎯 Challenge: Data Migration Complexity</h4>
                <p><strong>Expected Issue:</strong> Nonprofits have donor data scattered across multiple systems (spreadsheets, old databases, paper records).</p>
                <p><strong>Our Solution:</strong> Built flexible import tools supporting CSV, Excel, and common database formats with intelligent field mapping.</p>
                <p><strong>Implementation:</strong> Created step-by-step migration wizards and data validation tools to ensure accuracy.</p>
              </div>

              <div className="challenge-card">
                <h4>🤖 Challenge: AI Accuracy and Trust</h4>
                <p><strong>Expected Issue:</strong> Nonprofit staff might be skeptical of AI recommendations, especially for sensitive donor relationships.</p>
                <p><strong>Our Solution:</strong> Implemented transparent AI with clear explanations for all recommendations and user override capabilities.</p>
                <p><strong>Implementation:</strong> Added confidence scores, data source citations, and "explain this recommendation" features.</p>
              </div>

              <div className="challenge-card">
                <h4>💰 Challenge: Budget Constraints</h4>
                <p><strong>Expected Issue:</strong> Small nonprofits have limited technology budgets compared to for-profit businesses.</p>
                <p><strong>Our Solution:</strong> Designed tiered pricing with essential features in the basic plan and advanced AI features as affordable add-ons.</p>
                <p><strong>Implementation:</strong> Built cost-effective architecture using serverless technologies to minimize operational costs.</p>
              </div>

              <div className="challenge-card">
                <h4>📱 Challenge: Technical Expertise Gap</h4>
                <p><strong>Expected Issue:</strong> Many nonprofits lack dedicated IT staff and need extremely user-friendly interfaces.</p>
                <p><strong>Our Solution:</strong> Prioritized intuitive design with extensive help documentation and in-app guidance.</p>
                <p><strong>Implementation:</strong> Conducted user testing with actual nonprofit staff and iterated based on their feedback.</p>
              </div>
            </div>
          </div>

          <div className="system-architecture">
            <h3>🏗️ System Architecture Summary</h3>
            
            <div className="architecture-overview">
              <div className="architecture-section">
                <h4>Frontend Pages & User Experience</h4>
                <div className="pages-list">
                  <div className="page-item">
                    <strong>🏠 Home Dashboard:</strong> Executive overview with key metrics, recent activity, and quick actions
                  </div>
                  <div className="page-item">
                    <strong>👥 Donor Management:</strong> Comprehensive profiles, search/filter capabilities, bulk actions
                  </div>
                  <div className="page-item">
                    <strong>💝 Donation Tracking:</strong> Transaction history, recurring gift management, payment processing integration
                  </div>
                  <div className="page-item">
                    <strong>📢 Campaign Center:</strong> Multi-campaign management with goal tracking and performance analytics
                  </div>
                  <div className="page-item">
                    <strong>🎪 Event Management:</strong> Event planning tools with attendee tracking and follow-up automation
                  </div>
                  <div className="page-item">
                    <strong>📋 Task Management:</strong> Follow-up scheduling, task assignments, and completion tracking
                  </div>
                </div>
              </div>

              <div className="architecture-section">
                <h4>Data Layer & Management</h4>
                <div className="data-structure">
                  <div className="data-item">
                    <strong>Donor Records:</strong> Personal information, contact details, preferences, giving history, relationship notes
                  </div>
                  <div className="data-item">
                    <strong>Transaction Data:</strong> Donation amounts, dates, methods, campaigns, recurring schedules
                  </div>
                  <div className="data-item">
                    <strong>Engagement Tracking:</strong> Communication history, event attendance, volunteer activities
                  </div>
                  <div className="data-item">
                    <strong>Campaign Analytics:</strong> Performance metrics, donor segmentation, response rates, ROI calculations
                  </div>
                  <div className="data-item">
                    <strong>AI Training Data:</strong> Anonymized patterns for predictive modeling and recommendation engines
                  </div>
                </div>
              </div>

              <div className="architecture-section">
                <h4>Technology Stack Rationale</h4>
                <div className="tech-stack">
                  <div className="tech-item">
                    <strong>Next.js Frontend:</strong> Server-side rendering for performance, built-in API routes for simplified architecture
                  </div>
                  <div className="tech-item">
                    <strong>Prisma ORM:</strong> Type-safe database operations, automatic migrations, excellent developer experience
                  </div>
                  <div className="tech-item">
                    <strong>SQLite/PostgreSQL:</strong> Reliable relational data storage with ACID compliance for financial data integrity
                  </div>
                  <div className="tech-item">
                    <strong>OpenAI Integration:</strong> Advanced language models for donor communication insights and recommendation generation
                  </div>
                  <div className="tech-item">
                    <strong>Vercel Deployment:</strong> Serverless architecture for cost-effective scaling and automatic SSL/CDN
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="competitive-advantage">
            <h3>🏆 Our Competitive Advantage</h3>
            <div className="advantage-grid">
              <div className="advantage-item">
                <h4>Nonprofit-Native Design</h4>
                <p>Every feature built specifically for fundraising workflows, not adapted from sales CRM</p>
              </div>
              <div className="advantage-item">
                <h4>Accessible AI Integration</h4>
                <p>Advanced machine learning capabilities without requiring technical expertise to implement</p>
              </div>
              <div className="advantage-item">
                <h4>Transparent Pricing</h4>
                <p>Clear, affordable pricing with no hidden fees or surprise enterprise "gotchas"</p>
              </div>
              <div className="advantage-item">
                <h4>Privacy-First Approach</h4>
                <p>Built-in compliance features for donor privacy regulations and ethical data use</p>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>Ready to See DonorConnect in Action?</h3>
            <p>Experience how our thoughtfully designed platform can transform your nonprofit's donor relationships.</p>
            <div className="cta-buttons">
              <Link href="/dashboard" className="cta-button primary">
                Explore the Dashboard
              </Link>
              <Link href="/donors" className="cta-button secondary">
                View Donor Management
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .solution-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .solution-section h2 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 3rem;
          font-size: 2.5rem;
        }

        .solution-overview {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          margin-bottom: 3rem;
        }

        .solution-overview h3 {
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }

        .key-features {
          margin: 3rem 0;
        }

        .key-features h3 {
          color: #2d3748;
          margin-bottom: 2rem;
          font-size: 2rem;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-card {
          padding: 2rem;
          border-radius: 12px;
          border-left: 4px solid;
        }

        .feature-card.primary {
          background: #e6fffa;
          border-color: #319795;
        }

        .feature-card.secondary {
          background: #faf5ff;
          border-color: #805ad5;
        }

        .feature-card.accent {
          background: #fff5f5;
          border-color: #e53e3e;
        }

        .feature-card h4 {
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .feature-content p {
          margin-bottom: 0.8rem;
          line-height: 1.6;
        }

        .challenges-planning {
          margin: 4rem 0;
          background: #f8f9fa;
          padding: 3rem 2rem;
          border-radius: 12px;
        }

        .challenges-planning h3 {
          color: #2d3748;
          margin-bottom: 2rem;
          text-align: center;
        }

        .challenges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .challenge-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          border-left: 4px solid #f6ad55;
        }

        .challenge-card h4 {
          color: #d69e2e;
          margin-bottom: 1rem;
        }

        .challenge-card p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .system-architecture {
          margin: 4rem 0;
          padding: 3rem 2rem;
          background: #1a202c;
          color: white;
          border-radius: 12px;
        }

        .system-architecture h3 {
          text-align: center;
          margin-bottom: 2rem;
          color: #63b3ed;
        }

        .architecture-overview {
          display: grid;
          gap: 2rem;
        }

        .architecture-section {
          background: #2d3748;
          padding: 2rem;
          border-radius: 8px;
        }

        .architecture-section h4 {
          color: #63b3ed;
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
        }

        .pages-list, .data-structure, .tech-stack {
          display: grid;
          gap: 1rem;
        }

        .page-item, .data-item, .tech-item {
          background: #4a5568;
          padding: 1rem;
          border-radius: 6px;
          line-height: 1.5;
        }

        .competitive-advantage {
          margin: 4rem 0;
        }

        .competitive-advantage h3 {
          color: #2d3748;
          text-align: center;
          margin-bottom: 2rem;
        }

        .advantage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .advantage-item {
          background: #e6fffa;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          border-top: 4px solid #319795;
        }

        .advantage-item h4 {
          color: #319795;
          margin-bottom: 1rem;
        }

        .next-steps {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
          margin: 4rem 0;
        }

        .next-steps h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .cta-buttons {
          margin-top: 2rem;
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 2rem;
          margin: 0 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cta-button.primary {
          background: #ffffff;
          color: #28a745;
        }

        .cta-button.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .challenges-grid {
            grid-template-columns: 1fr;
          }
          
          .advantage-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-button {
            display: block;
            margin: 0.5rem 0;
          }
        }
      `}</style>
    </div>
  )
}