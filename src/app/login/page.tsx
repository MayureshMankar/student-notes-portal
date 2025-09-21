'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          name: isLogin ? undefined : name,
          email,
          password
        })
      });
      
      const data = await response.json();
      console.log('Auth response:', data);
      
      if (data.success) {
        // Store session ID in localStorage
        try {
          localStorage.setItem('sessionId', data.data.sessionId);
          console.log('Stored session ID in localStorage:', data.data.sessionId);
          // Redirect to dashboard
          router.push('/dashboard');
        } catch (storageError) {
          console.error('localStorage error:', storageError);
          setError('Failed to store session. Please check your browser settings.');
        }
      } else {
        // Provide more specific error messages
        if (data.error === 'No account found with this email address') {
          setError('No account found with this email address. Please check your email or sign up.');
        } else if (data.error === 'Incorrect password') {
          setError('Incorrect password. Please try again.');
        } else {
          setError(data.error || 'Authentication failed');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #000000, #0a0a0a)',
      padding: '2rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="premium-container">
        <div className="premium-card premium-card-hover" style={{ 
          maxWidth: '28rem',
          margin: '0 auto',
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          padding: '2.5rem',
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
          
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                right: '-10px',
                bottom: '-10px',
                background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
                borderRadius: '50%',
                zIndex: -1,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
              }}></div>
              <div style={{
                background: '#f8f8f2',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                color: '#0a0a0a',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.75rem', width: '1.75rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h1 style={{ 
              fontSize: '1.75rem', // Reduced from 2.25rem to 1.75rem
              fontWeight: '700', // Reduced from 800 to 700
              color: '#f8f8f2',
              marginBottom: '0.625rem',
              letterSpacing: '0.25px'
            }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: '#cccccc', fontSize: '1rem' }}> 
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>
          
          {error && (
            <div style={{ 
              background: 'rgba(220, 53, 69, 0.15)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              color: '#f8f8f2',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.95rem', 
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.375rem', width: '1.375rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!isLogin && (
              <div>
                <label htmlFor="name" style={{ 
                  display: 'block',
                  fontSize: '0.95rem', // Reduced from 1rem to 0.95rem
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="premium-input"
                  placeholder="Enter your full name"
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(20, 20, 20, 0.7)',
                    padding: '1rem 1.25rem',
                    fontSize: '1rem', // Reduced from 1.05rem to 1rem
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            )}
            
            <div>
              <label htmlFor="email" style={{ 
                display: 'block',
                fontSize: '0.95rem', // Reduced from 1rem to 0.95rem
                fontWeight: '600',
                color: '#f8f8f2',
                marginBottom: '0.75rem',
                letterSpacing: '0.25px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="premium-input"
                placeholder="Enter your email"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(20, 20, 20, 0.7)',
                  padding: '1rem 1.25rem',
                  fontSize: '1rem', // Reduced from 1.05rem to 1rem
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            
            <div>
              <label htmlFor="password" style={{ 
                display: 'block',
                fontSize: '0.95rem', // Reduced from 1rem to 0.95rem
                fontWeight: '600',
                color: '#f8f8f2',
                marginBottom: '0.75rem',
                letterSpacing: '0.25px'
              }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="premium-input"
                placeholder="Enter your password"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(20, 20, 20, 0.7)',
                  padding: '1rem 1.25rem',
                  fontSize: '1rem', // Reduced from 1.05rem to 1rem
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" style={{ 
                  display: 'block',
                  fontSize: '0.95rem', // Reduced from 1rem to 0.95rem
                  fontWeight: '600',
                  color: '#f8f8f2',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.25px'
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  className="premium-input"
                  placeholder="Confirm your password"
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(20, 20, 20, 0.7)',
                    padding: '1rem 1.25rem',
                    fontSize: '1rem', // Reduced from 1.05rem to 1rem
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="premium-btn-primary premium-btn-hover"
              style={{
                width: '100%',
                background: '#f8f8f2',
                color: '#0a0a0a',
                fontWeight: '600', // Reduced from 700 to 600
                padding: '1.125rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontSize: '1rem', // Reduced from 1.125rem to 1rem
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.25px'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                  <div style={{ 
                    border: '2px solid #0a0a0a',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Processing...</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <p style={{ color: '#cccccc', fontSize: '0.95rem' }}> 
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f8f8f2',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.95rem', // Reduced from 1rem to 0.95rem
                  padding: '0',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className="premium-btn-secondary-hover"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1.5rem', 
              marginTop: '1.25rem' 
            }}>
              <p style={{ color: '#cccccc', fontSize: '0.95rem' }}> 
                <Link href="/instructions" style={{ color: '#f8f8f2', textDecoration: 'underline', fontWeight: '600' }}>
                  Why should I sign in?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}