# JobPrep - AI-Powered Career Preparation Platform

An intelligent, comprehensive platform designed to help job seekers prepare for their next career opportunity. JobPrep combines AI-powered tools with real-time industry insights to guide users through resume building, cover letter generation, interview preparation, and career development.

## 🚀 Features

### Core Features
- **AI-Powered Career Guidance** - Personalized career advice powered by Google Gemini AI
- **Resume Builder** - Create ATS-optimized resumes with AI assistance and real-time feedback
- **AI Cover Letter Generator** - Generate compelling cover letters tailored to specific job descriptions
- **Mock Interview Practice** - Practice role-specific interview questions with instant AI feedback
- **Industry Insights** - Access real-time industry trends, salary data, and market analysis
- **Performance Analytics** - Track your progress with detailed performance metrics and charts

### Additional Features
- **User Onboarding** - Personalized onboarding based on industry and expertise
- **Skill Tracking** - Maintain and showcase your professional skills
- **Assessment History** - Review past interview assessments and identify improvement areas
- **Dark Mode Support** - Seamless dark/light theme switching
- **Responsive Design** - Fully responsive UI optimized for all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with server components
- **React 19.2.3** - UI library
- **TailwindCSS 4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **Recharts** - Charts and analytics visualizations
- **Markdown Editor** - Rich text editing for resume/cover letter

### Backend
- **Next.js API Routes** - Backend API endpoints
- **Prisma 6.19.2** - ORM for database management
- **PostgreSQL** - Primary database

### Authentication & AI
- **Clerk** - User authentication and management
- **Google Gemini AI** - AI-powered content generation
- **Inngest** - Workflow automation and async tasks

### Other Tools
- **ESLint** - Code quality and linting
- **Sonner** - Toast notifications
- **html2pdf** - PDF export functionality
- **date-fns** - Date manipulation

## 📋 Prerequisites

Before getting started, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Clerk Account** (for authentication)
- **Google Gemini API Key** (for AI features)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd job-prep
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobprep

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/dashboard
CLERK_AFTER_SIGN_UP_URL=/onboarding

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Inngest (optional, for async workflows)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 4. Database Setup

#### a. Initialize Prisma
```bash
npx prisma init
```

#### b. Update Prisma Schema
The `prisma/schema.prisma` file is already configured with all necessary models.

#### c. Run Migrations
```bash
npx prisma migrate dev --name init
```

#### d. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Verify Environment
Make sure all environment variables are properly set before running the application.

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 📁 Project Structure

```
job-prep/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (main)/                   # Main authenticated routes
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── ai-cover-letter/      # Cover letter generation
│   │   │   ├── resume/               # Resume builder
│   │   │   ├── interview/            # Mock interviews
│   │   │   └── onboarding/           # User onboarding
│   │   ├── api/                      # API routes
│   │   └── layout.js                 # Root layout
│   ├── actions/                      # Server actions
│   │   ├── cover-letter.js
│   │   ├── dashboard.js
│   │   ├── interview.js
│   │   ├── resume.js
│   │   └── user.js
│   ├── components/                   # Reusable components
│   │   ├── ui/                       # UI components (Shadcn)
│   │   ├── Header.jsx
│   │   └── hero.jsx
│   ├── hooks/                        # Custom React hooks
│   │   └── use-fetch.js
│   ├── lib/                          # Utility functions
│   │   ├── prisma.js
│   │   ├── schema.js
│   │   └── checkUser.js
│   └── middleware.js                 # Next.js middleware
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations
├── data/                             # Static data
│   ├── features.js
│   ├── howItWorks.js
│   ├── faqs.js
│   ├── industries.js
│   └── testimonial.js
├── public/                           # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Key Models
- **User** - User profile with authentication metadata, industry, skills, and experience
- **Resume** - Stores user resumes with ATS scores and feedback
- **CoverLetter** - Stores generated cover letters with job descriptions
- **Assessment** - Mock interview assessments with scores and feedback
- **IndustryInsight** - Industry trends, salary data, and skill recommendations

## 🔑 Key Features Explained

### Resume Builder
- Create and manage professional resumes
- Add work experience, education, projects, and skills
- AI-powered ATS score calculation
- Export resumes to PDF

### AI Cover Letter Generator
- Generate customized cover letters based on job descriptions
- Leverage user's profile for personalized content
- Save and manage multiple cover letters
- Preview before download

### Mock Interviews
- Practice with role-specific interview questions
- Get AI-generated feedback on responses
- Track performance across multiple attempts
- View detailed performance analytics with charts

### Dashboard
- Overview of career preparation progress
- Quick access to all tools and documents
- Performance metrics and statistics
- Industry insights and salary data

## 🔐 Authentication

JobPrep uses Clerk for secure authentication. Users must:
1. Sign up with email
2. Complete onboarding (industry and skills)
3. Access the main dashboard and tools

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
vercel
```

### Environment Variables on Production
Ensure all `.env.local` variables are set in your deployment platform (Vercel, Netlify, etc.)

### Database in Production
- Use a managed PostgreSQL service (AWS RDS, Supabase, Railway, etc.)
- Update `DATABASE_URL` with production database connection string
- Run migrations: `npx prisma migrate deploy`

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### Server Actions
- `generateCoverLetter(data)` - Generate AI cover letter
- `getCoverLetters()` - Fetch user's cover letters
- `generateInterviewQuestions()` - Get interview questions
- `getUserOnboardingStatus()` - Check onboarding status
- `updateUserProfile(data)` - Update user information

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### API Key Issues
- Verify Clerk keys are correct
- Check Gemini API key validity
- Ensure keys are in `.env.local` file

### Build Errors
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Try `npm run build` again

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- Integration with LinkedIn profile import
- Real-time salary negotiation tools
- Job market predictions using ML
- Company-specific interview guides
- Peer review system for resumes and cover letters
- Video interview practice

## 💬 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ to help you land your dream job!**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
