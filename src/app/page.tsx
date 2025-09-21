'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNoteCard from '@/components/PublicNoteCard';
import HeaderSearch from '@/components/HeaderSearch';
import { INote } from '@/models/Note';
import { useSearchParams } from 'next/navigation';

// Define the user interface
interface IUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  notes: string[];
}

// Define the session validation response interface
interface SessionValidationResponse {
  success: boolean;
  data?: {
    user: IUser;
  };
  error?: string;
}

export default function Home() {
  const [notes, setNotes] = useState<INote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes');
        const result = await res.json();
        // Extract the data array from the response
        const data: INote[] = Array.isArray(result) ? result : (result.data || []);
        setNotes(data);
        setFilteredNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        // Set empty array on error
        setNotes([]);
        setFilteredNotes([]);
      }
    };

    fetchNotes();
    
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
            setUser(data.data.user);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };
    
    checkAuth();
  }, []);

  // Handle search from URL params
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Filter notes based on search query
  useEffect(() => {
    if (!Array.isArray(notes)) {
      setFilteredNotes([]);
      return;
    }
    
    if (searchQuery) {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
            {filteredNotes.map((note, index) => (
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