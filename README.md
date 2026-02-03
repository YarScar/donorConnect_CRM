# DonorConnect CRM - Intelligent Nonprofit Management System

**A comprehensive, AI-powered CRM solution designed specifically for nonprofits to revolutionize donor relationship management and fundraising effectiveness.**

DonorConnect transforms traditional donor management from spreadsheet chaos into an intelligent, integrated system that empowers nonprofits to build stronger relationships, make data-driven decisions, and maximize their fundraising potential through responsible AI integration.

## 🏗️ Architecture & Technology Stack

**Frontend Framework:** Next.js 14 with React  
**Database:** Prisma ORM with PostgreSQL (configured via `DATABASE_URL`)  
**AI Integration:** OpenAI (official `openai` npm SDK — supports `gpt-4` and `gpt-3.5-turbo`)  
**Styling:** Custom CSS with responsive design  
**Data Visualization:** Recharts library  
**Authentication:** Role-based access control system

## 🚀 Core Features

### **Donor Management Excellence**
- **Complete Donor Profiles** - Contact details, giving history, interaction timeline, and personal notes
- **AI-Powered Risk Assessment** - Intelligent analysis of donor engagement patterns and retention probability
- **Smart Donor Insights** - AI-generated recommendations for personalized outreach and stewardship strategies
- **Advanced Search & Filtering** - Multi-criteria search with real-time results
- **Role-Based Access Control** - Admin-only sensitive operations with clear permission boundaries

### **Intelligent Donation Tracking**
- **Comprehensive Gift Records** - Amount, date, payment method, campaign attribution, and donor connection
- **Automated Analytics** - Real-time giving statistics, trends analysis, and performance metrics
- **Campaign Performance Tracking** - ROI analysis and campaign effectiveness measurement
- **Multi-Channel Attribution** - Track donations across events, campaigns, and direct solicitations

### **AI-Powered Dashboard & Analytics**
- **Real-Time Statistics** - Live donor counts, donation totals, and engagement metrics
- **Predictive Analytics** - AI-driven donor risk assessment and retention forecasting
- **Intelligent Recommendations** - Automated suggestions for donor outreach and campaign optimization
- **Performance Visualization** - Interactive charts and graphs powered by Recharts

### **Comprehensive Documentation System**
- **Problem Analysis** - Detailed examination of nonprofit donor management challenges
- **Solution Architecture** - Technical implementation and feature rationale documentation
- **AI Ethics & Policy** - Comprehensive responsible AI use guidelines and safeguards
- **Evidence & Assessment** - Complete requirement fulfillment documentation
- **Development Reflection** - Learning insights and project evolution analysis

## 🤖 Responsible AI Integration

DonorConnect implements AI technology with strict ethical guidelines:

### **AI Features**
- **Donor Risk Analysis** - Predictive modeling for donor retention and engagement
- **Intelligent Insights** - Personalized recommendations for donor stewardship
- **Data-Driven Recommendations** - Strategic guidance for campaign optimization

### **AI Safeguards**
- **Data Privacy Protection** - Donor information anonymization in AI processing
- **Transparent Decision Making** - Clear explanation of AI-generated recommendations
- **Human Oversight Required** - All AI suggestions require staff review and approval
- **Fallback Mechanisms** - System continues functioning if AI services are unavailable
- **Ethical Use Policies** - Comprehensive guidelines for responsible AI implementation

## 📊 Assessment Requirements Fulfillment

### **CCC.1.1 - Problem Identification & Analysis**
- Comprehensive [About/Problem Analysis](src/app/about/page.js) page documenting nonprofit challenges
- Detailed stakeholder impact assessment and competitive analysis

### **CCC.1.2 - Solution Design & Planning**
- Complete [Why DonorConnect](src/app/why-donorconnect/page.js) solution architecture documentation
- Feature rationale and technical implementation planning

### **CCC.1.3 - Working MVP with Database Integration**
- Fully functional [Dashboard](src/app/dashboard/page.js) with real-time database connectivity
- Live donor and donation management with CRUD operations
- Interactive analytics and AI-powered insights

### **TS.6.2 - AI Ethics & Responsibility**
- Comprehensive [AI Policy & Safeguards](src/app/ai-policy/page.js) documentation
- Detailed responsible AI implementation guidelines

### **TS.6.3 - AI System Integration**
- Working AI analysis system using the official `openai` SDK ([src/app/api/ai/donor-analysis/route.js](src/app/api/ai/donor-analysis/route.js))
- Multi-layered AI insights for donor management and fundraising optimization

## 🎯 User Experience Design

### **Intuitive Navigation**
- Responsive navigation with mobile-friendly design
- Organized page grouping with dropdown documentation access
- Clear visual hierarchy and consistent theming

### **Role-Based Interface**
- **Staff Users** - Full donor and donation access with search and analysis tools
- **Admin Users** - Complete system access including donor deletion and AI policy management
- **Volunteer Users** - Limited access appropriate for data entry and basic reporting

### **Performance Optimization**
- Fast search and filtering with real-time results
- Optimized database queries and efficient data loading
- Progressive enhancement for improved user experience

## 📱 Responsive Design

DonorConnect provides a seamless experience across all devices:
- **Desktop** - Full-featured interface with comprehensive analytics
- **Tablet** - Optimized layout for data entry and donor management
- **Mobile** - Touch-friendly interface for quick donor lookups and donation recording

## 🎯 Project Goals & Impact

### **Primary Objectives**
- **Centralize Donor Intelligence** - Transform scattered spreadsheets into comprehensive donor profiles
- **Eliminate Communication Gaps** - Automated follow-up reminders and stewardship tracking
- **Empower Data-Driven Fundraising** - AI-powered insights for strategic decision making
- **Streamline Operations** - Lightweight interface optimized for nonprofit workflows
- **Ensure Data Consistency** - Standardized data entry across all team members

### **Measurable Outcomes**
- Reduce donor data fragmentation by 100% through centralized management
- Decrease missed follow-up communications by 80% with automated reminders
- Improve donor retention insights through AI-powered risk assessment
- Generate accurate, professional reports in minutes instead of hours
- Support consistent fundraising workflows across staff and volunteers

## 🛠️ Setup & Installation

### **Prerequisites**
- Node.js (version 18 or later)
- npm or yarn package manager
- PostgreSQL (local or hosted) — configured via `DATABASE_URL`
- OpenAI API key (for AI features)

### **Quick Start**

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd donorConnect_CRM
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env.local file with something like:
   OPENAI_API_KEY=your_openai_api_key_here
   # Example for a local Postgres database:
   DATABASE_URL="postgresql://user:password@localhost:5432/donorconnect_dev"
   ```

4. **Database Setup**
   For development you can push the current schema and seed sample data:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
   If you prefer to use Prisma migrations (migrations are included in `prisma/migrations`), run:
   ```bash
   # Applies migrations and seeds (dev):
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Run Tests**
   ```bash
   npm run test          # run unit/integration tests (vitest)
   npm run test:db       # run DB-specific tests
   npm run test:ai       # run AI-related tests
   ```

6. **Access Application**
   Open http://localhost:3000 in your browser

### **Production Deployment**
- Compatible with Vercel, Netlify, and other Next.js hosting platforms
- Recommended production database: PostgreSQL (or managed provider)
- Environment variables required: `OPENAI_API_KEY`, `DATABASE_URL`

## 📁 Enhanced Project Structure

```
donorConnect_CRM/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.js               # Sample data for development
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── page.js          # Enhanced home page with hero section
│   │   ├── layout.js        # Global layout with navigation
│   │   ├── about/           # Problem analysis documentation
│   │   ├── why-donorconnect/ # Solution architecture page
│   │   ├── dashboard/       # AI-powered analytics dashboard
│   │   ├── donors/          # Advanced donor management
│   │   ├── donations/       # Comprehensive donation tracking
│   │   ├── campaigns/       # Campaign management system
│   │   ├── events/          # Event coordination tools
│   │   ├── follow-ups/      # Task and reminder system
│   │   ├── ai-policy/       # AI ethics documentation
│   │   ├── evidence/        # Assessment requirement evidence
│   │   ├── reflection/      # Development learning insights
│   │   └── api/            # Enhanced API endpoints
│   │       ├── donors/      # Donor CRUD operations
│   │       ├── donations/   # Donation management API
│   │       ├── dashboard/   # Analytics data API
│   │       └── ai/         # AI analysis endpoints
│   ├── components/
│   │   ├── Navigation.js    # Enhanced responsive navigation
│   │   ├── DonorForm.js     # Comprehensive donor input form
│   │   ├── DonationForm.js  # Advanced donation entry
│   │   ├── SearchBar.js     # Intelligent search component
│   │   └── LoadingSpinner.js # User experience enhancement
│   ├── lib/
│   │   └── prisma.js        # Database connection management
│   └── styles/
│       └── globals.css      # Custom responsive CSS framework
├── package.json             # Enhanced dependencies with AI integration
└── README.md               # Comprehensive project documentation
```

## 🔒 Security & Privacy

### **Data Protection**
- Role-based access controls prevent unauthorized data manipulation
- AI processing uses anonymized donor information only
- Secure API endpoints with proper error handling
- Input validation and sanitization on all forms

### **Privacy Compliance**
- Donor data remains on your servers (not shared with external services)
- AI analysis respects data minimization principles
- Clear audit trails for all system interactions
- GDPR-conscious data handling practices

## 🤝 Contributing & Support

### **Development Guidelines**
- Maintain consistent CSS theming across all new features
- Follow Next.js 14 App Router conventions
- Implement proper error handling for all AI integrations
- Include comprehensive testing for new functionality

### **AI Ethics Commitment**
DonorConnect is committed to responsible AI use in the nonprofit sector. All AI features are designed with transparency, accountability, and human oversight as core principles.

---

**Built with ❤️ for the nonprofit community**  
*Empowering organizations to build stronger relationships and create lasting impact through intelligent donor management.*
