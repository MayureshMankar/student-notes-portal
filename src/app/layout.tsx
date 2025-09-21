import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NotesHub - Premium Study Materials Platform',
  description: 'Access and share high-quality study notes with our premium platform designed for students and educators.',
  keywords: 'student, notes, study materials, education, learning, sharing, documents, premium',
  authors: [{ name: 'NotesHub' }],
  creator: 'NotesHub',
  publisher: 'NotesHub',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'NotesHub - Premium Study Materials Platform',
    description: 'Access and share high-quality study notes with our premium platform designed for students and educators.',
    type: 'website',
    locale: 'en_US',
    url: 'https://student-notes-portal.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotesHub - Premium Study Materials Platform',
    description: 'Access and share high-quality study notes with our premium platform designed for students and educators.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen`} style={{ 
        background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
        margin: 0,
        padding: 0
      }}>
        <Header />
        <main style={{ 
          minHeight: 'calc(100vh - 200px)',
          padding: '2rem 0'
        }}>
          {children}
        </main>
        <footer style={{ 
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          color: '#f8f8f2',
          padding: '2.75rem 0 1.5rem 0',
          marginTop: '3rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 -5px 25px rgba(0, 0, 0, 0.3)'
        }}>
          <div className="premium-container" style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem'
          }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.75rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ gridColumn: 'span 2' }}>
                <h3 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  marginBottom: '1rem',
                  color: '#f8f8f2',
                  letterSpacing: '0.5px'
                }}>NotesHub</h3>
                <p style={{ 
                  color: '#cccccc',
                  marginBottom: '1.25rem',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  Empowering students worldwide by sharing knowledge and study materials. 
                  Join our community of learners and educators to access premium educational resources.
                </p>
                <div className="divider-container" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '1.5rem'
                }}>
                  <div style={{ 
                    height: '1px',
                    flex: '1',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)'
                  }}></div>
                  <span style={{ 
                    color: '#f8f8f2',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Premium Study Platform</span>
                  <div style={{ 
                    height: '1px',
                    flex: '1',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))'
                  }}></div>
                </div>
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: '1.25rem',
                  color: '#f8f8f2',
                  letterSpacing: '0.25px'
                }}>
                  Quick Links
                </h3>
                <ul style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem'
                }}>
                  <li>
                    <Link href="/" style={{ 
                      color: '#cccccc',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      display: 'inline-block'
                    }}
                    className="footer-link"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/upload" style={{ 
                      color: '#cccccc',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      display: 'inline-block'
                    }}
                    className="footer-link"
                    >
                      Upload Notes
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" style={{ 
                      color: '#cccccc',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      display: 'inline-block'
                    }}
                    className="footer-link"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/instructions" style={{ 
                      color: '#cccccc',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      display: 'inline-block'
                    }}
                    className="footer-link"
                    >
                      Why Sign In?
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: '1.25rem',
                  color: '#f8f8f2',
                  letterSpacing: '0.25px'
                }}>
                  Resources
                </h3>
                <ul style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem'
                }}>
                  <li>
                    <Link href="/instructions" style={{ 
                      color: '#cccccc',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      display: 'inline-block'
                    }}
                    className="footer-link"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/instructions" style={{ 
                      color: '#cccccc',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      display: 'inline-block'
                    }}
                    className="footer-link"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              marginTop: '2rem',
              paddingTop: '1.75rem',
              textAlign: 'center',
              color: '#999999'
            }}>
              <p style={{ fontSize: '1rem' }}>&copy; {new Date().getFullYear()} NotesHub. All rights reserved.</p>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>Premium Study Materials Platform</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}