import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SwapPage from './pages/SwapPage'
import AnalyticsPage from './pages/AnalyticsPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SwapPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(10,10,15,0.9)',
            color: '#fff',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
          }
        }}
      />
    </BrowserRouter>
  )
}

export default App
