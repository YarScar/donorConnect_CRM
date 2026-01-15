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
        <section className="reflection-intro">
          <div className="intro-card">
            <h2>🎯 Project Reflection Overview</h2>
            <p>
              Building DonorConnect has been an intensive learning experience that challenged me to 
              integrate multiple technologies, design thoughtful user experiences, and implement 
              responsible AI practices. This reflection explores the challenges faced, lessons learned, 
              and insights gained throughout the development process.
            </p>
          </div>
        </section>

        <section className="challenges-section">
          <h2 className="section-title">⚡ What Challenged Me the Most</h2>
          
          <div className="challenge-cards">
            <div className="challenge-card primary">
              <h3>🤖 Implementing Responsible AI Integration</h3>
              <div className="challenge-content">
                <h4>The Challenge:</h4>
                <p>
                  The most significant challenge was implementing AI features that were both meaningful 
                  and ethically sound. I needed to balance the power of AI analysis with respect for 
                  donor privacy and nonprofit ethics, while ensuring the AI added genuine value rather 
                  than being a superficial addition.
                </p>
                
                <h4>Specific Difficulties:</h4>
                <ul>
                  <li><strong>Data Privacy:</strong> Ensuring no personally identifiable information was sent to external AI services</li>
                  <li><strong>Prompt Engineering:</strong> Crafting prompts that generated consistently useful, ethical recommendations</li>
                  <li><strong>Fallback Systems:</strong> Creating graceful degradation when AI services are unavailable</li>
                  <li><strong>User Trust:</strong> Making AI recommendations transparent and overrideable</li>
                </ul>

                <h4>How I Overcame It:</h4>
                <p>
                  I developed a dual approach: external AI (OpenAI) for complex analysis with anonymized data, 
                  and local algorithms for simpler calculations. I also implemented comprehensive user controls, 
                  transparency features, and extensive documentation of our AI approach.
                </p>
              </div>
            </div>

            <div className="challenge-card secondary">
              <h3>📊 Database Design for Nonprofit Complexity</h3>
              <div className="challenge-content">
                <h4>The Challenge:</h4>
                <p>
                  Designing a database schema that could handle the complex relationships in nonprofit 
                  fundraising: donors with multiple contact preferences, donations tied to various 
                  campaigns and events, recurring vs. one-time gifts, and flexible follow-up systems.
                </p>
                
                <h4>Learning Curve:</h4>
                <ul>
                  <li>Understanding Prisma ORM syntax and relationship definitions</li>
                  <li>Balancing normalization with query performance</li>
                  <li>Handling optional relationships (donations without campaigns)</li>
                  <li>Ensuring data integrity across related tables</li>
                </ul>

                <h4>Solution Approach:</h4>
                <p>
                  I iteratively refined the schema, starting simple and adding complexity as needed. 
                  The use of Prisma's type-safe approach helped catch relationship issues early, 
                  and I learned to leverage Prisma's include syntax for efficient data fetching.
                </p>
              </div>
            </div>

            <div className="challenge-card accent">
              <h3>🎨 Balancing Functionality with Usability</h3>
              <div className="challenge-content">
                <h4>The Challenge:</h4>
                <p>
                  Creating an interface that could handle complex nonprofit data management tasks 
                  while remaining intuitive for users who might not be highly technical. The 
                  challenge was exposing powerful features without overwhelming the user.
                </p>
                
                <h4>Design Decisions:</h4>
                <ul>
                  <li>Progressive disclosure: showing basic info first, details on demand</li>
                  <li>Role-based UI: admin features clearly separated from standard operations</li>
                  <li>Responsive design: ensuring functionality across all device sizes</li>
                  <li>Visual hierarchy: using color and typography to guide user attention</li>
                </ul>

                <h4>Iterative Improvement:</h4>
                <p>
                  I constantly refined the UI based on imagined user scenarios, asking "Would a 
                  busy development director find this intuitive?" This led to features like the 
                  risk-level color coding and AI insight previews.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="improvements-section">
          <h2 className="section-title">🚀 What I Would Change or Add with More Time</h2>
          
          <div className="improvements-grid">
            <div className="improvement-category">
              <h3>🔧 Technical Enhancements</h3>
              <div className="improvement-list">
                <div className="improvement-item">
                  <h4>Real Authentication System</h4>
                  <p>Implement proper user authentication with Auth0 or NextAuth.js, moving beyond the demo role-based access system.</p>
                  <div className="priority high">High Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Advanced Database Features</h4>
                  <p>Add database indexing, full-text search capabilities, and data archiving for large datasets.</p>
                  <div className="priority medium">Medium Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Real-time Updates</h4>
                  <p>Implement WebSocket connections for live dashboard updates and collaborative editing features.</p>
                  <div className="priority medium">Medium Priority</div>
                </div>

                <div className="improvement-item">
                  <h4>Comprehensive Testing</h4>
                  <p>Add unit tests, integration tests, and end-to-end testing with Jest and Cypress.</p>
                  <div className="priority high">High Priority</div>
                </div>
              </div>
            </div>

            <div className="improvement-category">
              <h3>🤖 AI Enhancements</h3>
              <div className="improvement-list">
                <div className="improvement-item">
                  <h4>Advanced ML Models</h4>
                  <p>Train custom models on nonprofit data for more accurate donor behavior prediction and churn analysis.</p>
                  <div className="priority high">High Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Natural Language Processing</h4>
                  <p>Analyze donor communications and feedback for sentiment analysis and relationship quality scoring.</p>
                  <div className="priority medium">Medium Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Automated Reporting</h4>
                  <p>AI-generated board reports, grant application data compilation, and impact measurement summaries.</p>
                  <div className="priority medium">Medium Priority</div>
                </div>
              </div>
            </div>

            <div className="improvement-category">
              <h3>📊 Feature Additions</h3>
              <div className="improvement-list">
                <div className="improvement-item">
                  <h4>Advanced Analytics Dashboard</h4>
                  <p>Interactive charts with drill-down capabilities, cohort analysis, and predictive forecasting.</p>
                  <div className="priority high">High Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Communication Integration</h4>
                  <p>Direct email integration, SMS capabilities, and automated follow-up sequences.</p>
                  <div className="priority high">High Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Grant Management Module</h4>
                  <p>Track grant applications, deadlines, reporting requirements, and funder relationships.</p>
                  <div className="priority medium">Medium Priority</div>
                </div>

                <div className="improvement-item">
                  <h4>Volunteer Management</h4>
                  <p>Track volunteer hours, skills, availability, and coordinate volunteer-based fundraising events.</p>
                  <div className="priority low">Low Priority</div>
                </div>
              </div>
            </div>

            <div className="improvement-category">
              <h3>🎨 User Experience</h3>
              <div className="improvement-list">
                <div className="improvement-item">
                  <h4>Advanced Search & Filtering</h4>
                  <p>Elasticsearch integration for complex queries, saved searches, and faceted filtering.</p>
                  <div className="priority high">High Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Customizable Dashboard</h4>
                  <p>Drag-and-drop dashboard widgets, personalized views, and role-specific default layouts.</p>
                  <div className="priority medium">Medium Priority</div>
                </div>
                
                <div className="improvement-item">
                  <h4>Mobile App</h4>
                  <p>Dedicated mobile application for on-the-go donor management and event check-ins.</p>
                  <div className="priority low">Low Priority</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="learning-section">
          <h2 className="section-title">📚 What I Learned About Building Real Products</h2>
          
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
        </section>

        <section className="ai-reflection">
          <h2 className="section-title">🤖 How AI Helped (and Where It Didn't)</h2>
          
          <div className="ai-impact-grid">
            <div className="ai-helped">
              <h3>✅ Where AI Significantly Helped</h3>
              
              <div className="help-category">
                <h4>🚀 Development Acceleration</h4>
                <div className="help-items">
                  <div className="help-item">
                    <h5>Code Generation & Scaffolding</h5>
                    <p>AI helped generate boilerplate components, API routes, and database models, speeding up initial development by approximately 40%.</p>
                  </div>
                  <div className="help-item">
                    <h5>Problem-Solving & Debugging</h5>
                    <p>When encountering Prisma relationship errors or Next.js routing issues, AI provided quick solutions and explanations.</p>
                  </div>
                  <div className="help-item">
                    <h5>UI/UX Suggestions</h5>
                    <p>AI provided valuable input on responsive design patterns, accessibility considerations, and user flow optimization.</p>
                  </div>
                </div>
              </div>

              <div className="help-category">
                <h4>📚 Learning & Understanding</h4>
                <div className="help-items">
                  <div className="help-item">
                    <h5>Technology Explanations</h5>
                    <p>AI explained complex concepts like Prisma relations, Next.js API routes, and React hooks with practical examples.</p>
                  </div>
                  <div className="help-item">
                    <h5>Best Practices Guidance</h5>
                    <p>Received guidance on security practices, error handling patterns, and performance optimization techniques.</p>
                  </div>
                  <div className="help-item">
                    <h5>Code Review & Optimization</h5>
                    <p>AI helped identify potential improvements, security vulnerabilities, and performance bottlenecks in my code.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ai-limitations">
              <h3>⚠️ Where AI Had Limitations</h3>
              
              <div className="limitation-category">
                <h4>🎨 Creative & Strategic Decisions</h4>
                <div className="limitation-items">
                  <div className="limitation-item">
                    <h5>User Experience Design</h5>
                    <p>AI couldn't make nuanced UX decisions about nonprofit workflows or understand the emotional aspects of donor relationships.</p>
                  </div>
                  <div className="limitation-item">
                    <h5>Product Strategy</h5>
                    <p>Decisions about which features to prioritize and how to balance user needs required human judgment and domain expertise.</p>
                  </div>
                  <div className="limitation-item">
                    <h5>Visual Design</h5>
                    <p>While AI could suggest layouts, the color schemes, typography choices, and visual hierarchy needed human aesthetic judgment.</p>
                  </div>
                </div>
              </div>

              <div className="limitation-category">
                <h4>🔧 Complex Implementation</h4>
                <div className="limitation-items">
                  <div className="limitation-item">
                    <h5>Custom AI Integration</h5>
                    <p>Implementing responsible AI features required careful prompt engineering and ethical considerations that AI couldn't fully address.</p>
                  </div>
                  <div className="limitation-item">
                    <h5>Performance Optimization</h5>
                    <p>AI suggestions for performance improvements were generic; real optimization required understanding the specific use case and data patterns.</p>
                  </div>
                  <div className="limitation-item">
                    <h5>Testing Strategy</h5>
                    <p>AI could suggest testing frameworks but couldn't design comprehensive test scenarios that covered all edge cases.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="key-insights">
          <h2 className="section-title">🎓 Key Insights & Takeaways</h2>
          
          <div className="insights-grid">
            <div className="insight-highlight technical">
              <h3>💻 Technical Growth</h3>
              <ul>
                <li>Learned to think in terms of user journeys, not just technical features</li>
                <li>Gained experience with full-stack development using modern frameworks</li>
                <li>Developed skills in API design, database modeling, and state management</li>
                <li>Understanding of production considerations like deployment, security, and performance</li>
              </ul>
            </div>

            <div className="insight-highlight ai">
              <h3>🤖 AI Integration Mastery</h3>
              <ul>
                <li>Learned responsible AI implementation with privacy and ethics considerations</li>
                <li>Developed skills in prompt engineering for consistent, useful outputs</li>
                <li>Understanding of when to use AI vs. traditional algorithms</li>
                <li>Experience with OpenAI API integration and error handling</li>
              </ul>
            </div>

            <div className="insight-highlight product">
              <h3>📊 Product Development</h3>
              <ul>
                <li>Importance of understanding the problem domain deeply before building</li>
                <li>Value of starting with MVP and iterating based on user needs</li>
                <li>Balancing feature completeness with development time constraints</li>
                <li>Documentation and communication are as important as code quality</li>
              </ul>
            </div>

            <div className="insight-highlight personal">
              <h3>🌟 Personal Development</h3>
              <ul>
                <li>Improved problem-solving skills through tackling complex, interconnected challenges</li>
                <li>Greater confidence in learning and implementing new technologies</li>
                <li>Better understanding of how to research and evaluate technical solutions</li>
                <li>Appreciation for the complexity of real-world software development</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="future-outlook">
          <h2 className="section-title">🔮 Looking Forward</h2>
          
          <div className="outlook-card">
            <h3>📈 Continuing Development</h3>
            <p>
              Building DonorConnect has given me a foundation for continued learning and improvement. 
              I plan to keep refining the application, adding the features identified in my improvement 
              list, and potentially expanding it into a full nonprofit management suite.
            </p>
            
            <div className="next-steps">
              <h4>Immediate Next Steps:</h4>
              <ul>
                <li>Implement proper authentication and user management</li>
                <li>Add comprehensive testing coverage</li>
                <li>Enhance the AI features with more sophisticated analysis</li>
                <li>Gather feedback from actual nonprofit organizations</li>
              </ul>
            </div>

            <div className="long-term-vision">
              <h4>Long-term Vision:</h4>
              <p>
                I envision DonorConnect evolving into a comprehensive nonprofit management platform 
                that helps organizations of all sizes build stronger relationships with their supporters, 
                make data-driven decisions, and ultimately increase their impact in the world.
              </p>
            </div>
          </div>
        </section>

        <section className="gratitude">
          <h2>🙏 Acknowledgments</h2>
          <div className="gratitude-content">
            <p>
              This project has been both challenging and rewarding. I'm grateful for the opportunity 
              to build something meaningful while learning cutting-edge technologies. The experience 
              has prepared me for real-world development challenges and given me confidence to tackle 
              complex technical problems.
            </p>
            <div className="final-thoughts">
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
        .reflection-intro {
          margin: 2rem 0;
        }

        .intro-card {
          background: linear-gradient(135deg, #6f42c1, #e83e8c);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .intro-card h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .intro-card p {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
          color: #2d3748;
          font-size: 2rem;
          margin: 4rem 0 2rem 0;
          padding: 1rem 0;
          border-bottom: 3px solid #e2e8f0;
          background: #f8f9fa;
          padding-left: 1rem;
          border-radius: 6px;
        }

        .challenge-cards {
          display: grid;
          gap: 2rem;
          margin: 2rem 0;
        }

        .challenge-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .challenge-card.primary {
          border-left: 5px solid #007bff;
        }

        .challenge-card.secondary {
          border-left: 5px solid #28a745;
        }

        .challenge-card.accent {
          border-left: 5px solid #ffc107;
        }

        .challenge-card h3 {
          background: #f8f9fa;
          color: #2d3748;
          padding: 1.5rem;
          margin: 0;
          border-bottom: 2px solid #e2e8f0;
        }

        .challenge-content {
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