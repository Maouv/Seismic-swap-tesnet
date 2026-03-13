import BackgroundFX from '../components/BackgroundFX'
import NoiseFX from '../components/NoiseFX'
import Navbar from '../components/Navbar'
import SwapCard from '../components/SwapCard'

const SwapPage = () => {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <BackgroundFX />
      <NoiseFX />
      <Navbar />
      <main style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '100px 16px 40px',
      }}>
        <SwapCard />
      </main>
    </div>
  )
}

export default SwapPage
