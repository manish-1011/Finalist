import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Paper, 
  Stack, 
  Box,
  Alert,
  Chip
} from '@mui/material';
import MarkdownRenderer from './components/MarkdownRenderer';
import LanguageAwareMarkdownRenderer from './components/LanguageAwareMarkdownRenderer';

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

const HindiMarkdownFix: React.FC = () => {
  // The problematic Hindi text from the original issue
  const problematicHindiText = `नासिक में प्याज की कीमतें अलग-अलग हैं। * लाल प्याज: ₹20-₹23/किग्रा * सफेद प्याज: ₹18.5-₹27/किग्रा * अन्य स्थानीय किस्में: ₹18-₹22/किग्रा * औसत मंडी मूल्य: ₹1201-₹1301.13/क्विंटल। न्यूनतम: ₹200-₹401/क्विंटल। अधिकतम: ₹1601-₹2200/क्विंटल। गुणवत्ता और बाजार की स्थितियों के आधार पर कीमतों में उतार-चढ़ाव होता रहता है।`;

  // English text for comparison
  const englishText = `Market prices vary in Nashik. * Red Onion: ₹20-₹23/kg * White Onion: ₹18.5-₹27/kg * Other Local Varieties: ₹18-₹22/kg * Average Mandi Price: ₹1201-₹1301.13/quintal. Minimum: ₹200-₹401/quintal. Maximum: ₹1601-₹2200/quintal. Prices fluctuate based on quality and market conditions.`;

  // Additional test cases
  const testCases = [
    {
      language: 'Hindi',
      code: 'hi',
      text: `तुमच्या २ एकर स्वर्ण भातासाठी, जेव्हा रोपे भरून येतात तेव्हा: * मूळ कजण्यापासून रोखण्यासाठी **जास्त पाणी तावडतोब कापून टाका.** * पुनर्प्रीती वाढवण्यासाठी **युरिया खत** (अंदाजे ४० किलो/एकर) विमाजित डोसमध्ये द्या. * पाणी सावल्यामुळे **कीटक/रोग** प्रादुर्भाव **आहे का ते तपासा; आवश्यक असल्यास योग्य कीटकनाशके फवारणी करा** (पुरानंतर स्प्रेट सामान्य आहे).`
    },
    {
      language: 'Gujarati', 
      code: 'gu',
      text: `**આજના બજાર ભાવ:** * **લાલ ડુંગળી:** ₹20-₹23/કિગ્રા * **સફેદ ડુંગળી:** ₹18.5-₹27/કિગ્રા * **અન્ય સ્થાનિક જાતો:** ₹18-₹22/કિગ્રા * **સરેરાશ મંડી ભાવ:** ₹1201-₹1301.13/ક્વિંટલ`
    },
    {
      language: 'Marathi',
      code: 'mr', 
      text: `**आजचे बाजार भाव:** * **लाल कांदा:** ₹20-₹23/किलो * **पांढरा कांदा:** ₹18.5-₹27/किलो * **इतर स्थानिक जाती:** ₹18-₹22/किलो * **सरासरी मंडी दर:** ₹1201-₹1301.13/क्विंटल`
    }
  ];

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
          Hindi Markdown Line Breaking Fix
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>Issue:</strong> When UI language is Hindi or other non-English languages, bullet points (*) are not showing proper line breaks. 
            Text appears in a single line instead of creating proper bullet lists.
          </Typography>
        </Alert>

        <Stack spacing={4}>
          {/* Main Problem Demonstration */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Problem Demonstration
            </Typography>
            
            <Stack spacing={3}>
              {/* English - Works Fine */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                  ✅ English (Works Fine)
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  border: '2px solid #e8f5e8', 
                  borderRadius: 2, 
                  backgroundColor: '#f9fafb',
                  minHeight: 100
                }}>
                  <MarkdownRenderer text={englishText} />
                </Box>
              </Box>

              {/* Hindi - Original Problem */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
                  ❌ Hindi - Original Renderer (Problem: No line breaks at *)
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  border: '2px solid #ffebee', 
                  borderRadius: 2, 
                  backgroundColor: '#fafafa',
                  minHeight: 100
                }}>
                  <div className="markdown-content">
                    {/* Simulating the old behavior without the fix */}
                    <span style={{ wordBreak: 'normal', whiteSpace: 'normal' }}>
                      {problematicHindiText}
                    </span>
                  </div>
                </Box>
              </Box>

              {/* Hindi - Fixed */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                  ✅ Hindi - Fixed Renderer (Solution: Proper line breaks)
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  border: '2px solid #e8f5e8', 
                  borderRadius: 2, 
                  backgroundColor: '#f9fafb',
                  minHeight: 100
                }}>
                  <LanguageAwareMarkdownRenderer text={problematicHindiText} language="hi" />
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Chat Bubble Simulation */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Chat Bubble Simulation (Fixed)
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
                  <LanguageAwareMarkdownRenderer 
                    text="मुझे **आज के बाजार भाव** चाहिए * प्याज * टमाटर * आलू की कीमतें बताइए।"
                    language="hi"
                  />
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
                  <LanguageAwareMarkdownRenderer text={problematicHindiText} language="hi" />
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Multiple Language Tests */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Multiple Language Support Test
            </Typography>
            
            <Stack spacing={3}>
              {testCases.map((testCase, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {testCase.language}
                    </Typography>
                    <Chip label={testCase.code} size="small" color="primary" />
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    border: '2px solid #e8f5e8', 
                    borderRadius: 2, 
                    backgroundColor: '#f9fafb',
                    minHeight: 80
                  }}>
                    <LanguageAwareMarkdownRenderer 
                      text={testCase.text} 
                      language={testCase.code}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Technical Solution */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Technical Solution
            </Typography>
            
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Root Cause:</strong> The original markdown parser wasn't properly handling bullet points (*) 
                embedded within continuous text in non-English languages, especially Devanagari scripts.
              </Typography>
              
              <Typography variant="body1">
                <strong>Key Fixes Applied:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <li><strong>Enhanced Bullet Detection:</strong> Improved regex to detect bullet points both at line start and within text</li>
                <li><strong>Language-Aware Text Processing:</strong> Added zero-width spaces after Hindi conjunctions and punctuation</li>
                <li><strong>CSS Improvements:</strong> Enhanced word-breaking rules for Devanagari and other non-Latin scripts</li>
                <li><strong>Script-Specific Styling:</strong> Different line-heights and spacing for different writing systems</li>
                <li><strong>Proper Text Wrapping:</strong> Used <code>white-space: pre-wrap</code> and <code>overflow-wrap: anywhere</code></li>
              </Box>
              
              <Typography variant="body1">
                <strong>Result:</strong> Hindi and other non-English languages now properly break lines at bullet points (*), 
                creating readable bullet lists instead of continuous single-line text.
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default HindiMarkdownFix;