import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Paper, 
  Stack, 
  Box,
  Alert,
  Chip,
  Button,
  ButtonGroup
} from '@mui/material';
import MarkdownRenderer from './components/MarkdownRenderer';
import LanguageAwareMarkdownRenderer from './components/LanguageAwareMarkdownRenderer';
import ImprovedLanguageAwareRenderer from './components/ImprovedLanguageAwareRenderer';
import SimpleBulletPointRenderer from './components/SimpleBulletPointRenderer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F7507',
      light: '#5B9E08',
      dark: '#1C5404',
    },
    background: {
      default: '#F4F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Arial, sans-serif',
  },
});

const ImprovedHindiMarkdownFix: React.FC = () => {
  const [selectedRenderer, setSelectedRenderer] = useState<'original' | 'old-fix' | 'improved' | 'simple'>('simple');

  // The problematic Hindi text from the original issue
  const problematicHindiText = `नासिक में प्याज की कीमतें अलग-अलग हैं। * लाल प्याज: ₹20-₹23/किग्रा * सफेद प्याज: ₹18.5-₹27/किग्रा * अन्य स्थानीय किस्में: ₹18-₹22/किग्रा * औसत मंडी मूल्य: ₹1201-₹1301.13/क्विंटल। न्यूनतम: ₹200-₹401/क्विंटल। अधिकतम: ₹1601-₹2200/क्विंटल। गुणवत्ता और बाजार की स्थितियों के आधार पर कीमतों में उतार-चढ़ाव होता रहता है।`;

  // English text for comparison
  const englishText = `Market prices vary in Nashik. * Red Onion: ₹20-₹23/kg * White Onion: ₹18.5-₹27/kg * Other Local Varieties: ₹18-₹22/kg * Average Mandi Price: ₹1201-₹1301.13/quintal. Minimum: ₹200-₹401/quintal. Maximum: ₹1601-₹2200/quintal. Prices fluctuate based on quality and market conditions.`;

  // Additional test cases with more complex formatting
  const complexHindiText = `**आज के बाजार भाव:**

**मुख्य फसलें:**
* **गेहूं:** ₹2,100-₹2,300/क्विंटल
* **चावल:** ₹1,850-₹2,050/क्विंटल  
* **मक्का:** ₹1,750-₹1,950/क्विंटल

**सब्जियों के भाव:**
* **टमाटर:** ₹25-₹35/किग्रा * **प्याज:** ₹20-₹30/किग्रा * **आलू:** ₹18-₹25/किग्रा

**महत्वपूर्ण सूचना:** कीमतें बाजार की स्थिति के अनुसार बदल सकती हैं।

**संपर्क:** अधिक जानकारी के लिए स्थानीय मंडी से संपर्क करें।`;

  const gujaratiText = `**આજના બજાર ભાવ:**

**મુખ્ય પાકો:**
* **ઘઉં:** ₹2,100-₹2,300/ક્વિંટલ * **ચોખા:** ₹1,850-₹2,050/ક્વિંટલ * **મકાઈ:** ₹1,750-₹1,950/ક્વિંટલ

**શાકભાજીના ભાવ:**
* **ટામેટાં:** ₹25-₹35/કિગ્રા * **ડુંગળી:** ₹20-₹30/કિગ્રા * **બટાકા:** ₹18-₹25/કિગ્રા

**મહત્વપૂર્ણ માહિતી:** ભાવો બજારની સ્થિતિ અનુસાર બદલાઈ શકે છે।`;

  // Test case specifically for the engineer's issue
  const singleAsteriskTest = `यह एक टेस्ट है। * पहला पॉइंट यहाँ है * दूसरा पॉइंट यहाँ है * तीसरा पॉइंट यहाँ है। यह **बोल्ड टेक्स्ट** है जो वैसा ही रहना चाहिए।`;
  
  // Exact text from the engineer's image
  const exactImageText = `नासिक में प्याज की कीमतें अलग-अलग हैं। * लाल प्याज: ₹20-₹23/किग्रा * सफेद प्याज: ₹18.5-₹27/किग्रा * अन्य स्थानीय किस्में: ₹18-₹22/किग्रा * औसत मंडी मूल्य: ₹1201-₹1301.13/क्विंटल। न्यूनतम: ₹200-₹401/क्विंटल। अधिकतम: ₹1601-₹2200/क्विंटल। गुणवत्ता और बाजार की स्थितियों के आधार पर कीमतों में उतार-चढ़ाव होता रहता है।`;

  const testCases = [
    {
      language: 'Hindi',
      code: 'hi',
      text: exactImageText,
      label: '🎯 EXACT IMAGE TEXT (Engineer\'s Issue)'
    },
    {
      language: 'Hindi',
      code: 'hi',
      text: singleAsteriskTest,
      label: 'Single Asterisk Test'
    },
    {
      language: 'Hindi',
      code: 'hi',
      text: problematicHindiText,
      label: 'Original Problem Text'
    },
    {
      language: 'Hindi',
      code: 'hi', 
      text: complexHindiText,
      label: 'Complex Formatting'
    },
    {
      language: 'Gujarati',
      code: 'gu',
      text: gujaratiText,
      label: 'Gujarati Text'
    },
    {
      language: 'English',
      code: 'en',
      text: englishText,
      label: 'English Comparison'
    }
  ];

  const renderContent = (text: string, language: string) => {
    switch (selectedRenderer) {
      case 'original':
        return <MarkdownRenderer text={text} />;
      case 'old-fix':
        return <LanguageAwareMarkdownRenderer text={text} language={language} />;
      case 'improved':
        return <ImprovedLanguageAwareRenderer text={text} language={language} />;
      case 'simple':
        return <SimpleBulletPointRenderer text={text} language={language} />;
      default:
        return <SimpleBulletPointRenderer text={text} language={language} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(100deg, #0F3E00 0%, #1F7507 42%, #79C940 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 4
        }}>
          Improved Hindi Markdown Rendering Fix
        </Typography>

        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>✅ SOLUTION:</strong> Enhanced markdown renderer that properly handles line breaks, bullet points, 
            and formatting for Hindi and other non-English languages. The text now displays with proper structure 
            instead of appearing as a single continuous line.
          </Typography>
        </Alert>

        <Stack spacing={4}>
          {/* Renderer Selection */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Compare Renderers
            </Typography>
            
            <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
              <Button 
                variant={selectedRenderer === 'original' ? 'contained' : 'outlined'}
                onClick={() => setSelectedRenderer('original')}
                color={selectedRenderer === 'original' ? 'error' : 'primary'}
              >
                ❌ Original (Broken)
              </Button>
              <Button 
                variant={selectedRenderer === 'old-fix' ? 'contained' : 'outlined'}
                onClick={() => setSelectedRenderer('old-fix')}
                color={selectedRenderer === 'old-fix' ? 'warning' : 'primary'}
              >
                ⚠️ Old Fix (Partial)
              </Button>
              <Button 
                variant={selectedRenderer === 'improved' ? 'contained' : 'outlined'}
                onClick={() => setSelectedRenderer('improved')}
                color={selectedRenderer === 'improved' ? 'info' : 'primary'}
              >
                🔧 Complex Fix
              </Button>
              <Button 
                variant={selectedRenderer === 'simple' ? 'contained' : 'outlined'}
                onClick={() => setSelectedRenderer('simple')}
                color={selectedRenderer === 'simple' ? 'success' : 'primary'}
              >
                ✅ Simple Fix (NEW)
              </Button>
            </ButtonGroup>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Current Renderer:</strong> {
                  selectedRenderer === 'original' ? 'Original MarkdownRenderer (shows the problem)' :
                  selectedRenderer === 'old-fix' ? 'Previous LanguageAwareMarkdownRenderer (partial fix)' :
                  selectedRenderer === 'improved' ? 'Complex ImprovedLanguageAwareRenderer (advanced approach)' :
                  'NEW SimpleBulletPointRenderer (DIRECT FIX: Single * creates bullet points)'
                }
              </Typography>
            </Alert>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>✅ SOLUTION:</strong> The new SimpleBulletPointRenderer directly splits text at single asterisks (*) 
                and converts them to proper bullet points on new lines, while preserving double asterisks (**text**) 
                as bold formatting. This is a simple, direct fix for the Hindi text formatting issue.
              </Typography>
            </Alert>
          </Paper>

          {/* Test Cases */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Test Cases - All Languages
            </Typography>
            
            <Stack spacing={3}>
              {testCases.map((testCase, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {testCase.language}
                    </Typography>
                    <Chip label={testCase.code} size="small" color="primary" />
                    <Chip label={testCase.label} size="small" variant="outlined" />
                  </Box>
                  <Box sx={{ 
                    p: 3, 
                    border: '2px solid #e8f5e8', 
                    borderRadius: 2, 
                    backgroundColor: '#f9fafb',
                    minHeight: 120
                  }}>
                    {renderContent(testCase.text, testCase.code)}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Chat Bubble Simulation */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Chat Bubble Simulation
            </Typography>
            
            <Stack spacing={3}>
              {/* User Bubble */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box
                  sx={{
                    maxWidth: '75%',
                    p: 2,
                    borderRadius: '20px',
                    backgroundColor: '#1F7507',
                    color: '#fff',
                    borderBottomRightRadius: '6px',
                    boxShadow: '0 2px 12px rgba(16,24,40,.1)',
                  }}
                >
                  {renderContent("मुझे **आज के बाजार भाव** चाहिए * प्याज * टमाटर * आलू की कीमतें बताइए।", "hi")}
                </Box>
              </Box>

              {/* Bot Bubble */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box
                  sx={{
                    maxWidth: '75%',
                    p: 2,
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                    color: '#0F172A',
                    border: '1px solid #E5E9F2',
                    borderBottomLeftRadius: '6px',
                    boxShadow: '0 2px 12px rgba(16,24,40,.1)',
                  }}
                >
                  {renderContent(exactImageText, "hi")}
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Technical Solution */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Technical Improvements
            </Typography>
            
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Key Enhancements in ImprovedLanguageAwareRenderer:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <li><strong>Enhanced Bullet Detection:</strong> Improved regex patterns to detect bullet points both at line start and embedded within text</li>
                <li><strong>Language-Specific Styling:</strong> Different line heights, text rendering, and spacing for Devanagari, CJK, and RTL scripts</li>
                <li><strong>Better Text Preprocessing:</strong> Adds zero-width spaces after punctuation and conjunctions for proper line breaking</li>
                <li><strong>Improved Line Breaking:</strong> Uses CSS `white-space: pre-wrap` and `overflow-wrap: anywhere` for better text wrapping</li>
                <li><strong>Structured Output:</strong> Properly separates text blocks, bullet lists, and headings with appropriate spacing</li>
                <li><strong>Script-Aware Rendering:</strong> Optimized font features and text rendering for different writing systems</li>
              </Box>
              
              <Typography variant="body1">
                <strong>Result:</strong> Hindi, Gujarati, and other non-English languages now display with proper line breaks, 
                bullet points, and formatting structure, making the content readable and well-organized instead of appearing 
                as continuous single-line text.
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default ImprovedHindiMarkdownFix;