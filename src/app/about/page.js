import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function About() {
  return (
    <div className="container">
      <header className="header">
        <h1>About DonorConnect</h1>
        <p className="tagline">Understanding the Problem We Solve</p>
      </header>

      <Navigation />

      <main className="main">
        <section className="problem-section">
          <h2>The Nonprofit Donor Management Crisis</h2>
          
          <div className="problem-detail">
            <h3>📊 The Challenge in Our Own Words</h3>
            <p>
              Nonprofit organizations face a critical challenge in managing donor relationships effectively. 
              Traditional methods of tracking donor information—spreadsheets, paper records, and 
              disconnected systems—create information silos that prevent organizations from understanding 
              their donors' full giving journey. This fragmentation leads to inefficient fundraising, 
              missed opportunities for donor stewardship, and ultimately, reduced funding for vital causes.
            </p>
          </div>

          <div className="impact-section">
            <h3>🎯 Why This Problem Matters for Nonprofits</h3>
            <div className="impact-grid">
              <div className="impact-card">
                <h4>Financial Impact</h4>
                <p>Organizations lose 30-50% of their donor base annually due to poor relationship management and lack of systematic follow-up processes.</p>
              </div>
              <div className="impact-card">
                <h4>Mission Impact</h4>
                <p>When nonprofits can't efficiently manage donors, they spend more time on administrative tasks and less time on their core mission.</p>
              </div>
              <div className="impact-card">
                <h4>Growth Impact</h4>
                <p>Without comprehensive donor insights, organizations struggle to identify major gift prospects and planned giving opportunities.</p>
              </div>
            </div>
          </div>

          <div className="affected-section">
            <h3>👥 Who Is Affected by This Problem</h3>
            <div className="stakeholders-list">
              <div className="stakeholder">
                <h4>Small to Medium Nonprofits</h4>
                <p>Organizations with limited resources that can't afford expensive CRM solutions but need professional donor management capabilities.</p>
              </div>
              <div className="stakeholder">
                <h4>Development Staff</h4>
                <p>Fundraising professionals who waste valuable time on manual data entry and reporting instead of building donor relationships.</p>
              </div>
              <div className="stakeholder">
                <h4>Executive Directors</h4>
                <p>Leaders who need comprehensive insights into fundraising performance but lack visibility into donor trends and patterns.</p>
              </div>
              <div className="stakeholder">
                <h4>Board Members</h4>
                <p>Governance leaders who require clear, accurate reporting on fundraising progress and donor engagement metrics.</p>
              </div>
              <div className="stakeholder">
                <h4>Donors Themselves</h4>
                <p>Supporters who receive poorly timed communications or feel underappreciated due to inadequate donor stewardship systems.</p>
              </div>
            </div>
          </div>

          <div className="consequences-section">
            <h3>⚠️ What Happens If This Problem Is Not Solved</h3>
            <div className="consequences-grid">
              <div className="consequence severe">
                <h4>Donor Attrition Crisis</h4>
                <p>Without systematic donor management, organizations face accelerating donor loss, leading to unstable funding and potential program cuts.</p>
              </div>
              <div className="consequence severe">
                <h4>Operational Inefficiency</h4>
                <p>Staff spend 60-70% of their time on administrative tasks rather than relationship building, reducing fundraising effectiveness.</p>
              </div>
              <div className="consequence severe">
                <h4>Missed Revenue Opportunities</h4>
                <p>Organizations fail to identify upgrade prospects, planned giving opportunities, and corporate partnership potential.</p>
              </div>
              <div className="consequence severe">
                <h4>Compliance and Reporting Issues</h4>
                <p>Poor data management leads to inaccurate reporting to boards, regulators, and grant-making organizations.</p>
              </div>
            </div>
          </div>

          <div className="differentiation-section">
            <h3>🚀 How DonorConnect Is Different</h3>
            <div className="comparison-table">
              <div className="comparison-header">
                <div>Traditional Solutions</div>
                <div>DonorConnect Advantage</div>
              </div>
              <div className="comparison-row">
                <div className="traditional">
                  <strong>Expensive enterprise systems</strong><br/>
                  Cost $500-2000+ monthly, requiring dedicated IT support and extensive training
                </div>
                <div className="donorconnect">
                  <strong>Accessible & Affordable</strong><br/>
                  Purpose-built for small-medium nonprofits with intuitive design and no IT expertise required
                </div>
              </div>
              <div className="comparison-row">
                <div className="traditional">
                  <strong>Generic CRM adaptations</strong><br/>
                  Built for sales, not fundraising, missing nonprofit-specific features and workflows
                </div>
                <div className="donorconnect">
                  <strong>Nonprofit-Native Design</strong><br/>
                  Every feature designed specifically for donor stewardship, campaign management, and nonprofit reporting
                </div>
              </div>
              <div className="comparison-row">
                <div className="traditional">
                  <strong>Manual data analysis</strong><br/>
                  Staff spend hours creating reports and identifying trends manually
                </div>
                <div className="donorconnect">
                  <strong>AI-Powered Insights</strong><br/>
                  Intelligent algorithms automatically identify donor patterns, suggest follow-ups, and predict giving potential
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h3>Ready to Transform Your Donor Management?</h3>
            <p>Join nonprofits already using DonorConnect to build stronger donor relationships and increase funding.</p>
            <div className="cta-buttons">
              <Link href="/dashboard" className="cta-button primary">
                Try DonorConnect Now
              </Link>
              <Link href="/why-donorconnect" className="cta-button secondary">
                See Our Solution Details
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .problem-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .problem-section h2 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 3rem;
          font-size: 2.5rem;
        }

        .problem-detail, .impact-section, .affected-section, .consequences-section, .differentiation-section {
          margin: 3rem 0;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 4px solid #e53e3e;
        }

        .problem-detail h3, .impact-section h3, .affected-section h3, .consequences-section h3, .differentiation-section h3 {
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .impact-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 3px solid #e53e3e;
        }

        .impact-card h4 {
          color: #e53e3e;
          margin-bottom: 1rem;
        }

        .stakeholders-list {
          display: grid;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .stakeholder {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 3px solid #3182ce;
        }

        .stakeholder h4 {
          color: #3182ce;
          margin-bottom: 0.5rem;
        }

        .consequences-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .consequence {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 3px solid #f56565;
        }

        .consequence h4 {
          color: #e53e3e;
          margin-bottom: 1rem;
        }

        .comparison-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          margin-top: 2rem;
        }

        .comparison-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #2d3748;
          color: white;
          font-weight: bold;
          text-align: center;
        }

        .comparison-header > div {
          padding: 1rem;
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #e2e8f0;
        }

        .comparison-row > div {
          padding: 1.5rem;
        }

        .traditional {
          background: #fed7d7;
          border-right: 1px solid #e2e8f0;
        }

        .donorconnect {
          background: #c6f6d5;
        }

        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
          margin: 3rem 0;
        }

        .cta-section h3 {
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
          background: #28a745;
          color: white;
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
          .impact-grid, .consequences-grid {
            grid-template-columns: 1fr;
          }
          
          .comparison-header, .comparison-row {
            grid-template-columns: 1fr;
          }
          
          .traditional {
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
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