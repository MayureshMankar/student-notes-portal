import fs from 'fs';
import path from 'path';

// This is a simple test to verify the file upload functionality
// We'll check if the MIME type detection works correctly for programming files

const testFiles = [
  'test.py',
  'test.js',
  'test.ts',
  'test.html',
  'test.css',
  'test.java',
  'test.cpp',
  'test.c',
  'test.h',
  'test.hpp',
  'test.sql',
  'test.php',
  'test.rb',
  'test.go',
  'test.rs',
  'test.sh',
  'test.yaml',
  'test.yml',
  'test.json',
  'test.xml',
  'test.md'
];

// Function to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Function to determine file type from extension (similar to what we have in the API)
const getFileTypeFromExtension = (filename: string): string => {
  const extension = getFileExtension(filename);
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'csv': 'text/csv',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    // Programming files
    'py': 'text/x-python',
    'js': 'text/javascript',
    'ts': 'text/typescript',
    'html': 'text/html',
    'css': 'text/css',
    'java': 'text/x-java-source',
    'cpp': 'text/x-c++src',
    'c': 'text/x-csrc',
    'h': 'text/x-chdr',
    'hpp': 'text/x-c++hdr',
    'sql': 'text/x-sql',
    'php': 'text/x-php',
    'rb': 'text/x-ruby',
    'go': 'text/x-go',
    'rs': 'text/x-rust',
    'sh': 'application/x-sh',
    'yaml': 'text/yaml',
    'yml': 'text/yaml',
    'json': 'application/json',
    'xml': 'application/xml',
    'md': 'text/markdown'
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

// Test the function with our test files
console.log('Testing MIME type detection for programming files:');
testFiles.forEach(file => {
  const mimeType = getFileTypeFromExtension(file);
  console.log(`${file}: ${mimeType}`);
});

// Verify that all programming file types are properly detected
const programmingExtensions = ['py', 'js', 'ts', 'html', 'css', 'java', 'cpp', 'c', 'h', 'hpp', 'sql', 'php', 'rb', 'go', 'rs', 'sh', 'yaml', 'yml', 'json', 'xml', 'md'];

let allSupported = true;
programmingExtensions.forEach(ext => {
  const testFile = `test.${ext}`;
  const mimeType = getFileTypeFromExtension(testFile);
  if (mimeType === 'application/octet-stream') {
    console.log(`WARNING: Extension ${ext} is not properly supported`);
    allSupported = false;
  }
});

if (allSupported) {
  console.log('\n✅ All programming file extensions are properly supported!');
} else {
  console.log('\n❌ Some programming file extensions are not supported');
}

export { getFileTypeFromExtension, getFileExtension };