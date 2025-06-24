import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '@src/components/Layout';
import AppRouter from '@src/router';
import './App.less';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppRouter />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
