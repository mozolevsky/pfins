import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import { AssetPage } from './components/assetPage.jsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000" }),
  cache: new InMemoryCache(),
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/asset/:type" element={<AssetPage />} />
        </Routes> 
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
)
