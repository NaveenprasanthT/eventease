EventEase – Event Planning and Management Tool

EventEase is a scalable and intuitive event management solution tailored for professional event planning and participant engagement.
It allows Admins, Staff, and Event Owners to manage events, track RSVPs, and engage participants with ease.

This project was developed as part of the Fullstack Developer (L2A) assignment.

🚀 Features
🔐 Authentication & Authorization

Secure login and role-based access control.

User Roles:

Admin: Full application control (manage users & system).
Staff: Manage and moderate events.
Event Owner: Create, edit, and monitor events.
Public users can view event details and RSVP without authentication.

📅 Event Management (for authenticated users)

Create, edit, and delete events.
Add event details (title, description, date, location).
Publicly shareable event page.
Manage RSVPs and attendees.

🧑‍🤝‍🧑 Attendee Management

RSVP forms (name, email).
Attendee list with timestamps.
Export attendee data (CSV).

🌍 Public Engagement

Public event page (/event/[id]).
RSVP submission without login.

✅ Additional Implementations

Secure API endpoints using Next.js Route Handlers.
Database schema designed with Prisma + PostgreSQL.
UI built with Next.js 15, Tailwind CSS v4, shadcn/ui.

Deployment-ready setup.

🛠️ Tech Stack
Language: TypeScript
Framework: Next.js 15
Runtime: Node.js 22.16.0 (Bun also supported)
Styling: Tailwind CSS v4 + shadcn/ui
Database: PostgreSQL (via Supabase)
ORM: Prisma
Authentication: Better Auth
Deployment: Vercel

⚙️ Setup Instructions

1. Clone Repository
   git clone https://github.com/NaveenprasanthT/eventease.git
   cd eventease

2. Install Dependencies
   npm install

3. Configure Environment Variables
   Copy the example environment file:
   cp .env.example .env
   Fill in the required values in .env.

4. Database Setup
   npx prisma migrate dev
   npx prisma generate

5. Run Development Server
   npm run dev


App runs at: http://localhost:3000

🔑 Credentials for Evaluation

Admin Login:

Email: naveenprasanth2109@gmail.com
Password: Naveen@777

📦 Deployment

Deployed on Vercel (Recommended).
🔗 Live URL: https://eventease.vercel.app
(replace with your actual URL)

📂 Project Structure
eventease/
├── prisma/ # Prisma schema & migrations
├── src/
│ ├── app/ # Next.js app router
│ ├── components/ # Reusable UI components
│ ├── lib/ # Auth, Prisma client, utilities
│ ├── styles/ # Tailwind configs
├── public/ # Static assets
├── .env.example # Example environment variables
├── README.md # Project documentation
└── package.json

🧪 Known Limitations
Due to time constraints, some advanced features may not be fully implemented:
Analytics dashboard for views & RSVPs.

👤 Author

Naveenprasanth T

🌐 GitHub
💼 LinkedIn
📜 License

This project is for assignment purposes only.
You own your code.

✨ Built with ❤️ using Next.js + Prisma + Tailwind + Shadcn ui
