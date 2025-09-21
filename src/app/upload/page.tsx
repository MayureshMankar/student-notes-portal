'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Define the headers type
  interface Headers {
    [key: string]: string;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !file) {
      setUploadStatus('Please fill in all required fields and select a file.');
      return;
    }
    
    setIsUploading(true);
    setUploadStatus('Uploading...');
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('subject', subject);
      formData.append('tags', tags);
      formData.append('file', file);
      
      // Only add password if note is not public
      if (!isPublic && password) {
        formData.append('password', password);
      }
      
      // Get session ID from localStorage
      const sessionId = localStorage.getItem('sessionId');
      
      // Prepare headers
      const headers: any = {};
      if (sessionId) {
        headers['Authorization'] = `Bearer ${sessionId}`;
      }
      
      const response = await fetch('/api/notes', {
        method: 'POST',
        body: formData,
        headers: headers
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUploadStatus('Upload successful!');
        // Reset form
        setTitle('');
        setDescription('');
        setSubject('');
        setTags('');
        setIsPublic(true);
        setPassword('');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Redirect to dashboard page after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setUploadStatus(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
      padding: '2.5rem 0'
    }}>
      <div className="premium-container">
        <div className="premium-card premium-card-hover" style={{ 
          maxWidth: '80rem',
          margin: '0 auto',
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1.25rem',
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
            padding: '2.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ 
                background: '#f8f8f2',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3.5rem',
                height: '3.5rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.75rem', width: '1.75rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: '#f8f8f2',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.25px'
                }}>Upload Your Notes</h1>
                <p style={{ color: '#cccccc', fontSize: '1.125rem' }}>Share your study materials with fellow students</p>
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
              
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Upload File <span style={{ color: '#f8f8f2' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <label className="premium-card-hover" style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '12rem',
                    border: '2px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.875rem',
                    cursor: 'pointer',
                    background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
                    flex: 1,
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
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: '1.75rem',
                      paddingBottom: '1.75rem'
                    }}>
                      <svg style={{ 
                        width: '2.75rem', 
                        height: '2.75rem', 
                        marginBottom: '1rem', 
                        color: '#f8f8f2' 
                      }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p style={{ 
                        marginBottom: '0.75rem', 
                        fontSize: '1rem', 
                        color: '#f8f8f2',
                        fontWeight: '600'
                      }}>
                        <span>Click to upload</span> or drag and drop
                      </p>
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: '#cccccc',
                        textAlign: 'center',
                        maxWidth: '80%',
                        lineHeight: '1.6'
                      }}>
                        PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX, CSV, JPG, JPEG, PNG, GIF (MAX. 10MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange} 
                      className="hidden" 
                      style={{ display: 'none' }} 
                      accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif"
                    />
                  </label>
                </div>
                {file && (
                  <div style={{ 
                    marginTop: '1.25rem',
                    padding: '1rem',
                    background: 'rgba(20, 20, 20, 0.7)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ 
                        background: '#f8f8f2',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', color: '#0a0a0a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ 
                          fontSize: '1rem',
                          color: '#f8f8f2',
                          fontWeight: '500',
                          marginBottom: '0.25rem'
                        }}>
                          {file.name}
                        </p>
                        <p style={{ 
                          fontSize: '0.875rem',
                          color: '#999999'
                        }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f8f8f2',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        transition: 'background 0.3s ease'
                      }}
                      className="premium-btn-secondary-hover"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="premium-btn premium-btn-primary premium-btn-hover"
                  style={{
                    width: '100%',
                    background: '#f8f8f2',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    padding: '1.125rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    opacity: isUploading ? 0.7 : 1,
                    fontSize: '1.125rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '0.25px'
                  }}
                >
                  {isUploading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                      <div style={{ 
                        border: '2px solid #0a0a0a',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        width: '1.5rem',
                        height: '1.5rem',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    'Upload Note'
                  )}
                </button>
              </div>
              
              {uploadStatus && (
                <div style={{ 
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                  background: uploadStatus.includes('successful') 
                    ? 'rgba(40, 167, 69, 0.15)' 
                    : 'rgba(220, 53, 69, 0.15)',
                  border: `1px solid ${uploadStatus.includes('successful') ? 'rgba(40, 167, 69, 0.3)' : 'rgba(220, 53, 69, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}>
                  {uploadStatus.includes('successful') ? (
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
                    fontSize: '1rem'
                  }}>
                    {uploadStatus}
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