'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function HeaderSearch({ onSearch }: { onSearch?: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize search query from URL params
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && searchParams) {
      const currentQuery = searchParams.get('search') || '';
      setSearchQuery(currentQuery);
    }
  }, [searchParams]);

  // Handle real-time search
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && searchParams) {
      const delayDebounceFn = setTimeout(() => {
        if (onSearch) {
          onSearch(searchQuery);
        } else {
          // Update URL without page reload
          const params = new URLSearchParams(searchParams.toString());
          if (searchQuery) {
            params.set('search', searchQuery);
          } else {
            params.delete('search');
          }
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
      }, 300); // Debounce for 300ms

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, router, pathname, searchParams, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For form submission, we'll just let the effect handle it
  };

  return (
    <form 
      onSubmit={handleSearch} 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative'
      }}
    >
      <div className="search-icon-container">
        <svg 
          style={{ 
            height: '1.25rem',
            width: '1.25rem',
            color: '#aaa'
          }} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="header-search-input"
        style={{
          paddingLeft: '2.5rem',
          paddingRight: '1rem'
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
      {/* Hidden search button for form submission */}
      <button
        type="submit"
        className="header-search-button"
      >
        <svg 
          style={{ 
            height: '1.25rem',
            width: '1.25rem',
            color: '#f8f8f2'
          }} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}