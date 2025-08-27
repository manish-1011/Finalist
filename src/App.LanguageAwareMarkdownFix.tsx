import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Paper, 
  Stack, 
  Box, 
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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

const LanguageAwareMarkdownFix: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  // Sample texts with bullet points that should break properly
  const sampleTexts = {
    en: `**Market Prices Today:**
* **Red Onion:** ₹20-₹23/kg
* **White Onion:** ₹18.5-₹27/kg  
* **Other Local Varieties:** ₹18-₹22/kg
* **Average Mandi Price:** ₹1201-₹1301.13/quintal
* **Minimum:** ₹200-₹401/quintal
* **Maximum:** ₹1601-₹2200/quintal

Quality and market conditions affect pricing. Prices fluctuate based on supply and demand.`,

    hi: `नासिक में प्याज की कीमतें अलग-अलग हैं। * लाल प्याज: ₹20-₹23/किग्रा * सफेद प्याज: ₹18.5-₹27/किग्रा * अन्य स्थानीय किस्में: ₹18-₹22/किग्रा * औसत मंडी मूल्य: ₹1201-₹1301.13/क्विंटल। न्यूनतम: ₹200-₹401/क्विंटल। अधिकतम: ₹1601-₹2200/क्विंटल। गुणवत्ता और बाजार की स्थितियों के आधार पर कीमतों में उतार-चढ़ाव होता रहता है।`,

    mr: `**आजचे बाजार भाव:**
* **लाल कांदा:** ₹20-₹23/किलो
* **पांढरा कांदा:** ₹18.5-₹27/किलो
* **इतर स्थानिक जाती:** ₹18-₹22/किलो
* **सरासरी मंडी दर:** ₹1201-₹1301.13/क्विंटल

गुणवत्ता आणि बाजारातील परिस्थितीनुसार किंमती बदलत राहतात।`,

    gu: `**આજના બજાર ભાવ:**
* **લાલ ડુંગળી:** ₹20-₹23/કિગ્રા
* **સફેદ ડુંગળી:** ₹18.5-₹27/કિગ્રા
* **અન્ય સ્થાનિક જાતો:** ₹18-₹22/કિગ્રા
* **સરેરાશ મંડી ભાવ:** ₹1201-₹1301.13/ક્વિંટલ

ગુણવત્તા અને બજારની પરિસ્થિતિ પ્રમાણે ભાવમાં ફેરફાર થતો રહે છે।`,

    te: `**నేటి మార్కెట్ ధరలు:**
* **ఎర్ర ఉల్లిపాయ:** ₹20-₹23/కిలో
* **తెల్ల ఉల్లిపాయ:** ₹18.5-₹27/కిలో
* **ఇతర స్థానిక రకాలు:** ₹18-₹22/కిలో
* **సగటు మండి ధర:** ₹1201-₹1301.13/క్వింటల్

నాణ్యత మరియు మార్కెట్ పరిస్థితుల ఆధారంగా ధరలు మారుతూ ఉంటాయి।`
  };

  const languageNames = {
    en: 'English',
    hi: 'हिंदी (Hindi)',
    mr: 'मराठी (Marathi)', 
    gu: 'ગુજરાતી (Gujarati)',
    te: 'తెలుగు (Telugu)'
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
          Language-Aware Markdown Fix
        </Typography>

        <Stack spacing={4}>
          {/* Language Selector */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Language</InputLabel>
              <Select
                value={selectedLanguage}
                label="Select Language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <MenuItem key={code} value={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Comparison */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Before vs After Comparison
            </Typography>
            
            <Stack spacing={3}>
              {/* Original Renderer */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
                  ❌ Original MarkdownRenderer (Issue: Hindi text not breaking properly)
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  border: '2px solid #ffebee', 
                  borderRadius: 2, 
                  backgroundColor: '#fafafa',
                  minHeight: 150
                }}>
                  <MarkdownRenderer text={sampleTexts[selectedLanguage as keyof typeof sampleTexts]} />
                </Box>
              </Box>

              {/* Fixed Renderer */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                  ✅ Language-Aware MarkdownRenderer (Fixed: Proper line breaking)
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  border: '2px solid #e8f5e8', 
                  borderRadius: 2, 
                  backgroundColor: '#f9fafb',
                  minHeight: 150
                }}>
                  <LanguageAwareMarkdownRenderer 
                    text={sampleTexts[selectedLanguage as keyof typeof sampleTexts]} 
                    language={selectedLanguage}
                  />
                </Box>
              </Box>
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
                  <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                    User (Fixed):
                  </Typography>
                  <LanguageAwareMarkdownRenderer 
                    text="मुझे आज के **बाजार भाव** चाहिए * प्याज * टमाटर * आलू की कीमतें बताइए।"
                    language={selectedLanguage}
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
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Bot (Fixed):
                  </Typography>
                  <LanguageAwareMarkdownRenderer 
                    text={sampleTexts[selectedLanguage as keyof typeof sampleTexts]}
                    language={selectedLanguage}
                  />
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Technical Details */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Technical Fix Details
            </Typography>
            
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Problem:</strong> Hindi and other non-English languages were not properly breaking lines at bullet points (*), 
                causing text to appear in a single line instead of creating proper bullet lists.
              </Typography>
              
              <Typography variant="body1">
                <strong>Root Cause:</strong> The original markdown parser wasn't handling non-Latin scripts properly, 
                and CSS word-breaking rules weren't optimized for Devanagari and other scripts.
              </Typography>
              
              <Typography variant="body1">
                <strong>Solution:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <li>Enhanced bullet point detection for different languages</li>
                <li>Added language-specific text formatting with zero-width spaces</li>
                <li>Improved CSS word-breaking rules for Devanagari scripts</li>
                <li>Added proper line-height and spacing for non-Latin text</li>
                <li>Language-aware text processing with script detection</li>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default LanguageAwareMarkdownFix;