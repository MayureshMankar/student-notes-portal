"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import HeaderSearch to avoid SSR issues with useSearchParams
const HeaderSearch = dynamic(() => import('./HeaderSearch'), { 
  ssr: false,
  loading: () => <div style={{ height: '40px' }}></div> // Add loading placeholder
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Close menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial online status check
    setIsOnline(navigator.onLine);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isMenuOpen]);

  // Note: handleNavigation was defined but not used, so we'll keep it for potential future use
  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <header style={{ 
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '1rem 0',
      boxShadow: '0 5px 30px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Offline indicator */}
      {!isOnline && (
        <div style={{
          backgroundColor: '#dc3545',
          color: 'white',
          textAlign: 'center',
          padding: '0.5rem',
          fontSize: '0.9rem'
        }}>
          You are currently offline. Some features may be limited.
        </div>
      )}
      
      <div className="premium-container" style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          width: '100%'
        }}>
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link href="/" style={{ 
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#f8f8f2',
              letterSpacing: '0.5px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="nav-link-hover"
            >
              NotesHub
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="desktop-nav" style={{ 
            display: 'flex', 
            gap: '1.5rem',
            flex: '1 1 auto'
          }}>
            <Link 
              href="/" 
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.05rem',
                position: 'relative',
                letterSpacing: '0.25px'
              }}
              className="nav-link"
            >
              Home
              <span style={{
                content: '',
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                width: '0',
                height: '2px',
                background: 'linear-gradient(90deg, #8A2BE2, #FF69B4)',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} className="nav-link-underline"></span>
            </Link>
            <Link 
              href="/upload" 
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.05rem',
                position: 'relative',
                letterSpacing: '0.25px'
              }}
              className="nav-link"
            >
              Upload
              <span style={{
                content: '',
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                width: '0',
                height: '2px',
                background: 'linear-gradient(90deg, #8A2BE2, #FF69B4)',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} className="nav-link-underline"></span>
            </Link>
            <Link 
              href="/dashboard" 
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.05rem',
                position: 'relative',
                letterSpacing: '0.25px'
              }}
              className="nav-link"
            >
              Dashboard
              <span style={{
                content: '',
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                width: '0',
                height: '2px',
                background: 'linear-gradient(90deg, #8A2BE2, #FF69B4)',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} className="nav-link-underline"></span>
            </Link>
            <Link 
              href="/instructions" 
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.05rem',
                position: 'relative',
                letterSpacing: '0.25px'
              }}
              className="nav-link"
            >
              Why Sign In?
              <span style={{
                content: '',
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                width: '0',
                height: '2px',
                background: 'linear-gradient(90deg, #8A2BE2, #FF69B4)',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} className="nav-link-underline"></span>
            </Link>
          </nav>
          
          {/* Search Bar - Only show on desktop */}
          <div className="header-search-container" style={{ 
            flexShrink: 0,
            width: '300px'
          }}>
            <HeaderSearch />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{
              background: 'none',
              border: 'none',
              color: '#f8f8f2',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              transition: 'background-color 0.3s',
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 51
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="mobile-menu" 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(15px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1rem 1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
            zIndex: 49
          }}
        >
          <nav style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <Link 
              href="/"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.1rem',
                position: 'relative',
                letterSpacing: '0.25px',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              Home
            </Link>
            <Link 
              href="/upload"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.1rem',
                position: 'relative',
                letterSpacing: '0.25px',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              Upload
            </Link>
            <Link 
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.1rem',
                position: 'relative',
                letterSpacing: '0.25px',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              Dashboard
            </Link>
            <Link 
              href="/instructions"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: '#f8f8f2',
                fontWeight: '500',
                padding: '0.75rem 0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.1rem',
                position: 'relative',
                letterSpacing: '0.25px',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              Why Sign In?
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}