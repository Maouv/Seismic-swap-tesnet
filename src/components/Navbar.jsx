import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import useStore from '../store/useStore'
import useWallet from '../hooks/useWallet'
import seismicLogo from '/seismic-logo.png'

const Navbar = () => {
  const { account, isConnected } = useStore()
  const { connect, disconnect } = useWallet()
  const navRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }
    )
  }, [])

  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  const handleDisconnect = () => {
    disconnect()
    setShowDropdown(false)
  }

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
        <div style={{ position: 'relative' }}>
          {!isConnected ? (
            <button
              onClick={connect}
              className="glass-btn px-5 py-2"
              style={{
                fontFamily: 'Space Grotesk',
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.02em'
              }}
            >
              LOGIN
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="glass-btn px-5 py-2"
                style={{
                  fontFamily: 'Space Grotesk',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00FF88',
                }} />
                {shortAddress(account)}
                <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>
                  {showDropdown ? '▲' : '▼'}
                </span>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  className="glass"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    minWidth: '180px',
                    padding: '8px',
                    zIndex: 100,
                  }}
                >
                  {/* Full address */}
                  <div style={{
                    padding: '8px 12px',
                    fontSize: '0.72rem',
                    opacity: 0.4,
                    letterSpacing: '0.03em',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: '6px',
                    wordBreak: 'break-all',
                  }}>
                    {account}
                  </div>

                  {/* Disconnect */}
                  <button
                    onClick={handleDisconnect}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 50, 50, 0.12)',
                      border: '1px solid rgba(255, 50, 50, 0.25)',
                      borderRadius: '10px',
                      color: '#FF6B6B',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* Close dropdown kalau klik di luar */}
      {showDropdown && (
        <div
          onClick={() => setShowDropdown(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
          }}
        />
      )}
    </nav>
  )
}

export default Navbar
