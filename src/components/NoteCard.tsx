'use client';

import { INote } from '@/models/Note';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NoteCardProps {
  note: INote;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    if (note.isPasswordProtected) {
      setShowPasswordModal(true);
      return;
    }
    
    window.open(`/api/notes/${note._id}/download`, '_blank');
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note._id);
    } else {
      router.push(`/edit/${note._id}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      setShowDeleteConfirm(true);
    } else {
      // Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
      if (confirmed) {
        // Handle delete directly if no onDelete prop provided
        console.log('Delete note:', note._id);
      }
    }
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(note._id);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const verifyPassword = async () => {
    try {
      const response = await fetch(`/api/notes/${note._id}/download`, {
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
        
        // Proceed with download
        window.open(`/api/notes/${note._id}/download?password=${password}`, '_blank');
      } else {
        setPasswordError(data.error || 'Invalid password');
      }
    } catch (error) {
      // Note: error was defined but not used, so we'll keep it for potential future use
      setPasswordError('Failed to verify password');
    }
  };

  return (
    <>
      <div className="premium-card" style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to right, #0a0a0a, #1a1a1a)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.7)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
      }}
      >
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #f8f8f2, transparent)'
        }}></div>
        
        <div style={{ 
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.75rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#f8f8f2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              marginRight: '0.5rem'
            }}>{note.title}</h3>
            <span className={note.isPasswordProtected ? 'premium-badge-secondary' : 'premium-badge-primary'} style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '9999px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: note.isPasswordProtected ? 'rgba(255, 255, 255, 0.1)' : '#f8f8f2',
              color: note.isPasswordProtected ? '#f8f8f2' : '#0a0a0a',
              border: note.isPasswordProtected ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}>
              {note.isPasswordProtected ? 'Protected' : 'Public'}
            </span>
          </div>
          <span style={{ 
            display: 'inline-block',
            color: '#f8f8f2',
            fontSize: '0.875rem',
            fontWeight: '500',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {note.subject}
          </span>
        </div>
        
        <div style={{ 
          padding: '1.5rem',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <p style={{ 
            color: '#f8f8f2',
            marginBottom: '1.25rem',
            flexGrow: 1,
            lineHeight: '1.6',
            fontSize: '0.95rem'
          }}>{note.description}</p>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            {note.tags.map((tag, index) => (
              <span 
                key={index} 
                className="premium-tag-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#cccccc',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <span>Uploaded: {new Date(note.uploadDate).toLocaleDateString()}</span>
            <span>Size: {Math.round(note.fileSize / 1024)} KB</span>
          </div>
          
          {note.fileType && (
            <div style={{ 
              fontSize: '0.75rem',
              color: '#cccccc',
              marginBottom: '1.25rem',
              fontStyle: 'italic'
            }}>
              File type: {note.fileType.split('/')[1]?.toUpperCase() || note.fileType}
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={{ 
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={handleEdit}
              className="premium-btn-secondary premium-btn-hover"
              style={{
                flex: 1,
                padding: '0.75rem',
                fontSize: '0.9rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#f8f8f2',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '0.6rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="premium-btn-secondary premium-btn-hover"
              style={{
                flex: 1,
                padding: '0.75rem',
                fontSize: '0.9rem',
                background: 'rgba(220, 53, 69, 0.15)',
                color: '#f8f8f2',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '0.6rem',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.15)';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        
          <button
            onClick={handleDownload}
            className="premium-btn-primary premium-btn-hover"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              background: '#f8f8f2',
              color: '#0a0a0a',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '0.6rem',
              border: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Note
          </button>
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
          padding: '1rem'
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
                width: '4rem',
                height: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2rem', width: '2rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#f8f8f2'
              }}>Password Required</h3>
              <p style={{ 
                color: '#f8f8f2',
                marginTop: '0.5rem',
                lineHeight: '1.6'
              }}>This note is password protected. Please enter the password to continue.</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="premium-input"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '0.6rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(20, 20, 20, 0.7)',
                  padding: '0.85rem 1.2rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  color: '#f8f8f2',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(248, 248, 242, 0.2), 0 6px 20px rgba(0, 0, 0, 0.2)';
                  e.target.style.background = 'rgba(20, 20, 20, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                  e.target.style.background = 'rgba(20, 20, 20, 0.7)';
                }}
              />
            </div>
            
            {passwordError && (
              <div style={{ 
                color: '#f8f8f2',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(220, 53, 69, 0.15)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1rem', width: '1rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setPasswordError('');
                }}
                className="premium-btn-secondary"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '0.6rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Cancel
              </button>
              <button
                onClick={verifyPassword}
                className="premium-btn-primary"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#f8f8f2',
                  color: '#0a0a0a',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: '0.6rem',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ 
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
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
              background: 'linear-gradient(90deg, transparent, #dc3545, transparent)'
            }}></div>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                margin: '0 auto',
                background: 'rgba(220, 53, 69, 0.15)',
                borderRadius: '50%',
                padding: '0.75rem',
                width: '4rem',
                height: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(220, 53, 69, 0.3)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2rem', width: '2rem', color: '#f8f8f2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#f8f8f2'
              }}>Confirm Deletion</h3>
              <p style={{ 
                color: '#f8f8f2',
                marginTop: '0.5rem',
                lineHeight: '1.6'
              }}>Are you sure you want to delete this note? This action cannot be undone.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={cancelDelete}
                className="premium-btn-secondary"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '0.6rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="premium-btn"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(220, 53, 69, 0.15)',
                  color: '#f8f8f2',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: '0.6rem',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}