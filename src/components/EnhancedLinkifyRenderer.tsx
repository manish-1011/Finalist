import React from 'react';
import LinkifyText from './LinkifyText';

interface EnhancedLinkifyRendererProps {
  text: string;
  className?: string;
  selectedLanguage?: string;
}

const EnhancedLinkifyRenderer: React.FC<EnhancedLinkifyRendererProps> = ({ 
  text, 
  className = '', 
  selectedLanguage = 'en' 
}) => {
  const parseMarkdownWithLinks = (input: string): React.ReactNode[] => {
    if (!input) return [];

    const elements: React.ReactNode[] = [];
    let elementKey = 0;

    // Split by line breaks and handle both \n and \\n
    const lines = input.split(/\\n|\n/);
    
    let currentList: React.ReactNode[] = [];
    let inList = false;

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines but add exactly one line spacing between content blocks
      if (!trimmedLine) {
        // Add single line spacing between content blocks
        if (lineIndex > 0 && lineIndex < lines.length - 1) {
          const nextLine = lines[lineIndex + 1]?.trim();
          const prevLine = lines[lineIndex - 1]?.trim();
          
          // Add exactly one line spacing if there's content before and after
          if (nextLine && prevLine) {
            elements.push(
              <div key={`single-line-${elementKey++}`} className="single-line-spacing" />
            );
          }
        }
        return;
      }
      
      // Check if this line is a bullet point
      const isBulletPoint = /^[\*\-•]\s+/.test(trimmedLine);
      
      // Check if this line is a heading (bold text that spans most of the line)
      const isHeading = /^\*\*.*\*\*:?\s*$/.test(trimmedLine);
      
      if (isBulletPoint) {
        // Extract the bullet point content (remove the bullet marker and space)
        const bulletContent = trimmedLine.replace(/^[\*\-•]\s+/, '');
        
        // Parse the bullet content for bold formatting and links
        const bulletElements = parseBoldTextWithLinks(bulletContent, selectedLanguage);
        
        currentList.push(
          <li key={`bullet-${elementKey++}`} className="enhanced-markdown-bullet-item">
            {bulletElements}
          </li>
        );
        inList = true;
      } else {
        // If we were in a list and this line is not a bullet, close the list
        if (inList && currentList.length > 0) {
          elements.push(
            <ul key={`list-${elementKey++}`} className="enhanced-markdown-bullet-list">
              {currentList}
            </ul>
          );
          
          // Add enhanced spacing after bullet list
          elements.push(
            <div key={`post-list-spacing-${elementKey++}`} className="post-bullet-list-spacing" />
          );
          
          currentList = [];
          inList = false;
        }
        
        // Process regular line for bold formatting and links
        const lineElements = parseBoldTextWithLinks(line, selectedLanguage);
        
        // Wrap headings in a special container for styling
        if (isHeading) {
          elements.push(
            <div key={`heading-${elementKey++}`} className="enhanced-markdown-heading">
              {lineElements}
            </div>
          );
        } else {
          // For regular paragraphs, add single line break between different content blocks
          if (lineIndex > 0 && elements.length > 0) {
            // Check if previous element was a heading or list to add proper spacing
            const needsLineBreak = elements.length > 0 && 
              (isHeading || elements[elements.length - 1]?.key?.toString().includes('heading'));
            
            if (needsLineBreak) {
              elements.push(<br key={`line-break-${elementKey++}`} />);
            }
          }
          
          elements.push(
            <span key={`line-${elementKey++}`} className="enhanced-markdown-text">
              {lineElements}
            </span>
          );
        }
      }
    });
    
    // Close any remaining list with enhanced spacing
    if (inList && currentList.length > 0) {
      elements.push(
        <ul key={`list-${elementKey++}`} className="enhanced-markdown-bullet-list">
          {currentList}
        </ul>
      );
      
      // Add enhanced spacing after final bullet list
      elements.push(
        <div key={`final-post-list-spacing-${elementKey++}`} className="post-bullet-list-spacing" />
      );
    }

    return elements;
  };

  const parseBoldTextWithLinks = (text: string, language: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let keyCounter = 0;
    
    // More robust regex to match **text** patterns
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold part (with link detection)
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText) {
          elements.push(
            <LinkifyText
              key={`linkify-text-${keyCounter++}`}
              text={ensureLanguageConsistency(beforeText, language)}
            />
          );
        }
      }
      
      // Add the bold text with language consistency and link detection
      elements.push(
        <strong key={`bold-${keyCounter++}`} className="enhanced-markdown-bold">
          <LinkifyText
            text={ensureLanguageConsistency(match[1], language)}
          />
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last bold part (with link detection)
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText) {
        elements.push(
          <LinkifyText
            key={`linkify-text-${keyCounter++}`}
            text={ensureLanguageConsistency(remainingText, language)}
          />
        );
      }
    }
    
    // If no bold text was found, return the original text with link detection
    if (elements.length === 0) {
      elements.push(
        <LinkifyText
          key={`linkify-text-${keyCounter++}`}
          text={ensureLanguageConsistency(text, language)}
        />
      );
    }
    
    return elements;
  };

  // Function to ensure language consistency in text content
  const ensureLanguageConsistency = (text: string, language: string): string => {
    // For now, we'll return the text as-is but this function can be enhanced
    // to handle specific language consistency rules based on the selected language
    return text;
  };

  const renderedContent = parseMarkdownWithLinks(text);

  return (
    <div className={`enhanced-markdown-content compact-spacing ${className}`} lang={selectedLanguage}>
      {renderedContent}
    </div>
  );
};

export default EnhancedLinkifyRenderer;