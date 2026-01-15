'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Reflection() {
  return (
    <div className="container">
      <header className="header">
        <h1>💭 Development Reflection</h1>
        <p className="tagline">Learning, Growth, and Decision-Making in Building DonorConnect</p>
      </header>

      <Navigation />

      <main className="main">
        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🎯 Project Reflection Overview</h2>
            </div>
            <div className="card-content">
              <p>
                Building DonorConnect has been an intensive learning experience that challenged me to 
                integrate multiple technologies, design thoughtful user experiences, and implement 
                responsible AI practices. This reflection explores the challenges faced, lessons learned, 
                and insights gained throughout the development process.
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">⚡ What Challenged Me the Most</h2>
            </div>
            <div className="card-content">
              <h3>🤖 Implementing Responsible AI Integration</h3>
              <h4><strong>The Challenge:</strong></h4>
              <p>
                The most significant challenge was implementing AI features that were both meaningful 
                and ethically sound. I needed to balance the power of AI analysis with respect for 
                donor privacy and nonprofit ethics, while ensuring the AI added genuine value rather 
                than being a superficial addition.
              </p>
              
              <h4><strong>Specific Difficulties:</strong></h4>
              <ul>
                <li><strong>Data Privacy:</strong> Ensuring no personally identifiable information was sent to external AI services</li>
                <li><strong>Prompt Engineering:</strong> Crafting prompts that generated consistently useful, ethical recommendations</li>
                <li><strong>Fallback Systems:</strong> Creating graceful degradation when AI services are unavailable</li>
                <li><strong>User Trust:</strong> Making AI recommendations transparent and overrideable</li>
              </ul>

              <h4><strong>How I Overcame It:</strong></h4>
              <p>
                I developed a dual approach: external AI (OpenAI) for complex analysis with anonymized data, 
                and local algorithms for simpler calculations. I also implemented comprehensive user controls, 
                transparency features, and extensive documentation of our AI approach.
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📊 Database Design for Nonprofit Complexity</h3>
            </div>
            <div className="card-content">
              <h4><strong>The Challenge:</strong></h4>
              <p>
                Designing a database schema that could handle the complex relationships in nonprofit 
                fundraising: donors with multiple contact preferences, donations tied to various 
                campaigns and events, recurring vs. one-time gifts, and flexible follow-up systems.
              </p>
              
              <h4><strong>Learning Curve:</strong></h4>
              <ul>
                <li>Understanding Prisma ORM syntax and relationship definitions</li>
                <li>Balancing normalization with query performance</li>
                <li>Handling optional relationships (donations without campaigns)</li>
                <li>Ensuring data integrity across related tables</li>
              </ul>

              <h4><strong>Solution Approach:</strong></h4>
              <p>
                I iteratively refined the schema, starting simple and adding complexity as needed. 
                The use of Prisma's type-safe approach helped catch relationship issues early, 
                and I learned to leverage Prisma's include syntax for efficient data fetching.
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🎨 Balancing Functionality with Usability</h3>
            </div>
            <div className="card-content">
              <h4><strong>The Challenge:</strong></h4>
              <p>
                Creating an interface that could handle complex nonprofit data management tasks 
                while remaining intuitive for users who might not be highly technical. The 
                challenge was exposing powerful features without overwhelming the user.
              </p>
              
              <h4><strong>Design Decisions:</strong></h4>
              <ul>
                <li>Progressive disclosure: showing basic info first, details on demand</li>
                <li>Role-based UI: admin features clearly separated from standard operations</li>
                <li>Responsive design: ensuring functionality across all device sizes</li>
                <li>Visual hierarchy: using color and typography to guide user attention</li>
              </ul>

              <h4><strong>Iterative Improvement:</strong></h4>
              <p>
                I constantly refined the UI based on imagined user scenarios, asking "Would a 
                busy development director find this intuitive?" This led to features like the 
                risk-level color coding and AI insight previews.
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🚀 What I Would Change or Add with More Time</h2>
            </div>
            <div className="card-content">
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">🔧 Technical Enhancements</h4>
                  </div>
                  <div className="card-content">
                    <div className="card">
                      <h4><strong>Real Authentication System</strong></h4>
                      <p>Implement proper user authentication with Auth0 or NextAuth.js, moving beyond the demo role-based access system.</p>
                      <p><strong>Priority:</strong> High</p>
                    </div>
                    
                    <div className="card">
                      <h4><strong>Advanced Database Features</strong></h4>
                      <p>Add database indexing, full-text search capabilities, and data archiving for large datasets.</p>
                      <p><strong>Priority:</strong> Medium</p>
                    </div>
                    
                    <div className="card">
                      <h4><strong>Real-time Updates</strong></h4>
                      <p>Implement WebSocket connections for live dashboard updates and collaborative editing features.</p>
                      <p><strong>Priority:</strong> Medium</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📚 What I Learned About Building Real Products</h2>
            </div>
            <div className="card-content">
              <div className="learning-insights">
                <div className="insight-card">
                  <h3>🎯 User-Centered Design is Everything</h3>
                  <p>
                    Building DonorConnect taught me that technical excellence means nothing if users 
                    can't accomplish their goals efficiently. Every feature decision had to be evaluated 
                    through the lens of "Will this help a nonprofit raise more money and build better 
                    donor relationships?"
                  </p>
                  <div className="key-lessons">
                    <h4>Key Lessons:</h4>
                    <ul>
                      <li>Start with user stories, not technical features</li>
                      <li>Simplicity often trumps advanced functionality</li>
                      <li>Context matters - nonprofit workflows are different from business workflows</li>
                      <li>Visual feedback and confirmation are crucial for trust</li>
                    </ul>
                  </div>
                </div>

                <div className="insight-card">
                  <h3>🔄 Iterative Development is Essential</h3>
                  <p>
                    I learned that building a real product means constantly refining and improving. 
                    My initial database schema, UI layouts, and AI integration approaches all evolved 
                    significantly as I better understood the problem domain and user needs.
                  </p>
                  <div className="key-lessons">
                    <h4>Development Evolution:</h4>
                    <ul>
                      <li><strong>Week 1:</strong> Basic CRUD operations and simple UI</li>
                      <li><strong>Week 2:</strong> Added relationships and improved data modeling</li>
                      <li><strong>Week 3:</strong> Integrated AI features and enhanced user experience</li>
                      <li><strong>Week 4:</strong> Polished responsiveness, added comprehensive documentation</li>
                    </ul>
                  </div>
                </div>

                <div className="insight-card">
                  <h3>⚖️ Balancing Innovation with Responsibility</h3>
                  <p>
                    Integrating AI into a nonprofit tool taught me about the weight of responsibility 
                    when building software that affects real organizations and their missions. Every 
                    AI recommendation could impact donor relationships and funding outcomes.
                  </p>
                  <div className="key-lessons">
                    <h4>Responsibility Framework:</h4>
                    <ul>
                      <li>Always provide opt-out mechanisms for automated features</li>
                      <li>Make AI decision-making processes transparent</li>
                      <li>Build in human oversight at every critical decision point</li>
                      <li>Document ethical considerations and constraints</li>
                    </ul>
                  </div>
                </div>

                <div className="insight-card">
                  <h3>🔧 Technical Debt vs. Feature Velocity</h3>
                  <p>
                    Working within project time constraints taught me about making strategic technical 
                    decisions. I had to balance building new features with maintaining clean, scalable code.
                  </p>
                  <div className="key-lessons">
                    <h4>Strategic Decisions:</h4>
                    <ul>
                      <li>Used Next.js built-in features instead of custom solutions</li>
                      <li>Leveraged Prisma for database management to reduce boilerplate</li>
                      <li>Implemented progressive enhancement - core features first, enhancements later</li>
                      <li>Documented design decisions for future development</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🤖 How AI Helped (and Where It Didn't)</h2>
            </div>
            <div className="card-content">
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">✅ Where AI Significantly Helped</h3>
                  </div>
                  <div className="card-content">
                    <p><strong>Development Acceleration:</strong> AI helped generate boilerplate components, API routes, and database models, speeding up initial development by approximately 40%.</p>
                    <p><strong>Problem-Solving & Debugging:</strong> When encountering Prisma relationship errors or Next.js routing issues, AI provided quick solutions and explanations.</p>
                    <p><strong>UI/UX Suggestions:</strong> AI provided valuable input on responsive design patterns, accessibility considerations, and user flow optimization.</p>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">⚠️ Where AI Had Limitations</h3>
                  </div>
                  <div className="card-content">
                    <p><strong>Creative & Strategic Decisions:</strong> AI couldn't make nuanced UX decisions about nonprofit workflows or understand the emotional aspects of donor relationships.</p>
                    <p><strong>Product Strategy:</strong> Decisions about which features to prioritize and how to balance user needs required human judgment and domain expertise.</p>
                    <p><strong>Visual Design:</strong> While AI could suggest layouts, the color schemes, typography choices, and visual hierarchy needed human aesthetic judgment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🎓 Key Insights & Takeaways</h2>
            </div>
            <div className="card-content">
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">💻 Technical Growth</h3>
                  </div>
                  <div className="card-content">
                    <ul>
                      <li>Learned to think in terms of user journeys, not just technical features</li>
                      <li>Gained experience with full-stack development using modern frameworks</li>
                      <li>Developed skills in API design, database modeling, and state management</li>
                      <li>Understanding of production considerations like deployment, security, and performance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">🤖 AI Integration Mastery</h3>
                  </div>
                  <div className="card-content">
                    <ul>
                      <li>Learned responsible AI implementation with privacy and ethics considerations</li>
                      <li>Developed skills in prompt engineering for consistent, useful outputs</li>
                      <li>Understanding of when to use AI vs. traditional algorithms</li>
                      <li>Experience with OpenAI API integration and error handling</li>
                    </ul>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">📊 Product Development</h3>
                  </div>
                  <div className="card-content">
                    <ul>
                      <li>Importance of understanding the problem domain deeply before building</li>
                      <li>Value of starting with MVP and iterating based on user needs</li>
                      <li>Balancing feature completeness with development time constraints</li>
                      <li>Documentation and communication are as important as code quality</li>
                    </ul>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">🌟 Personal Development</h3>
                  </div>
                  <div className="card-content">
                    <ul>
                      <li>Improved problem-solving skills through tackling complex, interconnected challenges</li>
                      <li>Greater confidence in learning and implementing new technologies</li>
                      <li>Better understanding of how to research and evaluate technical solutions</li>
                      <li>Appreciation for the complexity of real-world software development</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🔮 Looking Forward</h2>
            </div>
            <div className="card-content">
              <h3><strong>📈 Continuing Development</strong></h3>
              <p>
                Building DonorConnect has given me a foundation for continued learning and improvement. 
                I plan to keep refining the application, adding the features identified in my improvement 
                list, and potentially expanding it into a full nonprofit management suite.
              </p>
              
              <h4><strong>Immediate Next Steps:</strong></h4>
              <ul>
                <li>Implement proper authentication and user management</li>
                <li>Add comprehensive testing coverage</li>
                <li>Enhance the AI features with more sophisticated analysis</li>
                <li>Gather feedback from actual nonprofit organizations</li>
              </ul>

              <h4><strong>Long-term Vision:</strong></h4>
              <p>
                I envision DonorConnect evolving into a comprehensive nonprofit management platform 
                that helps organizations of all sizes build stronger relationships with their supporters, 
                make data-driven decisions, and ultimately increase their impact in the world.
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🙏 Acknowledgments</h2>
            </div>
            <div className="card-content">
              <p>
                This project has been both challenging and rewarding. I'm grateful for the opportunity 
                to build something meaningful while learning cutting-edge technologies. The experience 
                has prepared me for real-world development challenges and given me confidence to tackle 
                complex technical problems.
              </p>
              <p>
                <strong>Final Reflection:</strong> Building DonorConnect taught me that great software 
                isn't just about elegant code or impressive features—it's about solving real problems 
                for real people in ways that are ethical, usable, and sustainable.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <style jsx>{`
          padding: 2rem;
        }

        .challenge-content h4 {
          color: #495057;
          margin: 2rem 0 1rem 0;
          font-size: 1.2rem;
        }

        .challenge-content ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .challenge-content li {
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        .improvements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .improvement-category {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .improvement-category h3 {
          background: #f8f9fa;
          color: #2d3748;
          padding: 1.5rem;
          margin: 0;
          border-bottom: 2px solid #e2e8f0;
        }

        .improvement-list {
          padding: 1rem;
        }

        .improvement-item {
          background: #fafafa;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1rem 0;
          position: relative;
        }

        .improvement-item h4 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .improvement-item p {
          line-height: 1.6;
          color: #495057;
        }

        .priority {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .priority.high {
          background: #dc3545;
          color: white;
        }

        .priority.medium {
          background: #ffc107;
          color: #212529;
        }

        .priority.low {
          background: #28a745;
          color: white;
        }

        .learning-insights {
          display: grid;
          gap: 2rem;
          margin: 2rem 0;
        }

        .insight-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 2rem;
          border-left: 4px solid #17a2b8;
        }

        .insight-card h3 {
          color: #17a2b8;
          margin-bottom: 1rem;
        }

        .insight-card p {
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .key-lessons {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .key-lessons h4 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .key-lessons ul {
          margin: 0;
          padding-left: 2rem;
        }

        .key-lessons li {
          margin: 0.75rem 0;
          line-height: 1.5;
        }

        .ai-impact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin: 2rem 0;
        }

        .ai-helped, .ai-limitations {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .ai-helped h3 {
          background: #d4edda;
          color: #155724;
          padding: 1.5rem;
          margin: 0;
        }

        .ai-limitations h3 {
          background: #f8d7da;
          color: #721c24;
          padding: 1.5rem;
          margin: 0;
        }

        .help-category, .limitation-category {
          padding: 1.5rem;
        }

        .help-category h4, .limitation-category h4 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .help-item, .limitation-item {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 6px;
          margin: 1rem 0;
        }

        .help-item h5, .limitation-item h5 {
          color: #495057;
          margin-bottom: 0.5rem;
        }

        .help-item p, .limitation-item p {
          margin: 0;
          line-height: 1.5;
          font-size: 0.9rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .insight-highlight {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 2rem;
        }

        .insight-highlight.technical {
          border-left: 4px solid #007bff;
        }

        .insight-highlight.ai {
          border-left: 4px solid #6f42c1;
        }

        .insight-highlight.product {
          border-left: 4px solid #28a745;
        }

        .insight-highlight.personal {
          border-left: 4px solid #dc3545;
        }

        .insight-highlight h3 {
          margin-bottom: 1rem;
        }

        .insight-highlight.technical h3 { color: #007bff; }
        .insight-highlight.ai h3 { color: #6f42c1; }
        .insight-highlight.product h3 { color: #28a745; }
        .insight-highlight.personal h3 { color: #dc3545; }

        .insight-highlight ul {
          margin: 0;
          padding-left: 2rem;
        }

        .insight-highlight li {
          margin: 0.75rem 0;
          line-height: 1.5;
        }

        .outlook-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 2rem;
          margin: 2rem 0;
          border-left: 4px solid #20c997;
        }

        .outlook-card h3 {
          color: #20c997;
          margin-bottom: 1rem;
        }

        .outlook-card p {
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .next-steps, .long-term-vision {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 2rem 0;
        }

        .next-steps h4, .long-term-vision h4 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .next-steps ul {
          margin: 0;
          padding-left: 2rem;
        }

        .next-steps li {
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        .gratitude {
          margin: 4rem 0;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .gratitude h2 {
          margin-bottom: 2rem;
        }

        .gratitude-content p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .final-thoughts {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 8px;
          margin-top: 2rem;
        }

        .final-thoughts p {
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .improvements-grid, .ai-impact-grid, .insights-grid {
            grid-template-columns: 1fr;
          }
          
          .ai-impact-grid {
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  )
}