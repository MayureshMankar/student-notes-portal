'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { INote } from '@/models/Note';

interface NoteMetadata {
  success: boolean;
  data?: INote[];
  error?: string;
}

interface PasswordVerificationResponse {
  success: boolean;
  data?: {
    requiresPassword: boolean;
  };
  error?: string;
}

interface DownloadVerificationResponse {
  success: boolean;
  error?: string;
}

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [note, setNote] = useState<INote | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const passwordFromUrl = searchParams.get('password');

  useEffect(() => {
    fetchNoteData();
  }, []);

  const fetchNoteData = async () => {
    try {
      setLoading(true);
      // Await params before using
      const { id } = await params;
      
      // First fetch metadata to determine file type
      const metadataResponse = await fetch(`/api/notes/${id}`);
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        if (metadata.success) {
          const noteData = metadata.data.find((n: INote) => n._id === id);
          if (noteData) {
            setNote(noteData);
            
            // If password is required and not provided, show modal
            if (noteData.isPasswordProtected && !passwordFromUrl) {
              setShowPasswordModal(true);
              setLoading(false);
              return;
            }
          }
        }
      }
      
      // Fetch preview with password if available
      const previewUrl = `/api/notes/${id}/preview${passwordFromUrl ? `?password=${passwordFromUrl}` : ''}`;
      const response = await fetch(previewUrl);
      
      // Check if it's a JSON response (password required) or binary data
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (password required)
        const data = await response.json();
        
        if (data.success) {
          // If password is required, show modal
          if (data.data.requiresPassword && !passwordFromUrl) {
            setShowPasswordModal(true);
          }
        } else {
          setError('Failed to load note preview');
        }
      } else {
        // Handle binary response (actual preview content)
        const arrayBuffer = await response.arrayBuffer();
        
        // Create blob with correct MIME type if available
        const blobType = note?.fileType || 'application/pdf';
        const blob = new Blob([arrayBuffer], { type: blobType });
        const blobUrl = URL.createObjectURL(blob);
        setPreviewContent(blobUrl);
      }
    } catch (err) {
      setError('Failed to load note preview');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async () => {
    try {
      // Await params before using
      const { id } = await params;
      const response = await fetch(`/api/notes/${id}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowPasswordModal(false);
        setPassword('');
        setPasswordError('');
        router.push(`/preview/${id}?password=${password}`);
      } else {
        setPasswordError(data.error || 'Invalid password');
      }
    } catch (error) {
      setPasswordError('Failed to verify password');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
        padding: '2.5rem',
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
          <p style={{ marginTop: '1.25rem', color: '#f8f8f2', fontSize: '1.125rem' }}>Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
        padding: '2.5rem',
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
            onClick={() => router.push('/')}
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
            Back to Home
          </button>
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
        <div className="premium-card" style={{ 
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
          }}></div>
          
          {/* Header */}
          <div style={{ 
            padding: '1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: '#f8f8f2',
                  marginBottom: '0.375rem',
                  letterSpacing: '0.25px'
                }}>{note?.title}</h1>
                <p style={{ 
                  color: '#cccccc',
                  fontSize: '1.125rem'
                }}>{note?.subject}</p>
              </div>
              <button
                onClick={() => router.back()}
                className="premium-btn-secondary-hover"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f8f8f2',
                  cursor: 'pointer',
                  padding: '0.625rem',
                  borderRadius: '0.625rem',
                  transition: 'background 0.3s ease'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.75rem', width: '1.75rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Note Info */}
          <div style={{ 
            padding: '1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.75rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                color: '#f8f8f2',
                fontSize: '1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.375rem', width: '1.375rem', marginRight: '0.625rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Uploaded: {note?.uploadDate ? new Date(note.uploadDate).toLocaleDateString() : 'Unknown'}
              </div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                color: '#f8f8f2',
                fontSize: '1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.375rem', width: '1.375rem', marginRight: '0.625rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Size: {note?.fileSize ? Math.round(note.fileSize / 1024) : 0} KB
              </div>
              {note?.downloadCount !== undefined && note.downloadCount > 0 && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: '#f8f8f2',
                  fontSize: '1rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.375rem', width: '1.375rem', marginRight: '0.625rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Downloads: {note.downloadCount}
                </div>
              )}
            </div>
            
            <p style={{ 
              color: '#f8f8f2',
              marginBottom: '1.75rem',
              lineHeight: '1.7',
              fontSize: '1.05rem'
            }}>{note?.description}</p>
            
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.625rem'
            }}>
              {note?.tags?.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#f8f8f2',
                    fontSize: '0.875rem',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontWeight: '500'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Preview Area */}
          <div style={{ padding: '1.75rem' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.75rem'
            }}>
              <h2 style={{ 
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#f8f8f2',
                letterSpacing: '0.25px'
              }}>Preview</h2>
              <Link
                href={`/api/notes/${note?._id}/download${passwordFromUrl ? `?password=${passwordFromUrl}` : ''}`}
                className="premium-btn-primary premium-btn-hover"
                style={{
                  background: '#f8f8f2',
                  color: '#0a0a0a',
                  fontWeight: '700',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.05rem',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  gap: '0.625rem'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.375rem', width: '1.375rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Full Note
              </Link>
            </div>
            
            {note?.previewAvailable && previewContent ? (
              <div style={{ 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '0.875rem',
                overflow: 'hidden',
                background: 'rgba(20, 20, 20, 0.7)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
                }}></div>
                <iframe 
                  src={previewContent} 
                  style={{ width: '100%', height: '28rem' }}
                  title="Note Preview"
                />
              </div>
            ) : note?.fileType?.startsWith('image/') ? (
              // Display image preview
              <div style={{ 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '0.875rem',
                overflow: 'hidden',
                background: 'rgba(20, 20, 20, 0.7)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                padding: '1.25rem',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
                }}></div>
                <img 
                  src={previewContent || `/api/notes/${note?._id}/download${passwordFromUrl ? `?password=${passwordFromUrl}` : ''}`}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '28rem', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div style={{ 
                border: '2px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '0.875rem',
                padding: '2.25rem',
                textAlign: 'center',
                background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: '4.5rem',
                  height: '4.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: '#f8f8f2'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2.25rem', width: '2.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p style={{ 
                  color: '#f8f8f2',
                  marginBottom: '1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Preview not available for this file type.
                </p>
                <p style={{ 
                  fontSize: '1rem',
                  color: '#cccccc',
                  lineHeight: '1.7'
                }}>
                  {note?.fileType?.startsWith('application/') ? 'Document previews require additional libraries like PDF.js for PDF files.' : 'Preview is not supported for this file type.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{ 
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1.25rem'
        }}>
          <div style={{ 
            backgroundColor: '#0a0a0a',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '28rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
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
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                margin: '0 auto',
                background: '#f8f8f2',
                borderRadius: '50%',
                padding: '0.75rem',
                width: '3.5rem',
                height: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.75rem', width: '1.75rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#f8f8f2',
                marginBottom: '0.75rem'
              }}>Password Required</h3>
              <p style={{ 
                color: '#cccccc',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>This note is password protected. Please enter the password to continue.</p>
            </div>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="premium-input"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(20, 20, 20, 0.7)',
                  padding: '0.875rem 1.25rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)',
                  color: '#f8f8f2',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                }}
              />
            </div>
            
            {passwordError && (
              <div style={{ 
                color: '#f8f8f2',
                fontSize: '0.9rem',
                backgroundColor: 'rgba(220, 53, 69, 0.15)',
                padding: '0.875rem',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.125rem', width: '1.125rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.875rem' }}>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setPasswordError('');
                }}
                className="premium-btn premium-btn-secondary premium-btn-hover"
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={verifyPassword}
                className="premium-btn premium-btn-primary premium-btn-hover"
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: '#f8f8f2',
                  color: '#0a0a0a',
                  fontWeight: '700',
                  cursor: 'pointer',
                  borderRadius: '0.75rem',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  fontSize: '1rem'
                }}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}