import React from 'react';
import { styled } from '@mui/material/styles';
import LinkifyText from './LinkifyText';

const RendererContainer = styled('div')<{ language: string }>(({ theme, language }) => {
  const isDevanagari = ['hi', 'mr', 'ne', 'sa'].includes(language);
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(language);
  
  return {
    lineHeight: isDevanagari ? 1.6 : 1.5,
    wordWrap: 'break-word',
    overflowWrap: 'anywhere',
    direction: isRTL ? 'rtl' : 'ltr',
    
    '& .bullet-list': {
      margin: '8px 0',
      paddingLeft: isRTL ? 0 : '20px',
      paddingRight: isRTL ? '20px' : 0,
      listStyle: 'disc',
      listStylePosition: 'outside',
    },
    
    '& .bullet-item': {
      margin: '4px 0',
      lineHeight: isDevanagari ? 1.6 : 1.5,
      display: 'list-item',
    },
    
    '& .text-block': {
      display: 'block',
      margin: '4px 0',
    },
    
    '& .bold-text': {
      fontWeight: 700,
      color: 'inherit',
    },
  };
});

interface SimpleBulletPointRendererProps {
  text: string;
  className?: string;
  language?: string;
}

const SimpleBulletPointRenderer: React.FC<SimpleBulletPointRendererProps> = ({ 
  text, 
  className = '', 
  language = 'en' 
}) => {
  const parseTextWithBulletPoints = (input: string): React.ReactNode[] => {
    if (!input) return [];

    const elements: React.ReactNode[] = [];
    let elementKey = 0;

    // DIRECT APPROACH: Find all single asterisks that are NOT part of bold formatting
    // First, temporarily replace bold formatting to protect it
    const protectedText = input.replace(/\*\*([^*]+)\*\*/g, '___BOLD_START___$1___BOLD_END___');
    
    // Now split by single asterisks (which are now guaranteed to be bullet points)
    const parts = protectedText.split(/\s*\*\s+/);
    
    let bulletItems: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      if (!part.trim()) return;
      
      // Restore bold formatting
      const restoredPart = part.replace(/___BOLD_START___([^_]+)___BOLD_END___/g, '**$1**');
      
      if (index === 0) {
        // First part is regular text (before any bullets)
        const textElements = parseBoldText(restoredPart.trim(), language);
        elements.push(
          <div key={`text-${elementKey++}`} className="text-block">
            {textElements}
          </div>
        );
      } else {
        // All other parts are bullet items
        const bulletElements = parseBoldText(restoredPart.trim(), language);
        bulletItems.push(
          <li key={`bullet-${elementKey++}`} className="bullet-item">
            {bulletElements}
          </li>
        );
      }
    });
    
    // Add the bullet list if we have any bullet items
    if (bulletItems.length > 0) {
      elements.push(
        <ul key={`bullet-list-${elementKey++}`} className="bullet-list">
          {bulletItems}
        </ul>
      );
    }

    return elements;
  };

  const parseBoldText = (text: string, lang: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let keyCounter = 0;
    
    // Regex for bold text (**text**)
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText) {
          elements.push(
            <LinkifyText 
              key={`text-${keyCounter++}`} 
              text={beforeText} 
            />
          );
        }
      }
      
      // Add the bold text
      elements.push(
        <span key={`bold-${keyCounter++}`} className="bold-text">
          <LinkifyText text={match[1]} />
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last bold part
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText) {
        elements.push(
          <LinkifyText 
            key={`text-${keyCounter++}`} 
            text={remainingText} 
          />
        );
      }
    }
    
    // If no bold text was found, return the original text
    if (elements.length === 0) {
      elements.push(
        <LinkifyText 
          key={`text-${keyCounter++}`} 
          text={text} 
        />
      );
    }
    
    return elements;
  };

  const renderedContent = parseTextWithBulletPoints(text);

  return (
    <RendererContainer 
      className={`simple-bullet-renderer ${className}`} 
      language={language}
      lang={language}
    >
      {renderedContent}
    </RendererContainer>
  );
};

export default SimpleBulletPointRenderer;