'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicNoteCard from '../components/PublicNoteCard';
import HeaderSearch from '../components/HeaderSearch';
import { INote } from '../models/Note';

// Define a proper user type instead of using any
interface User {
  loggedIn: boolean;
  // Add other user properties as needed
}

export default function Home() {
  const [publicNotes, setPublicNotes] = useState<INote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success) {
          // Filter for public notes only
          const publicNotesData = data.data.filter((note: INote) => !note.isPasswordProtected);
          setPublicNotes(publicNotesData);
          setFilteredNotes(publicNotesData);
        } else {
          setError(data.error || 'Failed to fetch public notes');
        }
      } catch (error) {
        console.error('Error fetching public notes:', error);
        setError('Failed to fetch public notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicNotes();
    
    // Check if user is logged in
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      setUser({ loggedIn: true });
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = publicNotes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.subject.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(publicNotes);
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
          <p style={{ marginTop: '1.25rem', color: '#f8f8f2', fontSize: '1.125rem' }}>Loading notes...</p>
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
            onClick={() => window.location.reload()}
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-container">
      {/* Hero Section */}
      <section className="fade-in-up premium-card-hover" style={{ 
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
        borderRadius: '1.25rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
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
        <h1 style={{ 
          fontSize: '2.25rem',
          fontWeight: '800',
          marginBottom: '1rem',
          color: '#f8f8f2',
          letterSpacing: '0.25px'
        }}>
          Welcome to <span style={{ color: '#f8f8f2' }}>NotesHub</span>
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          color: '#cccccc',
          marginBottom: '2rem',
          maxWidth: '45rem',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          Discover and share premium study materials with students worldwide. 
          Access high-quality notes and resources for your academic success.
        </p>
        <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            href="/upload" 
            className="premium-btn premium-btn-primary premium-btn-hover"
            style={{
              background: '#f8f8f2',
              color: '#0a0a0a',
              fontWeight: '600',
              padding: '0.875rem 1.75rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              fontSize: '0.95rem'
            }}
          >
            Upload Notes
          </Link>
          {user ? (
            <Link 
              href="/dashboard" 
              className="premium-btn premium-btn-secondary premium-btn-hover"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#f8f8f2',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '500',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.95rem'
              }}
            >
              My Dashboard
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="premium-btn premium-btn-secondary premium-btn-hover"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#f8f8f2',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '500',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.95rem'
              }}
            >
              Sign In
            </Link>
          )}
          <Link 
            href="/instructions" 
            className="premium-btn premium-btn-secondary premium-btn-hover"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#f8f8f2',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.875rem 1.75rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: '500',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.95rem'
            }}
          >
            Why Sign In?
          </Link>
        </div>
      </section>

      {/* Mobile Search Bar */}
      <div className="mobile-search-container" style={{ 
        display: 'none',
        marginBottom: '2rem'
      }}>
        <div style={{ width: '100%' }}>
          <HeaderSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Notes Grid */}
      <section>
        <h2 style={{ 
          fontSize: '1.75rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#f8f8f8',
          letterSpacing: '0.25px'
        }}>
          Latest Notes
        </h2>
        {filteredNotes.length > 0 ? (
          <div className="notes-grid">
            {filteredNotes.map((note: INote, index: number) => (
              <div 
                key={note._id} 
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PublicNoteCard note={note} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
            borderRadius: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
          }}>
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
              marginBottom: '1.5rem',
              fontSize: '1rem'
            }}>
              {searchQuery ? 'Try adjusting your search query' : 'Be the first to upload a note!'}
            </p>
            <Link 
              href="/upload" 
              className="premium-btn premium-btn-secondary premium-btn-hover"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#f8f8f2',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '500',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.95rem'
              }}
            >
              Upload Note
            </Link>
          </div>
        )}
      </section>

      {/* Features Section - REMOVED AS PER USER REQUEST */}
    </div>
  );
}