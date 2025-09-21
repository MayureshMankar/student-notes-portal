# NotesHub - Premium Student Notes Portal

A premium, professional web application that allows students to upload study notes and share them with others. Built with the latest technologies for optimal performance and search engine visibility.

## Features

- **Upload Notes**: Students can upload their study materials with titles, descriptions, subjects, and tags
- **Browse Notes**: View all uploaded notes in a responsive premium grid layout
- **Search Functionality**: Search notes by title, description, subject, or tags
- **Download Notes**: Download any uploaded note with a single click
- **Password Protection**: Protect notes with passwords - anyone who knows the password can access
- **Public Access**: Upload notes without password protection for public access
- **All Notes Visible**: All notes (public and password-protected) are visible on the home page
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **SEO Optimized**: Built with Next.js for excellent search engine visibility
- **File Validation**: Supports common document formats (PDF, DOC, DOCX, TXT, PPT, PPTX, JPG, PNG)
- **File Size Limit**: Maximum file size of 10MB for uploads

## Technologies Used

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose (with in-memory fallback for development)
- **Authentication**: Custom session-based authentication
- **File Upload**: Multer with secure file handling
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance) - optional, in-memory storage available for development
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd student-notes-portal
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string  # Optional, uses in-memory storage if not provided
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and visit `http://localhost:3000`

## Project Structure

```
student-notes-portal/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── upload/       # Upload page
│   │   ├── page.tsx      # Home page
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── models/           # Database models
│   └── lib/              # Utility functions
├── public/               # Static assets & uploads
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

## API Endpoints

- `GET /` - Home page with all notes
- `GET /upload` - Note upload page
- `POST /api/notes` - Handle note upload
- `GET /api/notes` - Get all notes as JSON
- `GET /api/notes/[id]/download` - Download a note
- `POST /api/auth` - User authentication (login/register/logout)

## Privacy Features

1. **Public Notes**: Visible to everyone, no password required
2. **Password Protected Notes**: Visible to everyone on the home page, but require password for access
3. **Anyone with Password**: Can access password-protected notes

## SEO Features

- Semantic HTML structure
- Meta tags optimization
- Open Graph and Twitter cards
- Responsive design for all devices
- Fast loading with Next.js optimizations
- Server-side rendering for better crawlability

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Sign up at [vercel.com](https://vercel.com)
3. Create a new project and import your repository
4. Set environment variables in the Vercel dashboard
5. Deploy!

### Environment Variables for Production

```
MONGODB_URI=your_production_mongodb_connection_string
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Future Enhancements

- User profiles with avatars and bios
- Note rating and reviews
- Categories and subjects organization
- Cloud storage integration (AWS S3, Google Cloud Storage)
- Admin panel for content moderation
- Commenting system for notes
- Bookmarking favorite notes
- Social sharing features
- Dark mode support
- Mobile app versions

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created for students to share knowledge and empower learning.