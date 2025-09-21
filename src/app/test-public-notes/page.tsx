'use client';

import { useState, useEffect } from 'react';
// Note: useState and useEffect were imported but not used, so we'll keep them for potential future use
import PublicNoteCard from '../../components/PublicNoteCard';
import { INote } from '../../models/Note';

export default function TestPublicNotes() {
  // Sample note data for testing
  const sampleNotes: Partial<INote>[] = [
    {
      _id: '1',
      title: 'Advanced Mathematics Notes',
      description: 'Comprehensive notes covering calculus, linear algebra, and differential equations. Perfect for university students preparing for exams.',
      subject: 'Mathematics',
      fileType: 'application/pdf',
      fileSize: 2048000,
      uploadDate: new Date(),
      downloadCount: 124,
      isPasswordProtected: false,
      tags: ['calculus', 'algebra', 'university', 'exams']
    },
    {
      _id: '2',
      title: 'Physics Laboratory Manual',
      description: 'Detailed laboratory procedures and experiment guides for undergraduate physics students. Includes safety protocols and data analysis techniques.',
      subject: 'Physics',
      fileType: 'application/pdf',
      fileSize: 1536000,
      uploadDate: new Date(Date.now() - 86400000), // Yesterday
      downloadCount: 89,
      isPasswordProtected: true,
      tags: ['laboratory', 'experiments', 'safety', 'data-analysis']
    },
    {
      _id: '3',
      title: 'Computer Science Algorithms',
      description: 'Collection of essential algorithms with implementations in Python and Java. Covers sorting, searching, and graph algorithms.',
      subject: 'Computer Science',
      fileType: 'text/plain',
      fileSize: 1024000,
      uploadDate: new Date(Date.now() - 172800000), // 2 days ago
      downloadCount: 256,
      isPasswordProtected: false,
      tags: ['algorithms', 'python', 'java', 'sorting']
    },
    {
      _id: '4',
      title: 'Chemistry Organic Reactions',
      description: 'Visual guide to organic chemistry reactions with mechanisms and examples. Ideal for organic chemistry students.',
      subject: 'Chemistry',
      fileType: 'image/png',
      fileSize: 3072000,
      uploadDate: new Date(Date.now() - 259200000), // 3 days ago
      downloadCount: 178,
      isPasswordProtected: false,
      tags: ['organic', 'reactions', 'mechanisms', 'visual']
    }
  ];

  return (
    <div className="premium-container" style={{ padding: '2rem 0' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        textAlign: 'center', 
        marginBottom: '2rem',
        color: '#f8f8f2'
      }}>
        Public Notes Preview
      </h1>
      
      <div className="notes-grid">
        {sampleNotes.map((note, index) => (
          <div 
            key={note._id} 
            className="fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PublicNoteCard note={note as INote} />
          </div>
        ))}
      </div>
    </div>
  );
}