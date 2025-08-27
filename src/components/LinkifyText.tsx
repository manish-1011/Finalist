import React from 'react';
import { styled } from '@mui/material/styles';

const StyledLink = styled('a')(({ theme }) => ({
  color: '#1976d2 !important', // Force blue color
  textDecoration: 'underline !important',
  cursor: 'pointer !important',
  wordBreak: 'break-all',
  display: 'inline',
  '&:hover': {
    color: '#1565c0 !important',
    textDecoration: 'underline !important',
  },
  '&:visited': {
    color: '#1565c0 !important',
  },
  // Override any parent styles
  '&:link': {
    color: '#1976d2 !important',
  }
}));

interface LinkifyTextProps {
  text: string;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

const LinkifyText: React.FC<LinkifyTextProps> = ({ 
  text, 
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer'
}) => {
  // Enhanced URL detection regex that handles various URL formats including:
  // - URLs with dashes, underscores, dots in domain and path
  // - Query parameters with special characters
  // - Fragment identifiers
  // - Port numbers
  // - URLs in parentheses (but excludes the closing parenthesis if it's at the end)
  const urlRegex = /(https?:\/\/(?:[-\w._~:/?#[\]@!$&'()*+,;=%])+)/gi;
  
  const linkifyText = (inputText: string): React.ReactNode[] => {
    if (!inputText) return [];
    
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;
    
    // Reset regex lastIndex to ensure proper matching
    urlRegex.lastIndex = 0;
    
    while ((match = urlRegex.exec(inputText)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        const beforeText = inputText.slice(lastIndex, match.index);
        if (beforeText) {
          elements.push(
            <span key={`text-${keyCounter++}`}>
              {beforeText}
            </span>
          );
        }
      }
      
      // Clean up the URL - remove trailing punctuation that's likely not part of the URL
      let url = match[0];
      let trailingText = '';
      
      // Handle URLs in parentheses - if URL ends with ) and there's a ( before it, 
      // check if the ) is actually part of the URL or just closing parentheses
      const hasOpenParen = inputText.slice(0, match.index).includes('(');
      if (hasOpenParen && url.endsWith(')')) {
        // Count parentheses in the URL to see if they're balanced
        const openParens = (url.match(/\(/g) || []).length;
        const closeParens = (url.match(/\)/g) || []).length;
        
        // If there are more closing parens than opening ones, 
        // the last ) is probably not part of the URL
        if (closeParens > openParens) {
          trailingText = ')';
          url = url.slice(0, -1);
        }
      }
      
      // Remove other common trailing punctuation
      const trailingPunctuation = /[.,;:!?]+$/;
      const trailingMatch = url.match(trailingPunctuation);
      if (trailingMatch) {
        trailingText = trailingMatch[0] + trailingText;
        url = url.replace(trailingPunctuation, '');
      }
      
      // Add the URL as a clickable link
      elements.push(
        <StyledLink
          key={`link-${keyCounter++}`}
          href={url}
          target={target}
          rel={rel}
          onClick={(e) => {
            // Prevent default if URL is malformed
            try {
              new URL(url);
            } catch {
              e.preventDefault();
              console.warn('Invalid URL:', url);
            }
          }}
        >
          {url}
        </StyledLink>
      );
      
      // Add any trailing text that was removed from the URL
      if (trailingText) {
        elements.push(
          <span key={`trailing-${keyCounter++}`}>
            {trailingText}
          </span>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last URL
    if (lastIndex < inputText.length) {
      const remainingText = inputText.slice(lastIndex);
      if (remainingText) {
        elements.push(
          <span key={`text-${keyCounter++}`}>
            {remainingText}
          </span>
        );
      }
    }
    
    // If no URLs were found, return the original text
    if (elements.length === 0) {
      elements.push(
        <span key={`text-${keyCounter++}`}>
          {inputText}
        </span>
      );
    }
    
    return elements;
  };

  const processedContent = linkifyText(text);

  return (
    <span className={className}>
      {processedContent}
    </span>
  );
};

export default LinkifyText;