'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NoteCard from '@/components/NoteCard';
import { INote } from '@/models/Note';

// Define the user interface
interface IUser {
  _id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export default function DashboardPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [userNotes, setUserNotes] = useState<INote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  // Check for session immediately when component mounts
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        router.push('/login');
        return;
      }
      
      // If we have a session, check its validity
      checkAuth();
    } else {
      // If we're on the server, don't show loading state
      setLoading(false);
    }
  }, [router]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial online status check
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkAuth = async () => {
    try {
      // Get session from localStorage
      const sessionId = localStorage.getItem('sessionId');
      console.log('Retrieved session ID from localStorage:', sessionId);
      
      if (!sessionId) {
        console.log('No session ID found, redirecting to login');
        router.push('/login');
        return;
      }

      // Validate session
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      console.log('Session validation response:', data);
      
      if (!data.success) {
        console.log('Session validation failed, removing session and redirecting to login');
        localStorage.removeItem('sessionId');
        router.push('/login');
        return;
      }

      setUser(data.data.user);
      fetchUserNotes(sessionId);
    } catch (err) {
      console.error('Auth error:', err);
      // Redirect to login on any auth error
      router.push('/login');
    }
  };

  const fetchUserNotes = async (sessionId: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/notes/user', {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });

      const data = await response.json();
      console.log('User notes response:', data);
      
      if (data.success) {
        setUserNotes(data.data);
        setFilteredNotes(data.data);
      } else {
        setError('Failed to fetch your notes: ' + data.error);
      }
    } catch (err) {
      console.error('Error fetching user notes:', err);
      if (!navigator.onLine) {
        setError('You are offline. Please connect to the internet to view your notes.');
      } else {
        setError('Failed to fetch your notes. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      // Check if online
      if (!navigator.onLine) {
        alert('You are offline. Please connect to the internet to delete notes.');
        return;
      }
      
      // Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
      if (!confirmed) {
        return;
      }
      
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove note from state
        const updatedNotes = userNotes.filter(note => note._id !== noteId);
        setUserNotes(updatedNotes);
        setFilteredNotes(updatedNotes);
      } else {
        alert('Failed to delete note: ' + data.error);
      }
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const handleEdit = (noteId: string) => {
    // Check if online
    if (!navigator.onLine) {
      alert('You are offline. Please connect to the internet to edit notes.');
      return;
    }
    router.push(`/edit/${noteId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    router.push('/');
  };

  // Filter notes based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = userNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(userNotes);
    }
  }, [searchTerm, userNotes]);

  // Redirect to login immediately if no session exists
  if (typeof window !== 'undefined' && !localStorage.getItem('sessionId')) {
    router.push('/login');
    return null; // Return null while redirecting
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
        padding: '2.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '3px solid #f8f8f2',
            borderTop: '3px solid #0a0a0a',
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1.25rem', color: '#f8f8f2', fontSize: '1.125rem' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
        padding: '2.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="premium-card" style={{ 
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          borderRadius: '1.25rem',
          padding: '2.25rem',
          maxWidth: '32rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
          }}></div>
          <div style={{ 
            background: 'rgba(220, 53, 69, 0.15)',
            borderRadius: '50%',
            width: '4rem',
            height: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#f8f8f2'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2rem', width: '2rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 style={{ 
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#f8f8f2',
            marginBottom: '1.25rem'
          }}>Error</h2>
          <p style={{ color: '#f8f8f2', marginBottom: '1.75rem', fontSize: '1.05rem' }}>{error}</p>
          {!isOnline && (
            <div style={{ 
              background: 'rgba(255, 193, 7, 0.15)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              color: '#f8f8f2',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.95rem'
            }}>
              <p>You are currently offline. Some features may be limited until you reconnect to the internet.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/login')}
              className="premium-btn-primary premium-btn-hover"
              style={{
                background: '#f8f8f2',
                color: '#0a0a0a',
                fontWeight: '700',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.05rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              Go to Login
            </button>
            <button
              onClick={() => router.push('/')}
              className="premium-btn premium-btn-secondary premium-btn-hover"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#f8f8f2',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
      padding: '2.5rem 0'
    }}>
      <div className="premium-container">
        {/* Offline indicator */}
        {!isOnline && (
          <div style={{
            backgroundColor: '#dc3545',
            color: 'white',
            textAlign: 'center',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
          }}>
            You are currently offline. Some features may be limited.
          </div>
        )}
        
        {/* Header Section */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          marginBottom: '2.25rem'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#f8f8f2',
                marginBottom: '0.5rem',
                letterSpacing: '0.25px'
              }}>
                Welcome back, {user?.name || 'User'}
              </h1>
              <p style={{ 
                fontSize: '1.125rem',
                color: '#cccccc'
              }}>
                Manage your notes and study materials
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <Link
                href="/upload"
                className="premium-btn premium-btn-primary premium-btn-hover"
                style={{
                  background: '#f8f8f2',
                  color: '#0a0a0a',
                  fontWeight: '700',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  fontSize: '1rem',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Note
              </Link>
              <button
                onClick={handleLogout}
                className="premium-btn premium-btn-secondary premium-btn-hover"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="premium-card premium-card-hover" style={{ 
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
              }}></div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}>
                <div style={{ 
                  background: '#f8f8f2',
                  borderRadius: '0.875rem',
                  padding: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '0.95rem',
                    color: '#cccccc',
                    marginBottom: '0.375rem'
                  }}>
                    Total Notes
                  </p>
                  <p style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#f8f8f2'
                  }}>
                    {userNotes.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="premium-card premium-card-hover" style={{ 
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
              }}></div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}>
                <div style={{ 
                  background: '#f8f8f2',
                  borderRadius: '0.875rem',
                  padding: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '0.95rem',
                    color: '#cccccc',
                    marginBottom: '0.375rem'
                  }}>
                    Downloads
                  </p>
                  <p style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#f8f8f2'
                  }}>
                    {userNotes.reduce((total, note) => total + (note.downloadCount || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="premium-card premium-card-hover" style={{ 
              background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
              }}></div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}>
                <div style={{ 
                  background: '#f8f8f2',
                  borderRadius: '0.875rem',
                  padding: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '0.95rem',
                    color: '#cccccc',
                    marginBottom: '0.375rem'
                  }}>
                    Storage Used
                  </p>
                  <p style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#f8f8f2'
                  }}>
                    {Math.round(userNotes.reduce((total, note) => total + (note.fileSize || 0), 0) / 1024)} KB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="premium-card" style={{ 
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1.25rem',
          padding: '2.25rem',
          marginBottom: '2.25rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
          }}></div>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#f8f8f2',
                  letterSpacing: '0.25px'
                }}>
                  Your Notes
                </h2>
                <p style={{ 
                  color: '#cccccc',
                  marginTop: '0.375rem',
                  fontSize: '1.05rem'
                }}>
                  Manage all your uploaded study materials
                </p>
              </div>
              <div style={{ 
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center'
              }}>
                <div style={{ 
                  position: 'relative'
                }}>
                  <input
                    type="text"
                    placeholder="Search your notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="premium-input"
                    style={{
                      padding: '0.875rem 1.25rem 0.875rem 2.5rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(20, 20, 20, 0.7)',
                      color: '#f8f8f2',
                      fontSize: '0.95rem',
                      width: '200px',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                  <div style={{ 
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.125rem', width: '1.125rem', color: '#aaa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="notes-grid">
                {filteredNotes.map((note) => (
                  <NoteCard 
                    key={note._id} 
                    note={note} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: '4rem',
                  height: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: '#f8f8f2'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2rem', width: '2rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#f8f8f2'
                }}>
                  No notes found
                </h3>
                <p style={{ 
                  color: '#cccccc',
                  marginBottom: '1.75rem',
                  fontSize: '1.05rem'
                }}>
                  {searchTerm ? 'Try adjusting your search query' : 'Get started by uploading your first note!'}
                </p>
                <Link 
                  href="/upload" 
                  className="premium-btn premium-btn-primary premium-btn-hover"
                  style={{
                    background: '#f8f8f2',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '1.05rem',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Upload Note
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}