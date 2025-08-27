import React from 'react';
import LinkifyText from './LinkifyText';

interface LanguageAwareMarkdownRendererProps {
  text: string;
  className?: string;
  language?: string;
}

const LanguageAwareMarkdownRenderer: React.FC<LanguageAwareMarkdownRendererProps> = ({ 
  text, 
  className = '', 
  language = 'en' 
}) => {
  const parseMarkdown = (input: string): React.ReactNode[] => {
    if (!input) return [];

    const elements: React.ReactNode[] = [];
    let elementKey = 0;

    // Enhanced line splitting that handles different line break patterns
    // Split by various line break patterns including \n, \\n, and bullet points
    const lines = input.split(/\\n|\n/);
    
    let currentList: React.ReactNode[] = [];
    let inList = false;

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines but add proper spacing
      if (!trimmedLine) {
        if (lineIndex > 0 && lineIndex < lines.length - 1) {
          const nextLine = lines[lineIndex + 1]?.trim();
          const prevLine = lines[lineIndex - 1]?.trim();
          
          if (nextLine && prevLine) {
            elements.push(
              <div key={`single-line-${elementKey++}`} className="language-aware-line-spacing" />
            );
          }
        }
        return;
      }
      
      // Enhanced bullet point detection for different languages
      // Handles *, -, •, and also detects bullet points that might be embedded in text
      const bulletPointRegex = /^[\*\-•]\s+|(?:^|\s)[\*\-•]\s+/;
      const isBulletPoint = bulletPointRegex.test(trimmedLine);
      
      // Also check for bullet points that might be in the middle of text (common in Hindi/other languages)
      const inlineBulletRegex = /[\*\-•]\s+/g;
      const hasInlineBullets = inlineBulletRegex.test(trimmedLine) && !isBulletPoint;
      
      // Check if this line is a heading
      const isHeading = /^\*\*.*\*\*:?\s*$/.test(trimmedLine);
      
      if (isBulletPoint || hasInlineBullets) {
        // Handle bullet points - split by bullet markers and create list items
        const bulletParts = trimmedLine.split(/[\*\-•]\s+/).filter(part => part.trim());
        
        bulletParts.forEach((bulletContent, partIndex) => {
          if (bulletContent.trim()) {
            const bulletElements = parseBoldTextWithLanguageSupport(bulletContent.trim(), language);
            
            currentList.push(
              <li key={`bullet-${elementKey++}-${partIndex}`} className="language-aware-bullet-item">
                {bulletElements}
              </li>
            );
          }
        });
        inList = true;
      } else {
        // If we were in a list and this line is not a bullet, close the list
        if (inList && currentList.length > 0) {
          elements.push(
            <ul key={`list-${elementKey++}`} className="language-aware-bullet-list">
              {currentList}
            </ul>
          );
          
          elements.push(
            <div key={`post-list-spacing-${elementKey++}`} className="language-aware-post-list-spacing" />
          );
          
          currentList = [];
          inList = false;
        }
        
        // Process regular line with language-aware formatting
        const lineElements = parseBoldTextWithLanguageSupport(line, language);
        
        if (isHeading) {
          elements.push(
            <div key={`heading-${elementKey++}`} className="language-aware-heading">
              {lineElements}
            </div>
          );
        } else {
          // Add proper line breaks for non-Latin scripts
          if (lineIndex > 0 && elements.length > 0) {
            elements.push(<br key={`line-break-${elementKey++}`} />);
          }
          
          elements.push(
            <span key={`line-${elementKey++}`} className="language-aware-text">
              {lineElements}
            </span>
          );
        }
      }
    });
    
    // Close any remaining list
    if (inList && currentList.length > 0) {
      elements.push(
        <ul key={`list-${elementKey++}`} className="language-aware-bullet-list">
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
              key={`linkify-text-${keyCounter++}`} 
              text={applyLanguageSpecificFormatting(beforeText, lang)} 
            />
          );
        }
      }
      
      // Add the bold text
      elements.push(
        <strong key={`bold-${keyCounter++}`} className="language-aware-bold">
          <LinkifyText 
            text={applyLanguageSpecificFormatting(match[1], lang)} 
          />
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last bold part
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText) {
        elements.push(
          <LinkifyText 
            key={`linkify-text-${keyCounter++}`} 
            text={applyLanguageSpecificFormatting(remainingText, lang)} 
          />
        );
      }
    }
    
    // If no bold text was found, return the original text
    if (elements.length === 0) {
      elements.push(
        <LinkifyText 
          key={`linkify-text-${keyCounter++}`} 
          text={applyLanguageSpecificFormatting(text, lang)} 
        />
      );
    }
    
    return elements;
  };

  // Apply language-specific text formatting and line breaking
  const applyLanguageSpecificFormatting = (text: string, lang: string): string => {
    // For non-English languages, ensure proper word breaking at punctuation and spaces
    if (lang !== 'en') {
      // Add zero-width spaces after certain punctuation marks to help with line breaking
      text = text.replace(/([।,;:!?])/g, '$1\u200B');
      // Add zero-width spaces after certain conjunctions and particles in Devanagari
      text = text.replace(/(और|या|तथा|एवं|की|के|को|में|से|पर|का|के|की)/g, '$1\u200B');
    }
    
    return text;
  };

  const renderedContent = parseMarkdown(text);

  // Determine language direction and script
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(language);
  const isDevanagari = ['hi', 'mr', 'ne', 'sa'].includes(language);
  const isCJK = ['zh', 'ja', 'ko'].includes(language);

  return (
    <div 
      className={`language-aware-content ${className}`} 
      lang={language}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-script={isDevanagari ? 'devanagari' : isCJK ? 'cjk' : 'latin'}
    >
      {renderedContent}
    </div>
  );
};

export default LanguageAwareMarkdownRenderer;