import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Tab,
  Tabs
} from '@mui/material'
import './App.css'

function App() {
  const [totalAmount, setTotalAmount] = useState(1250.75)
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const handleUpdate = () => {
    // Generate a random amount for demo purposes
    const newAmount = Math.round((Math.random() * 5000 + 500) * 100) / 100
    setTotalAmount(newAmount)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <AppBar position="static" sx={{ width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Personal Finances
          </Typography>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Item 1" sx={{ color: 'white' }} />
            <Tab label="Item 2" sx={{ color: 'white' }} />
            <Tab label="Item 3" sx={{ color: 'white' }} />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Total Amount
          </Typography>
          <Typography variant="h2" component="div" color="primary" sx={{ mb: 3 }}>
            ${totalAmount.toFixed(2)}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'grey.200', 
          py: 2, 
          mt: 'auto',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Copyright 2025 (c)
        </Typography>
      </Box>
    </Box>
  )
}

export default App
