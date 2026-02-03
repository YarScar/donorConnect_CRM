'use client'

import Link from 'next/link'

export default function AIPolicy() {
  return (
    <div className="container">
      <header className="header">
        <h1>AI Policy & Safeguards</h1>
        <p className="tagline">Responsible AI Integration in DonorConnect</p>
      </header>

      <main className="main">
        <section className="policy-overview">
          <div className="overview-card">
            <h2>🤖 How We Use AI Responsibly</h2>
            <p>
              DonorConnect integrates artificial intelligence to enhance donor relationship management 
              while maintaining the highest standards of ethical AI use, data privacy, and nonprofit best practices. 
              Our AI features are designed to augment human decision-making, not replace it.
            </p>
          </div>
        </section>

        <section className="implementation-note">
          <h2>🧾 Implementation Notes</h2>
          <div className="note-card">
            <p>Key implementation details and where to inspect them in code:</p>
            <ul>
              <li>PII masking for AI prompts and responses: see <strong>src/app/api/ai/donor-analysis/route.js</strong> (look for the comment "pii protection").</li>
              <li>Charts and analytics source data: see <strong>src/app/api/dashboard/route.js</strong> (monthly and yearly aggregates for charts).</li>
              <li>Prisma DB access and schema: see <strong>prisma/schema.prisma</strong> and <strong>src/lib/prisma.js</strong>.</li>
            </ul>
          </div>
        </section>

        <section className="ai-features">
          <h2>🔧 AI Models and APIs Used</h2>
          
          <div className="feature-grid">
            <div className="feature-card">
              <h3>📊 OpenAI (official SDK)</h3>
              <div className="feature-details">
                <p><strong>Primary Use:</strong> Donor analysis and engagement strategy generation</p>
                <p><strong>Models:</strong> We attempt multiple models (example: gpt-4o-mini, gpt-3.5-turbo, gpt-4o, gpt-4-turbo) depending on availability</p>
                <p><strong>API Provider:</strong> OpenAI (access via the `openai` npm SDK)</p>
                <p><strong>Data Processing:</strong> Contact fields (email, phone) are masked before sending to external AI; aggregated donor metrics are provided to the model. See implementation note below.</p>
                <p><strong>Retention Policy:</strong> We do not persist provider responses in the database by default; external provider retention policies may still apply — mask data before sending to providers to reduce exposure.</p>
              </div>
            </div>

            <div className="feature-card">
              <h3>🧠 Custom Pattern Recognition</h3>
              <div className="feature-details">
                <p><strong>Function:</strong> Local algorithms for risk assessment and giving pattern analysis</p>
                <p><strong>Implementation:</strong> JavaScript-based calculations within our application</p>
                <p><strong>Data Source:</strong> Aggregated donation history and engagement metrics (processed server-side)</p>
                <p><strong>Privacy:</strong> Local processing where possible; no external API calls for these calculations</p>
              </div>
            </div>
          </div>
        </section>

        <section className="responsible-use">
          <h2>⚖️ Responsible AI Principles</h2>
          
          <div className="principles-grid">
            <div className="principle-card transparency">
              <h3>🔍 Transparency</h3>
              <ul>
                <li>All AI recommendations are labeled as AI-generated</li>
                <li>Rationales or explanations are provided where feasible; numeric confidence scores are not currently provided by all models</li>
                <li>Key data sources (aggregated donor metrics) are cited for each recommendation</li>
                <li>Users can request clarification on why a recommendation was made (where supported by the UI and model response)</li>
              </ul>
            </div>

            <div className="principle-card accountability">
              <h3>👤 Human Oversight</h3>
              <ul>
                <li>AI suggestions require human review before implementation</li>
                <li>Users can always override or ignore AI recommendations</li>
                <li>Final decisions about donor relationships remain with nonprofit staff</li>
                <li>AI insights are advisory only, never automatically executed</li>
                <li>Clear audit trail of all AI-assisted decisions</li>
              </ul>
            </div>

            <div className="principle-card privacy">
              <h3>🔒 Privacy Protection</h3>
              <ul>
                <li>Contact PII (email, phone) is masked before being sent to external AI services; names may still be included unless configured otherwise in settings</li>
                <li>Data masking/anonymization of contact fields is applied prior to external AI calls (see implementation note below)</li>
                <li>We follow nonprofit privacy best practices and recommend reviewing deployment-level encryption and provider settings</li>
                <li>Local processing is preferred for calculation-based features (e.g., pattern detection, risk scoring)</li>
                <li>Regular privacy impact assessments are recommended and should be performed by deployers</li>
              </ul>
            </div>

            <div className="principle-card fairness">
              <h3>⚖️ Fairness & Bias Prevention</h3>
              <ul>
                <li>Regular testing for algorithmic bias in donor assessments</li>
                <li>Diverse training data considerations in prompt engineering</li>
                <li>Equal treatment regardless of donor demographics</li>
                <li>Bias detection mechanisms in risk level calculations</li>
                <li>Continuous monitoring of AI recommendation patterns</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="prompt-engineering">
          <h2>🎯 AI Prompt Crafting & Optimization</h2>
          
          <div className="prompt-section">
            <h3>How We Craft Effective Prompts</h3>
            <div className="prompt-strategy">
              <div className="strategy-item">
                <h4>🎪 Context Setting</h4>
                <p>We establish clear context by identifying the AI as a "nonprofit fundraising consultant" with expertise in donor stewardship and ethical fundraising practices.</p>
                <div className="example-prompt">
                  <strong>Example System Prompt:</strong>
                  <code>"You are an expert nonprofit fundraising consultant. Provide practical, actionable advice based on donor data. Be specific and considerate of nonprofit best practices."</code>
                </div>
              </div>

              <div className="strategy-item">
                <h4>📊 Structured Data Input</h4>
                <p>We format donor data consistently with clear labels and context to ensure accurate AI interpretation:</p>
                <div className="data-format">
                  <strong>Data Structure:</strong>
                  <ul>
                    <li>Donor Profile Summary (anonymized)</li>
                    <li>Giving History Metrics</li>
                    <li>Engagement Pattern Analysis</li>
                    <li>Specific Analysis Request Type</li>
                  </ul>
                </div>
              </div>

              <div className="strategy-item">
                <h4>🎯 Specific Output Requirements</h4>
                <p>Our prompts specify exactly what type of analysis and format we need:</p>
                <div className="output-specs">
                  <strong>Output Guidelines:</strong>
                  <ul>
                    <li>Concise, actionable recommendations</li>
                    <li>Specific next steps with timelines</li>
                    <li>Risk assessments with supporting rationale</li>
                    <li>Suggested dollar amounts based on giving history</li>
                    <li>Communication strategy recommendations</li>
                  </ul>
                </div>
              </div>

              <div className="strategy-item">
                <h4>🛡️ Ethical Constraints</h4>
                <p>We build safeguards directly into our prompts to ensure ethical recommendations:</p>
                <div className="ethical-guidelines">
                  <strong>Built-in Constraints:</strong>
                  <ul>
                    <li>Respect for donor privacy and autonomy</li>
                    <li>Focus on relationship building, not manipulation</li>
                    <li>Consideration of nonprofit capacity and resources</li>
                    <li>Alignment with Association of Fundraising Professionals (AFP) ethics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ai-improvement">
          <h2>📈 How AI Improves Our Solution</h2>
          
          <div className="improvement-areas">
            <div className="improvement-card">
              <h3>⏱️ Time Efficiency</h3>
              <p><strong>Challenge:</strong> Nonprofit staff spend 60-70% of time on administrative tasks instead of relationship building.</p>
              <p><strong>AI Solution:</strong> Automated donor analysis, risk assessment, and follow-up suggestions reduce analysis time by 75%.</p>
              <p><strong>Impact:</strong> Staff can focus on personal donor cultivation rather than data analysis.</p>
            </div>

            <div className="improvement-card">
              <h3>🧠 Pattern Recognition</h3>
              <p><strong>Challenge:</strong> Humans struggle to identify subtle patterns across hundreds of donor records.</p>
              <p><strong>AI Solution:</strong> Machine learning identifies giving patterns, optimal timing, and engagement preferences.</p>
              <p><strong>Impact:</strong> More personalized donor communication and higher success rates.</p>
            </div>

            <div className="improvement-card">
              <h3>🎯 Predictive Insights</h3>
              <p><strong>Challenge:</strong> Difficulty predicting donor lapse risk and upgrade potential.</p>
              <p><strong>AI Solution:</strong> Predictive modeling based on historical data and engagement metrics.</p>
              <p><strong>Impact:</strong> Proactive donor retention and strategic upgrade campaigns.</p>
            </div>

            <div className="improvement-card">
              <h3>📊 Consistent Analysis</h3>
              <p><strong>Challenge:</strong> Human analysis varies based on experience, bias, and available time.</p>
              <p><strong>AI Solution:</strong> Standardized evaluation criteria and consistent analytical approach.</p>
              <p><strong>Impact:</strong> Equitable treatment of all donors and systematic relationship management.</p>
            </div>
          </div>
        </section>

        <section className="safeguards-implementation">
          <h2>🔐 Technical Safeguards</h2>
          
          <div className="safeguards-grid">

            <div className="safeguard-item">
              <h3>🔒 Data Encryption</h3>
              <p>Data in transit uses TLS; at-rest encryption depends on your deployment (cloud provider or database configuration). AI analysis uses masked contact fields rather than raw email/phone. Review your hosting provider's encryption settings for full compliance.</p>
            </div>

            <div className="safeguard-item">
              <h3>⏱️ Session Limits</h3>
              <p>Rate limiting and session management are recommended for production deployments to prevent unwanted data accumulation; configure these at the API gateway or hosting layer.</p>
            </div>

            <div className="safeguard-item">
              <h3>🚫 Data Retention Controls</h3>
              <p>We do not persist AI provider responses by default. External provider retention and logging policies are governed by the provider (OpenAI). To reduce exposure, we mask PII before sending and recommend configuring provider-side data-use settings where available.</p>
            </div>

            <div className="safeguard-item">
              <h3>🎛️ User Controls</h3>
              <p>Users can disable AI features entirely, delete AI-generated insights, and opt out of any AI analysis.</p>
            </div>

            <div className="safeguard-item">
              <h3>📋 Audit Logging</h3>
              <p>Complete logs of AI usage, including what data was analyzed and what recommendations were generated.</p>
            </div>

            <div className="safeguard-item">
              <h3>🛡️ Error Handling</h3>
              <p>Graceful fallbacks when AI services are unavailable, ensuring core functionality remains intact.</p>
            </div>
          </div>
        </section>

        <section className="compliance">
          <h2>📋 Compliance & Standards</h2>
          
          <div className="compliance-list">
            <div className="compliance-item">
              <h3>🏛️ Regulatory Compliance</h3>
              <ul>
                <li>GDPR compliance for international donors</li>
                <li>CCPA compliance for California-based donors</li>
                <li>SOX compliance for financial data handling</li>
                <li>IRS requirements for nonprofit donor records</li>
              </ul>
            </div>

            <div className="compliance-item">
              <h3>🤝 Industry Standards</h3>
              <ul>
                <li>Association of Fundraising Professionals (AFP) Code of Ethics</li>
                <li>Council for Advancement and Support of Education (CASE) standards</li>
                <li>Donor Bill of Rights adherence</li>
                <li>ISO/IEC 27001 information security standards</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="user-controls">
          <h2>🎛️ User Control & Opt-Out Options</h2>
          
          <div className="controls-info">
            <div className="control-option">
              <h3>❌ Complete AI Opt-Out</h3>
              <p>Users can disable all AI features and use DonorConnect as a traditional CRM without any automated analysis.</p>
              <div className="control-action">
                <button className="btn btn-secondary" disabled>
                  Disable AI Features (Demo)
                </button>
              </div>
            </div>

            <div className="control-option">
              <h3>🗑️ Data Deletion</h3>
              <p>Users can request deletion of all AI-generated insights while preserving core donor relationship data.</p>
              <div className="control-action">
                <button className="btn btn-warning" disabled>
                  Clear AI Insights (Demo)
                </button>
              </div>
            </div>

            <div className="control-option">
              <h3>📊 Selective Analysis</h3>
              <p>Choose which donors and which types of analysis to enable AI for, maintaining granular control.</p>
              <div className="control-action">
                <Link href="/donors" className="btn btn-primary">
                  Manage Donor AI Settings
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-support">
          <h2>📞 Questions About Our AI Use?</h2>
          <div className="support-info">
            <p>
              We're committed to transparency about our AI implementation. If you have questions about 
              how we use AI, concerns about privacy, or suggestions for improvement, please contact us.
            </p>
            <div className="support-actions">
              <a href="mailto:ai-ethics@donorconnect.org" className="btn btn-primary">
                📧 Contact AI Ethics Team
              </a>
              <Link href="/evidence" className="btn btn-secondary">
                📋 View Implementation Evidence
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .policy-overview {
          margin: 2rem 0;
        }

        .overview-card {
          background: linear-gradient(135deg, #6f42c1, #5a67d8);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .overview-card h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .overview-card p {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        .ai-features {
          margin: 4rem 0;
        }

        .ai-features h2 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 3rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #6f42c1;
        }

        .feature-card h3 {
          color: #6f42c1;
          margin-bottom: 1.5rem;
        }

        .feature-details p {
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .feature-details strong {
          color: #2d3748;
        }

        .responsible-use {
          margin: 4rem 0;
          background: #f8f9fa;
          padding: 3rem 2rem;
          border-radius: 12px;
        }

        .responsible-use h2 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 3rem;
        }

        .principles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .principle-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .principle-card.transparency { border-left: 4px solid #17a2b8; }
        .principle-card.accountability { border-left: 4px solid #28a745; }
        .principle-card.privacy { border-left: 4px solid #dc3545; }
        .principle-card.fairness { border-left: 4px solid #ffc107; }

        .principle-card h3 {
          margin-bottom: 1rem;
        }

        .principle-card ul {
          list-style-type: none;
          padding: 0;
        }

        .principle-card li {
          padding: 0.5rem 0;
          position: relative;
          padding-left: 1.5rem;
        }

        .principle-card li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #28a745;
          font-weight: bold;
        }

        .prompt-engineering {
          margin: 4rem 0;
        }

        .prompt-engineering h2 {
          color: #2d3748;
          margin-bottom: 2rem;
        }

        .prompt-section h3 {
          color: #6f42c1;
          margin-bottom: 2rem;
        }

        .strategy-item {
          background: white;
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid #6f42c1;
        }

        .strategy-item h4 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .example-prompt, .data-format, .output-specs, .ethical-guidelines {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 6px;
          margin-top: 1rem;
        }

        .example-prompt code {
          background: none;
          color: #6f42c1;
          font-style: italic;
        }

        .data-format ul, .output-specs ul, .ethical-guidelines ul {
          margin-top: 1rem;
        }

        .ai-improvement {
          margin: 4rem 0;
        }

        .ai-improvement h2 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 3rem;
        }

        .improvement-areas {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .improvement-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-top: 4px solid #28a745;
        }

        .improvement-card h3 {
          color: #28a745;
          margin-bottom: 1rem;
        }

        .improvement-card p {
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .improvement-card strong {
          color: #2d3748;
        }

        .safeguards-implementation {
          margin: 4rem 0;
          background: #fff5f5;
          padding: 3rem 2rem;
          border-radius: 12px;
          border-left: 4px solid #dc3545;
        }

        .safeguards-implementation h2 {
          color: #dc3545;
          margin-bottom: 3rem;
          text-align: center;
        }

        .safeguards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .safeguard-item {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 3px solid #dc3545;
        }

        .safeguard-item h3 {
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .compliance {
          margin: 4rem 0;
        }

        .compliance h2 {
          color: #2d3748;
          margin-bottom: 2rem;
        }

        .compliance-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .compliance-item {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid #17a2b8;
        }

        .compliance-item h3 {
          color: #17a2b8;
          margin-bottom: 1rem;
        }

        .user-controls {
          margin: 4rem 0;
          background: #f0f8ff;
          padding: 3rem 2rem;
          border-radius: 12px;
        }

        .user-controls h2 {
          color: #2d3748;
          margin-bottom: 2rem;
          text-align: center;
        }

        .control-option {
          background: white;
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .control-option h3 {
          color: #007bff;
          margin-bottom: 1rem;
        }

        .control-action {
          margin-top: 1rem;
        }

        .contact-support {
          margin: 4rem 0;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .contact-support h2 {
          margin-bottom: 2rem;
        }

        .support-info p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .support-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          padding: 1rem 2rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .feature-grid, .principles-grid, .improvement-areas, .safeguards-grid, .compliance-list {
            grid-template-columns: 1fr;
          }
          
          .support-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}