# Smart Habit Tracker

A modern, responsive web application for tracking daily habits, visualizing progress, and building consistency. This application helps users create and maintain positive habits by providing visual feedback, streak tracking, and detailed analytics.

![Smart Habit Tracker](https://via.placeholder.com/1200x600?text=Smart+Habit+Tracker)

## 🚀 Features

- **Auth0 Authentication**: Secure login and user management
- **Habit Management**: Create, edit, and delete habits with custom tags
- **Daily Tracking**: Mark habits as complete each day
- **Streak Tracking**: Monitor your consistency with streak counters
- **Visual Analytics**: View your progress with interactive charts
- **Calendar View**: See your habit completion history on a calendar
- **Tag Filtering**: Organize and filter habits by custom tags
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Choose your preferred theme
- **Detailed Statistics**: Track completion rates and progress over time

## 💻 Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Shadcn UI, Tailwind CSS
- **Authentication**: Auth0
- **Charts**: Recharts
- **State Management**: React Hooks
- **Routing**: Next.js App Router
- **Form Handling**: React Hook Form
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🔧 Installation & Setup

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install

# or

yarn install
\`\`\`

3. **Configure Auth0**

- Create an account on [Auth0](https://auth0.com/) if you don't have one
- Create a new application in the Auth0 dashboard
- Set the application type to "Single Page Application"
- Add `http://localhost:3000` to the Allowed Callback URLs, Allowed Logout URLs, and Allowed Web Origins
- Update the Auth0 configuration in `lib/auth.tsx` with your Auth0 domain and client ID:

\`\`\`typescript
const auth0Config: Auth0ProviderOptions = {
domain: "your-domain.auth0.com", // Replace with your Auth0 domain
clientId: "your-client-id", // Replace with your Auth0 client ID
authorizationParams: {
redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
},
}
\`\`\`

4. **Start the development server**

\`\`\`bash
npm run dev

# or

yarn dev
\`\`\`

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 🎮 Usage

### Authentication

- Click "Sign Up" or "Login" on the homepage to create an account or sign in
- The application uses Auth0 for authentication, so you can use social logins or email/password

### Dashboard

- After logging in, you'll be redirected to the dashboard
- The dashboard shows an overview of your habits and progress
- View weekly and monthly completion charts
- See your current streaks and completion rates

### Managing Habits

- Click "Add Habit" to create a new habit
- Fill in the habit details including name, description, and tags
- View all your habits on the Habits page
- Click on a habit to view its details, edit, or delete it
- Mark habits as complete by clicking the "Mark as Complete" button

### Calendar View

- Navigate to the Calendar page to see your habit completion history
- Filter by specific habits to see individual completion patterns
- View statistics for any selected date

### Settings

- Customize your profile and application preferences
- Toggle between light and dark mode
- Manage notification preferences

## 🧪 Testing

### Running Tests

The application includes unit tests for components and functionality. To run the tests:

\`\`\`bash
npm test

# or

yarn test
\`\`\`

### Manual Testing

To manually test the application:

1. Create a new habit from the dashboard or habits page
2. Mark habits as complete/incomplete
3. Edit an existing habit
4. Delete a habit
5. Filter habits by tags
6. View the calendar and check different dates
7. Toggle between light and dark mode
8. Test the responsive design by resizing your browser window

## 📁 Project Structure

\`\`\`
habit-tracker/
├── app/ # Next.js app directory
│ ├── dashboard/ # Dashboard and protected routes
│ ├── login/ # Login page
│ ├── signup/ # Signup page
│ ├── layout.tsx # Root layout
│ └── page.tsx # Homepage
├── components/ # React components
│ ├── ui/ # UI components from shadcn
│ ├── habit-form.tsx # Habit creation/editing form
│ └── ... # Other components
├── lib/ # Utility functions and services
│ ├── auth.tsx # Auth0 integration
│ ├── habit-service.ts # Habit data management
│ └── utils.ts # Helper functions
├── public/ # Static assets
├── styles/ # Global styles
├── types/ # TypeScript type definitions
├── **tests**/ # Test files
├── next.config.js # Next.js configuration
├── package.json # Project dependencies
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json # TypeScript configuration
\`\`\`

## 🖼️ Screenshots

The application includes the following main screens:

- Homepage with feature overview
- Login and signup pages
- Dashboard with habit overview and charts
- Habits list page with filtering options
- Habit detail page with streak tracking
- Calendar view for historical tracking
- Settings page for user preferences

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Auth0](https://auth0.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ by [Your Name]
