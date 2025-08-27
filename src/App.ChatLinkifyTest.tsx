import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Stack, Typography, Paper, Button, Box } from '@mui/material';
import theme from './theme';
import MarkdownRenderer from './components/MarkdownRenderer';

const ChatLinkifyTest: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "To apply for PM-KISAN:\n• Visit your nearest **Common Service Centre (CSC)**.\n• Check the official PM-KISAN portal for **self-registration** if available in your state.\n• Contact your local **agriculture department** for assistance.\n\n[https://pmkisan.gov.in/](https://pmkisan.gov.in/)"
    },
    {
      id: 2,
      role: 'bot', 
      text: "Mahindra Finance Tractor Loans • Tractor Loan - Check Interest Rates & Compare with Banks - BankBazaar https://www.bankbazaar.com/tractor-loan.html"
    },
    {
      id: 3,
      role: 'bot',
      text: "**URLs with special characters:**\n• Banking portal: https://www.sbi.co.in/web/agri-rural/agriculture-banking\n• Government scheme: https://pmkisan.gov.in/StateDashboard.aspx\n• Market info: https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=23&Tx_State=0&Tx_District=0&Tx_Market=0\n• Documentation: https://docs.example.com/api/v1/agriculture_schemes"
    },
    {
      id: 4,
      role: 'bot',
      text: "**URLs in parentheses:**\nFor more information, visit the official portal (https://pmkisan.gov.in/) or check the banking services (https://www.sbi.co.in/web/agri-rural). You can also refer to the documentation (https://docs.gov.in/agriculture-schemes.pdf) for detailed guidelines."
    },
    {
      id: 5,
      role: 'bot',
      text: "**Complex URLs with query parameters:**\n• Search results: https://www.google.com/search?q=pm+kisan+scheme&hl=en&source=hp\n• Banking login: https://retail.onlinesbi.com/retail/login.htm?flag=1&bankid=243\n• Government portal: https://serviceonline.bihar.gov.in/resources/global/englishSite/pdf/PMKISAN.pdf\n• Market data: https://agmarknet.gov.in/PriceAndArrivals/DatewiseCommodityReport.aspx?ss=1&to_date=25/12/2024&commodity=23"
    }
  ]);

  const addTestMessage = () => {
    const testMessages = [
      "**URLs with underscores and dashes:**\n• API documentation: https://api.agriculture-portal.gov.in/v2/schemes_data\n• File download: https://pmkisan.gov.in/documents/PM_KISAN_Guidelines_2024.pdf\n• Database query: https://db.agri-portal.com/query?type=farmer_data&state=UP",
      
      "**URLs in different contexts:**\nCheck this link (https://www.example-site.com/farmer_registration) for registration. Also visit https://support.agri-portal.in/help_center for support.",
      
      "**Long URLs with parameters:**\nSearch here: https://www.google.com/search?q=agriculture+schemes+india&oq=agriculture+schemes&aqs=chrome.0.0i512l2j0i22i30l8.2847j0j7&sourceid=chrome&ie=UTF-8"
    ];
    
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    const newMessage = {
      id: messages.length + 1,
      role: 'bot' as const,
      text: randomMessage
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: 'background.default',
        padding: 3
      }}>
        <Stack spacing={3} maxWidth="800px" margin="0 auto">
          
          {/* Header */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
              Chat Linkify Test
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Testing URL detection and clickable links in chat messages using the updated MarkdownRenderer.
            </Typography>
          </Paper>

          {/* Chat Messages */}
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Chat Messages
            </Typography>
            
            <Stack spacing={2}>
              {messages.map((message) => (
                <Box key={message.id}>
                  <Box 
                    className={`bubble ${message.role}`}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: message.role === 'bot' ? 'grey.100' : 'primary.main',
                      color: message.role === 'bot' ? 'text.primary' : 'primary.contrastText',
                      maxWidth: '80%',
                      alignSelf: message.role === 'bot' ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <MarkdownRenderer text={message.text} />
                  </Box>
                </Box>
              ))}
            </Stack>

            <Button 
              variant="contained" 
              onClick={addTestMessage}
              sx={{ mt: 2 }}
            >
              Add Test Message
            </Button>
          </Paper>

          {/* Instructions */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6" gutterBottom>
              Test Instructions
            </Typography>
            <Typography variant="body2">
              • URLs should appear as blue, clickable links<br/>
              • Links should open in new tabs when clicked<br/>
              • Bold text formatting should be preserved<br/>
              • Bullet points should display correctly<br/>
              • Links should work within bold text and bullet points
            </Typography>
          </Paper>

        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default ChatLinkifyTest;