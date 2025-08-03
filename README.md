# ✍️ Blog Platform – Next.js + Zustand + TailwindCSS

[![CI – Blog Platform](https://github.com/rupesh-2/blog-assessment/actions/workflows/ci.yml/badge.svg)](https://github.com/rupesh-2/blog-assessment/actions/workflows/ci.yml)

> 🧪 This project was built as part of the technical assessment for the Frontend Developer role at Vynspire AI Labs.

## 🔗 Live Demo & Repository

- 🚀 Live App: [https://blog-assessment-sepia.vercel.app](https://blog-assessment-sepia.vercel.app)

## 🚀 Features

### Core Features

- **Authentication System** - JWT-based login/register with protected routes
- **Blog Post Management** - Create, edit, delete, and view posts
- **Protected Routing** - Secure dashboard and post management
- **Responsive Design** - Mobile-first design with TailwindCSS

### Bonus Features

- **Form Validation** - Yup schema validation for all forms
- **Search & Filter** - Search posts by title/content and filter by category
- **Pagination** - Efficient post listing with pagination
- **Dark/Light Mode** - Theme toggle with localStorage persistence
- **Modern UI** - Beautiful, accessible interface with Lucide icons

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Styling**: TailwindCSS v4
- **Form Handling**: React Hook Form + Yup
- **Icons**: Lucide React
- **API**: JSONPlaceholder (mock API)
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd blog-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

The platform uses a mock authentication system for demonstration:

**Demo Credentials:**

- Email: `admin@example.com`
- Password: `password`

## 📁 Project Structure

```
blog-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── posts/             # Post management
│   │   │   ├── create/        # Create new post
│   │   │   └── edit/[id]/     # Edit existing post
│   │   └── page.tsx           # Public home page
│   ├── components/            # Reusable UI components
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── Header.tsx         # Navigation header
│   │   └── PostCard.tsx       # Post display component
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   └── usePosts.ts        # Post management hook
│   ├── store/                 # Zustand stores
│   │   ├── authStore.ts       # Authentication state
│   │   ├── postStore.ts       # Post management state
│   │   └── themeStore.ts      # Theme state
│   ├── utils/                 # Utility functions
│   │   ├── jwt.ts            # JWT utilities
│   │   └── validation.ts     # Yup validation schemas
│   └── styles/               # Global styles
└── public/                   # Static assets
```

## 🎯 Key Features Explained

### Authentication System

- JWT-based authentication with localStorage persistence
- Protected routes with automatic redirects
- Mock login system (easily replaceable with real API)

### Blog Post Management

- Full CRUD operations for posts
- Rich text editing capabilities
- Category and tag support
- Search and filtering functionality

### State Management

- **Zustand** for lightweight, fast state management
- Persistent state with localStorage
- Separate stores for auth, posts, and theme

### UI/UX Features

- **Dark/Light Mode**: Toggle with persistent storage
- **Responsive Design**: Mobile-first approach
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Customization

### Adding New Categories

Edit the category options in:

- `src/app/posts/create/page.tsx`
- `src/app/posts/edit/[id]/page.tsx`

### Styling

- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Component-specific styles in individual component files

### API Integration

Replace the mock API calls in:

- `src/store/authStore.ts` (authentication)
- `src/store/postStore.ts` (post management)

## 🚀 Deployment

### Vercel

1. Pushed code to GitHub
2. Connected repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Environment Variables

Create a `.env.local` file for production:

```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_APP_NAME=Blog Platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support or questions:

- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, TailwindCSS, and Zustand**
