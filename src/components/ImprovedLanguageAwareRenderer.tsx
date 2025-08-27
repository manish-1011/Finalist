import React from 'react';
import { styled } from '@mui/material/styles';
import LinkifyText from './LinkifyText';

const RendererContainer = styled('div')<{ language: string }>(({ theme, language }) => {
  const isDevanagari = ['hi', 'mr', 'ne', 'sa'].includes(language);
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(language);
  const isCJK = ['zh', 'ja', 'ko'].includes(language);
  
  return {
    lineHeight: isDevanagari ? 1.6 : isCJK ? 1.5 : 1.5,
    wordWrap: 'break-word',
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-wrap',
    direction: isRTL ? 'rtl' : 'ltr',
    
    // Enhanced text rendering for different scripts
    ...(isDevanagari && {
      fontFeatureSettings: '"kern" 1, "liga" 1',
      textRendering: 'optimizeLegibility',
    }),
    
    '& .bullet-list': {
      margin: '4px 0',
      paddingLeft: isRTL ? 0 : '18px',
      paddingRight: isRTL ? '18px' : 0,
      listStyle: 'none',
    },
    
    '& .bullet-item': {
      position: 'relative',
      margin: '3px 0',
      paddingLeft: isRTL ? 0 : '14px',
      paddingRight: isRTL ? '14px' : 0,
      lineHeight: isDevanagari ? 1.6 : 1.5,
      
      '&::before': {
        content: '"•"',
        position: 'absolute',
        left: isRTL ? 'auto' : 0,
        right: isRTL ? 0 : 'auto',
        color: 'inherit',
        fontWeight: 'bold',
      },
    },
    
    '& .text-line': {
      display: 'block',
      margin: '2px 0',
    },
    
    '& .heading': {
      margin: '4px 0 2px 0',
      lineHeight: 1.3,
      display: 'block',
      fontWeight: 700,
    },
    
    '& .bold-text': {
      fontWeight: 700,
      color: 'inherit',
    },
    
    '& .line-break': {
      display: 'block',
      height: '0.5em',
    },
  };
});

interface ImprovedLanguageAwareRendererProps {
  text: string;
  className?: string;
  language?: string;
}

const ImprovedLanguageAwareRenderer: React.FC<ImprovedLanguageAwareRendererProps> = ({ 
  text, 
  className = '', 
  language = 'en' 
}) => {
  const parseTextWithLanguageSupport = (input: string): React.ReactNode[] => {
    if (!input) return [];

    const elements: React.ReactNode[] = [];
    let elementKey = 0;

    // Enhanced preprocessing for different languages
    let processedText = input;
    
    // For non-English languages, ensure proper line breaking opportunities
    if (language !== 'en') {
      // Add zero-width spaces after punctuation for better line breaking
      processedText = processedText.replace(/([।,;:!?।])/g, '$1\u200B');
      
      // For Devanagari scripts, add breaking opportunities after common conjunctions
      if (['hi', 'mr', 'ne', 'sa'].includes(language)) {
        processedText = processedText.replace(/(और|या|तथा|एवं|की|के|को|में|से|पर|का|के|की|है|हैं|था|थे|होगा|होंगे)/g, '$1\u200B');
      }
    }

    // CRITICAL FIX: Split text specifically at single asterisks (*) that are bullet points
    // This regex finds single asterisks followed by space that are NOT part of bold formatting (**)
    const bulletSplitRegex = /(\s*\*\s+(?!\*))/g;
    
    // Split the text at bullet points while preserving the bullet markers
    const parts = processedText.split(bulletSplitRegex);
    
    let currentList: React.ReactNode[] = [];
    let inList = false;
    let isFirstPart = true;

    parts.forEach((part, partIndex) => {
      // Skip empty parts
      if (!part || part.trim() === '') return;
      
      // Check if this part is a bullet marker
      const isBulletMarker = /^\s*\*\s+$/.test(part);
      
      if (isBulletMarker) {
        // This is a bullet marker, the next part should be the bullet content
        return;
      }
      
      // Check if the previous part was a bullet marker
      const prevPart = parts[partIndex - 1];
      const isPrevBulletMarker = prevPart && /^\s*\*\s+$/.test(prevPart);
      
      if (isPrevBulletMarker) {
        // This content follows a bullet marker, so it's a bullet item
        const bulletElements = parseBoldTextWithLanguageSupport(part.trim(), language);
        
        currentList.push(
          <li key={`bullet-${elementKey++}`} className="bullet-item">
            {bulletElements}
          </li>
        );
        inList = true;
      } else {
        // This is regular text content
        
        // Close any open list first
        if (inList && currentList.length > 0) {
          elements.push(
            <ul key={`list-${elementKey++}`} className="bullet-list">
              {currentList}
            </ul>
          );
          elements.push(
            <div key={`post-list-spacing-${elementKey++}`} className="line-break" />
          );
          currentList = [];
          inList = false;
        }
        
        // Process the text content, splitting by actual line breaks
        const lines = part.split(/\\n|\n/);
        
        lines.forEach((line, lineIndex) => {
          const trimmedLine = line.trim();
          
          if (!trimmedLine) {
            if (lineIndex > 0 && lineIndex < lines.length - 1) {
              elements.push(
                <div key={`spacing-${elementKey++}`} className="line-break" />
              );
            }
            return;
          }
          
          // Check if this is a heading (bold text that spans most of the line)
          const isHeading = /^\*\*.*\*\*:?\s*$/.test(trimmedLine);
          
          const lineElements = parseBoldTextWithLanguageSupport(trimmedLine, language);
          
          if (isHeading) {
            elements.push(
              <div key={`heading-${elementKey++}`} className="heading">
                {lineElements}
              </div>
            );
          } else {
            // Add line break before content if needed (but not for the very first part)
            if (!isFirstPart && lineIndex === 0 && elements.length > 0) {
              elements.push(
                <div key={`line-break-${elementKey++}`} className="line-break" />
              );
            }
            
            elements.push(
              <div key={`text-${elementKey++}`} className="text-line">
                {lineElements}
              </div>
            );
          }
        });
        
        isFirstPart = false;
      }
    });
    
    // Close any remaining list
    if (inList && currentList.length > 0) {
      elements.push(
        <ul key={`list-${elementKey++}`} className="bullet-list">
          {currentList}
        </ul>
      );
    }

    return elements;
  };

  const parseBoldTextWithLanguageSupport = (text: string, lang: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let keyCounter = 0;
    
    // Enhanced regex for bold text that works better with non-Latin scripts
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

  const renderedContent = parseTextWithLanguageSupport(text);

  return (
    <RendererContainer 
      className={`improved-language-aware-renderer ${className}`} 
      language={language}
      lang={language}
    >
      {renderedContent}
    </RendererContainer>
  );
};

export default ImprovedLanguageAwareRenderer;