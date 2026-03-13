import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import useStore from '../store/useStore'
import useWallet from '../hooks/useWallet'
import seismicLogo from '/seismic-logo.png'

const Navbar = () => {
  const { account, isConnected } = useStore()
  const { connect, disconnect } = useWallet()
  const navRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }
    )
  }, [])

  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
      <div className="glass px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={seismicLogo}
            alt="Seismic"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          />
          <span style={{
            fontFamily: 'Space Grotesk',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em'
          }}>
            SeismicDEX
          </span>
        </div>

        {/* Wallet */}
        <button
          onClick={isConnected ? disconnect : connect}
          className="glass-btn px-5 py-2"
          style={{
            fontFamily: 'Space Grotesk',
            fontWeight: 600,
            fontSize: '0.85rem',
            letterSpacing: '0.02em'
          }}
        >
          {isConnected ? shortAddress(account) : 'LOGIN'}
        </button>

      </div>
    </nav>
  )
}

export default Navbar
