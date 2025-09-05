import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '@src/stores/StoreProvider';
import Layout from '@src/components/Layout';
import AppRouter from '@src/router';
import './App.less';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <AppRouter />
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
