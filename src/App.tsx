import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Index from './pages/Index';
import TopicPage from './pages/TopicPage';
import NotFound from './pages/NotFound';

const App = () => (
  <ConfigProvider
    locale={ruRU}
    theme={{
      token: {
        colorPrimary: '#38b2ac',
        borderRadius: 10,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/topic/:id" element={<TopicPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
