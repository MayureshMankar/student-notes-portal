'use client';

import { INote } from '@/models/Note';
import { useState } from 'react';

interface PublicNoteCardProps {
  note: Partial<INote>; // Allow partial note data for testing
}

export default function PublicNoteCard({ note }: PublicNoteCardProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleDownload = async () => {
    // For testing notes that don't have an _id
    const noteId = note._id || 'test-note';
    
    if (note.isPasswordProtected) {
      setShowPasswordModal(true);
      return;
    }
    
    window.open(`/api/notes/${noteId}/download`, '_blank');
  };

  const verifyPassword = async () => {
    try {
      // For testing notes that don't have an _id
      const noteId = note._id || 'test-note';
      
      const response = await fetch(`/api/notes/${noteId}/download`, {
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
        window.open(`/api/notes/${noteId}/download?password=${password}`, '_blank');
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
          padding: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.1rem',
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
              padding: '0.2rem 0.6rem',
              fontSize: '0.7rem',
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
            fontSize: '0.8rem',
            fontWeight: '500',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {note.subject || 'General'}
          </span>
        </div>
        
        <div style={{ 
          padding: '1.25rem',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <p style={{ 
            color: '#f8f8f2',
            marginBottom: '1rem',
            flexGrow: 1,
            lineHeight: '1.5',
            fontSize: '0.85rem'
          }}>{note.description}</p>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '1rem'
          }}>
            {note.tags?.map((tag, index) => (
              <span 
                key={index} 
                className="premium-tag-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.7rem',
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
            fontSize: '0.7rem',
            color: '#cccccc',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <span>Uploaded: {note.uploadDate ? new Date(note.uploadDate).toLocaleDateString() : 'Unknown'}</span>
            <span>Size: {note.fileSize ? Math.round(note.fileSize / 1024) : 0} KB</span>
          </div>
          
          {note.fileType && (
            <div style={{ 
              fontSize: '0.7rem',
              color: '#cccccc',
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              File type: {note.fileType.split('/')[1]?.toUpperCase() || note.fileType}
            </div>
          )}
          
          <button
            onClick={handleDownload}
            className="premium-btn-primary premium-btn-hover"
            style={{
              width: '100%',
              padding: '0.6rem',
              fontSize: '0.9rem',
              background: '#f8f8f2',
              color: '#0a0a0a',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '0.5rem',
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
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '0.9rem', width: '0.9rem', marginRight: '0.4rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          backgroundColor: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ 
            backgroundColor: '#0a0a0a',
            borderRadius: '0.875rem',
            padding: '1.25rem',
            width: '100%',
            maxWidth: '22rem',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
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
            
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                margin: '0 auto',
                background: '#f8f8f2',
                borderRadius: '50%',
                padding: '0.5rem',
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#f8f8f2',
                marginBottom: '0.375rem'
              }}>Password Required</h3>
              <p style={{ 
                color: '#cccccc',
                lineHeight: '1.4',
                fontSize: '0.85rem'
              }}>Enter password to access this note</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Note password"
                className="premium-input"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(20, 20, 20, 0.7)',
                  padding: '0.65rem 0.875rem',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  color: '#f8f8f2',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(248, 248, 242, 0.2), 0 4px 15px rgba(0, 0, 0, 0.15)';
                  e.target.style.background = 'rgba(20, 20, 20, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                  e.target.style.background = 'rgba(20, 20, 20, 0.7)';
                }}
              />
            </div>
            
            {passwordError && (
              <div style={{ 
                color: '#f8f8f2',
                fontSize: '0.75rem',
                backgroundColor: 'rgba(220, 53, 69, 0.15)',
                padding: '0.6rem',
                borderRadius: '0.4rem',
                marginBottom: '0.75rem',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '0.8rem', width: '0.8rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setPasswordError('');
                }}
                className="premium-btn-secondary"
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f8f8f2',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  fontSize: '0.85rem'
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
                  padding: '0.6rem',
                  background: '#f8f8f2',
                  color: '#0a0a0a',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                  fontSize: '0.85rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 5px 12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.25)';
                }}
              >
                Access
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}