'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InstructionsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          const response = await fetch('/api/auth/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId })
          });
          
          const data = await response.json();
          
          if (data.success) {
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };
    
    checkAuth();
  }, []);

  const benefits = [
    {
      title: "Personal Dashboard",
      description: "Access your personalized dashboard to manage all your uploaded notes in one place.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Upload Notes",
      description: "Share your study materials with the community by uploading your own notes.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      title: "Edit & Delete",
      description: "Maintain your notes by editing or removing them anytime.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: "Save Favorites",
      description: "Bookmark important notes for quick access later.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Track Downloads",
      description: "See how many times your notes have been downloaded by other students.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Enhanced Search",
      description: "Find exactly what you need with advanced search filters.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
      padding: '2.5rem 0'
    }}>
      <div className="premium-container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '-12px',
              right: '-12px',
              bottom: '-12px',
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              borderRadius: '50%',
              zIndex: -1,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
            }}></div>
            <div style={{
              background: '#f8f8f2',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: '#0a0a0a',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2.5rem', width: '2.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 style={{ 
            fontSize: '2.25rem', // Reduced from 2.75rem to 2.25rem
            fontWeight: '700', // Reduced from 800 to 700
            marginBottom: '1.25rem',
            color: '#f8f8f2',
            letterSpacing: '0.25px'
          }}>
            Why Sign In?
          </h1>
          <p style={{ 
            fontSize: '1.125rem', // Reduced from 1.25rem to 1.125rem
            color: '#cccccc',
            maxWidth: '52rem',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Unlock the full potential of NotesHub with a free account
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.25rem',
          marginBottom: '3.5rem'
        }}>
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="premium-feature-card premium-feature-card-hover"
              style={{ 
                background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '1.25rem',
                padding: '2.25rem',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
              }}></div>
              <div style={{ 
                background: '#f8f8f2',
                borderRadius: '50%',
                width: '5.5rem',
                height: '5.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.75rem',
                color: '#0a0a0a',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
              }}>
                {benefit.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.375rem', // Reduced from 1.5rem to 1.375rem
                fontWeight: '600', // Reduced from 700 to 600
                marginBottom: '1.25rem',
                color: '#f8f8f2',
                letterSpacing: '0.25px'
              }}>
                {benefit.title}
              </h3>
              <p style={{ 
                color: '#cccccc',
                lineHeight: '1.7',
                fontSize: '1rem' // Reduced from 1.05rem to 1rem
              }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ 
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1.25rem',
          padding: '2.75rem',
          textAlign: 'center',
          marginBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
          }}></div>
          <h2 style={{ 
            fontSize: '1.75rem', // Reduced from 2.25rem to 1.75rem
            fontWeight: '700', // Reduced from 800 to 700
            marginBottom: '1.75rem',
            color: '#f8f8f2',
            letterSpacing: '0.25px'
          }}>
            Ready to get started?
          </h2>
          <p style={{ 
            fontSize: '1.05rem', // Reduced from 1.125rem to 1.05rem
            color: '#cccccc',
            marginBottom: '2.5rem',
            maxWidth: '52rem',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7'
          }}>
            Join thousands of students who are already enhancing their learning experience with NotesHub
          </p>
          
          {isLoggedIn ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              <Link 
                href="/dashboard" 
                className="premium-btn premium-btn-primary premium-btn-hover"
                style={{
                  background: '#f8f8f2',
                  color: '#0a0a0a',
                  fontWeight: '600', // Reduced from 700 to 600
                  padding: '1.125rem 2.25rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '1rem', // Reduced from 1.125rem to 1rem
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.25px'
                }}
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('sessionId');
                  setIsLoggedIn(false);
                  router.push('/');
                }}
                className="premium-btn premium-btn-secondary premium-btn-hover"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '1.125rem 2.25rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '1rem', // Reduced from 1.125rem to 1rem
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              <Link 
                href="/login" 
                className="premium-btn premium-btn-primary premium-btn-hover"
                style={{
                  background: '#f8f8f2',
                  color: '#0a0a0a',
                  fontWeight: '600', // Reduced from 700 to 600
                  padding: '1.125rem 2.25rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '1rem', // Reduced from 1.125rem to 1rem
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.25px'
                }}
              >
                Sign In
              </Link>
              <Link 
                href="/login" 
                className="premium-btn premium-btn-secondary premium-btn-hover"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '1.125rem 2.25rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '1rem', // Reduced from 1.125rem to 1rem
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div style={{ 
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1.25rem',
          padding: '2.75rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
          }}></div>
          <h2 style={{ 
            fontSize: '1.625rem', // Reduced from 2rem to 1.625rem
            fontWeight: '700', // Reduced from 800 to 700
            marginBottom: '2rem',
            color: '#f8f8f2',
            textAlign: 'center',
            letterSpacing: '0.25px'
          }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}>
            <div className="premium-card-hover" style={{ 
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.75rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: '#f8f8f2'
              }}></div>
              <h3 style={{ 
                fontSize: '1.125rem', // Reduced from 1.25rem to 1.125rem
                fontWeight: '600', // Reduced from 700 to 600
                marginBottom: '0.75rem',
                color: '#f8f8f2',
                letterSpacing: '0.25px'
              }}>
                Is signing up free?
              </h3>
              <p style={{ 
                color: '#cccccc',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                Yes, creating an account is completely free. We believe education should be accessible to everyone.
              </p>
            </div>
            
            <div className="premium-card-hover" style={{ 
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.75rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: '#f8f8f2'
              }}></div>
              <h3 style={{ 
                fontSize: '1.125rem', // Reduced from 1.25rem to 1.125rem
                fontWeight: '600', // Reduced from 700 to 600
                marginBottom: '0.75rem',
                color: '#f8f8f2',
                letterSpacing: '0.25px'
              }}>
                What information do you require?
              </h3>
              <p style={{ 
                color: '#cccccc',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                We only require a name, email address, and password to create your account. We never share your information.
              </p>
            </div>
            
            <div className="premium-card-hover" style={{ 
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.75rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: '#f8f8f2'
              }}></div>
              <h3 style={{ 
                fontSize: '1.125rem', // Reduced from 1.25rem to 1.125rem
                fontWeight: '600', // Reduced from 700 to 600
                marginBottom: '0.75rem',
                color: '#f8f8f2',
                letterSpacing: '0.25px'
              }}>
                Can I delete my account?
              </h3>
              <p style={{ 
                color: '#cccccc',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                Yes, you can delete your account at any time from your profile settings. All your data will be permanently removed.
              </p>
            </div>
            
            <div className="premium-card-hover" style={{ 
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.75rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: '#f8f8f2'
              }}></div>
              <h3 style={{ 
                fontSize: '1.125rem', // Reduced from 1.25rem to 1.125rem
                fontWeight: '600', // Reduced from 700 to 600
                marginBottom: '0.75rem',
                color: '#f8f8f2',
                letterSpacing: '0.25px'
              }}>
                How secure is my data?
              </h3>
              <p style={{ 
                color: '#cccccc',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                We use industry-standard security measures to protect your data. Your password is encrypted and never stored in plain text.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}