import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  Tab,
  Tabs,
  Grid,
} from '@mui/material'
import { gql } from '@apollo/client'
import {useQuery} from '@apollo/client/react'
import { Title } from './components/tilte'
import { AddAsset } from './components/addAsset'
import './App.css'

const GET_ASSETS = gql`
  query GetAssets {
    assets {
      type
      value
    }
  }
`;

function App() {
  const [selectedTab, setSelectedTab] = useState(0)
  const { loading, error, data, refetch } = useQuery<{assets: [{type: string, value: number}]}>(GET_ASSETS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
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
          <Grid container spacing={1} alignItems="center" marginBottom={4}>
            <Grid size={{xs: 12, md: 6, lg: 2}}>
              <Title title="Our Assets" />
            </Grid>
            <Grid size={{xs: 12, md: 6, lg: 1.5}}>
              <AddAsset title="Add Asset" onAssetCreated={refetch} />
            </Grid>
          </Grid>
         
          <Grid container spacing={2}>
            {data.assets.map((asset) => (
              <Grid size={{xs: 12, md: 6, lg: 3}} key={asset.type}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" component="div" sx={{ mb: 0 }}>
                    {asset.type}: {asset.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>


          <Typography variant="h6" component="div" sx={{ mb: 3 }} color="primary" marginTop={3}>
            Total: {data.assets.reduce((acc, asset) => acc + asset.value, 0)}
          </Typography>
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
