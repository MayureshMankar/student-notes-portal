'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState('');
  const [password, setPassword] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        // Await params before using
        const { id } = await params;
        
        // Get session ID
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          router.push('/login');
          return;
        }

        // Fetch note data
        const response = await fetch(`/api/notes/${id}`, {
          headers: {
            'Authorization': `Bearer ${sessionId}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          const note = data.data;
          setTitle(note.title);
          setDescription(note.description);
          setSubject(note.subject);
          setTags(note.tags.join(', '));
          setIsPublic(!note.isPasswordProtected);
          setPassword(note.password || '');
          setLoading(false);
        } else {
          setError('Failed to load note data');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load note data');
        setLoading(false);
      }
    };

    fetchNoteData();
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      setUpdateStatus('Please fill in all required fields.');
      return;
    }
    
    setIsUpdating(true);
    setUpdateStatus('Updating...');
    
    try {
      // Await params before using
      const { id } = await params;
      
      // Get session ID
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        },
        body: JSON.stringify({
          title,
          description,
          subject,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          isPasswordProtected: !isPublic,
          password: !isPublic ? password : undefined
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUpdateStatus('Update successful!');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setUpdateStatus(`Update failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      setUpdateStatus('Update failed. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

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
          <p style={{ marginTop: '1.25rem', color: '#f8f8f2', fontSize: '1.125rem' }}>Loading note...</p>
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
        <div style={{ 
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          borderRadius: '1.25rem',
          padding: '2.25rem',
          maxWidth: '32rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
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
          <button
            onClick={() => router.push('/dashboard')}
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
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
      padding: '2.5rem 0'
    }}>
      <div className="premium-container">
        <div className="premium-card" style={{ 
          maxWidth: '80rem',
          margin: '0 auto',
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
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
            padding: '2.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ 
                background: '#f8f8f2',
                borderRadius: '0.875rem',
                padding: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3.75rem',
                height: '3.75rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.75rem', width: '1.75rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: '#f8f8f2',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.25px'
                }}>Edit Note</h1>
                <p style={{ color: '#cccccc', fontSize: '1.125rem' }}>Update your note details</p>
              </div>
            </div>
          </div>
          
          <div style={{ padding: '2.25rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label htmlFor="title" style={{ 
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Note Title <span style={{ color: '#f8f8f2' }}>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="premium-input"
                  placeholder="Enter a descriptive title"
                  required
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(20, 20, 20, 0.7)',
                    padding: '1rem 1.25rem',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    color: '#f8f8f2',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </div>
              
              <div>
                <label htmlFor="subject" style={{ 
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="premium-input"
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(20, 20, 20, 0.7)',
                    padding: '1rem 1.25rem',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    color: '#f8f8f2',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </div>
              
              <div>
                <label htmlFor="description" style={{ 
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Description <span style={{ color: '#f8f8f2' }}>*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="premium-input"
                  placeholder="Describe the content of your notes. What topics are covered?"
                  required
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(20, 20, 20, 0.7)',
                    padding: '1rem 1.25rem',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'inherit',
                    color: '#f8f8f2',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </div>
              
              <div>
                <label htmlFor="tags" style={{ 
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="premium-input"
                  placeholder="e.g., calculus, derivatives, integration"
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(20, 20, 20, 0.7)',
                    padding: '1rem 1.25rem',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    color: '#f8f8f2',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <p style={{ 
                  marginTop: '0.5rem', 
                  color: '#999999', 
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  Add tags to help others find your notes more easily
                </p>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Visibility
                </label>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(1, 1fr)',
                  gap: '1.5rem'
                }}>
                  <label className="premium-card-hover" style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.875rem',
                    cursor: 'pointer',
                    background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
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
                    <input
                      type="radio"
                      name="visibility"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      style={{ 
                        height: '1.25rem',
                        width: '1.25rem',
                        color: '#f8f8f2'
                      }}
                    />
                    <div>
                      <span style={{ 
                        display: 'block', 
                        fontWeight: '700', 
                        color: '#f8f8f2',
                        fontSize: '1.125rem',
                        marginBottom: '0.25rem'
                      }}>
                        Public
                      </span>
                      <span style={{ 
                        display: 'block', 
                        color: '#cccccc', 
                        marginTop: '0.25rem',
                        fontSize: '1rem',
                        lineHeight: '1.6'
                      }}>
                        Anyone can view and download without password
                      </span>
                    </div>
                  </label>
                  
                  <label className="premium-card-hover" style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.875rem',
                    cursor: 'pointer',
                    background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
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
                    <input
                      type="radio"
                      name="visibility"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      style={{ 
                        height: '1.25rem',
                        width: '1.25rem',
                        color: '#f8f8f2'
                      }}
                    />
                    <div>
                      <span style={{ 
                        display: 'block', 
                        fontWeight: '700', 
                        color: '#f8f8f2',
                        fontSize: '1.125rem',
                        marginBottom: '0.25rem'
                      }}>
                        Password Protected
                      </span>
                      <span style={{ 
                        display: 'block', 
                        color: '#cccccc', 
                        marginTop: '0.25rem',
                        fontSize: '1rem',
                        lineHeight: '1.6'
                      }}>
                        Only accessible with password
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              
              {!isPublic && (
                <div>
                  <label htmlFor="password" style={{ 
                    display: 'block',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#f8f8f2',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.25px'
                  }}>
                    Password <span style={{ color: '#f8f8f2' }}>*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="premium-input"
                    placeholder="Set a password to protect your note"
                    required={!isPublic}
                    style={{
                      display: 'block',
                      width: '100%',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(20, 20, 20, 0.7)',
                      padding: '1rem 1.25rem',
                      fontSize: '1.05rem',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      color: '#f8f8f2',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                  <p style={{ 
                    marginTop: '0.75rem', 
                    color: '#cccccc', 
                    fontSize: '0.95rem'
                  }}>
                    Anyone who knows this password can access the note
                  </p>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="premium-btn premium-btn-secondary premium-btn-hover"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#f8f8f2',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '1.125rem',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.625rem'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="premium-btn premium-btn-primary premium-btn-hover"
                  style={{
                    flex: 1,
                    background: '#f8f8f2',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    padding: '1.125rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    opacity: isUpdating ? 0.7 : 1,
                    fontSize: '1.125rem',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.625rem'
                  }}
                >
                  {isUpdating ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                      <div style={{ 
                        border: '2px solid #0a0a0a',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        width: '1.25rem',
                        height: '1.25rem',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update Note
                    </>
                  )}
                </button>
              </div>
              
              {updateStatus && (
                <div style={{ 
                  padding: '1.125rem',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                  background: updateStatus.includes('successful') 
                    ? 'rgba(40, 167, 69, 0.15)' 
                    : 'rgba(220, 53, 69, 0.15)',
                  border: `1px solid ${updateStatus.includes('successful') ? 'rgba(40, 167, 69, 0.3)' : 'rgba(220, 53, 69, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.875rem'
                }}>
                  {updateStatus.includes('successful') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <p style={{ 
                    color: '#f8f8f2',
                    fontWeight: '600',
                    fontSize: '1.05rem'
                  }}>
                    {updateStatus}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}