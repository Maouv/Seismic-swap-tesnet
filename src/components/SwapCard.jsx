import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import useStore from '../store/useStore'
import useSwap from '../hooks/useSwap'
import useBalance from '../hooks/useBalance'

const TOKENS = ['ETH', 'USDC', 'USDT']

const SwapCard = () => {
  const {
    tokenIn, tokenOut, amountIn, amountOut,
    setAmountIn, setTokenIn, setTokenOut,
    switchTokens, isSwapping, isConnected
  } = useStore()

  const { calculateOutput, swap } = useSwap()
  const { balances, fetchBalances } = useBalance()
  const cardRef = useRef(null)
  const switchRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    gsap.set(cardRef.current, { y: 120, opacity: 0 })
    gsap.set(btnRef.current, { opacity: 0 })
    gsap.to(cardRef.current, {
      y: 0, opacity: 1,
      duration: 1.4, delay: 0.4, ease: 'expo.out'
    })
    gsap.to(btnRef.current, {
      opacity: 1,
      duration: 0.8, delay: 1.0, ease: 'power2.out'
    })
  }, [])

  const handleAmountChange = (e) => {
    const val = e.target.value
    setAmountIn(val)
    calculateOutput(val)
  }

  const handleMaxIn = () => {
    const max = balances[tokenIn]
    setAmountIn(max)
    calculateOutput(max)
  }

  const handleSwitch = () => {
    gsap.to(switchRef.current, {
      rotation: 180, duration: 0.5, ease: 'back.out(2)',
      onComplete: () => gsap.set(switchRef.current, { rotation: 0 })
    })
    gsap.to(cardRef.current, {
      scale: 0.97, duration: 0.1, yoyo: true, repeat: 1
    })
    switchTokens()
  }

  const handleSwap = async () => {
    if (!isConnected) {
      alert('Connect wallet first!')
      return
    }
    gsap.to(btnRef.current, {
      scale: 0.95, duration: 0.1, yoyo: true, repeat: 1
    })
    await swap()
    fetchBalances()
  }

  return (
    <div ref={cardRef} className="glass w-full max-w-sm mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem' }}>
          Swap
        </span>
        <span style={{ fontSize: '0.72rem', opacity: 0.4, fontWeight: 500, letterSpacing: '0.05em' }}>
          0.3% FEE
        </span>
      </div>

      {/* Token In */}
      <div className="glass-input p-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: '0.72rem', opacity: 0.4, letterSpacing: '0.05em' }}>FROM</span>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.72rem', opacity: 0.4 }}>
              Balance: {balances[tokenIn]}
            </span>
            {isConnected && (
              <button
                onClick={handleMaxIn}
                style={{
                  fontSize: '0.65rem',
                  opacity: 0.6,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                MAX
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <select
            value={tokenIn}
            onChange={(e) => setTokenIn(e.target.value)}
            style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
              background: 'transparent', outline: 'none', cursor: 'pointer',
              color: '#fff', border: 'none',
            }}
          >
            {TOKENS.filter(t => t !== tokenOut).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={handleAmountChange}
            style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.5rem',
              background: 'transparent', outline: 'none', border: 'none',
              textAlign: 'right', color: '#fff', width: '60%',
            }}
          />
        </div>
      </div>

      {/* Switch */}
      <div className="flex justify-center my-3">
        <button
          ref={switchRef}
          onClick={handleSwitch}
          className="glass-btn w-9 h-9 flex items-center justify-center"
          style={{ fontSize: '1rem', borderRadius: '50%' }}
        >
          ↕
        </button>
      </div>

      {/* Token Out */}
      <div className="glass-input p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: '0.72rem', opacity: 0.4, letterSpacing: '0.05em' }}>TO</span>
          <span style={{ fontSize: '0.72rem', opacity: 0.4 }}>
            Balance: {balances[tokenOut]}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <select
            value={tokenOut}
            onChange={(e) => setTokenOut(e.target.value)}
            style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
              background: 'transparent', outline: 'none', cursor: 'pointer',
              color: '#fff', border: 'none',
            }}
          >
            {TOKENS.filter(t => t !== tokenIn).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.5rem',
            opacity: amountOut ? 1 : 0.3,
          }}>
            {amountOut ? Number(amountOut).toFixed(6) : '0.0'}
          </div>
        </div>
      </div>

      {/* Price Info */}
      {amountOut && amountIn && (
        <div className="flex justify-between mb-4"
          style={{ fontSize: '0.75rem', opacity: 0.45 }}>
          <span>Rate</span>
          <span>1 {tokenIn} ≈ {(Number(amountOut) / Number(amountIn)).toFixed(4)} {tokenOut}</span>
        </div>
      )}

      {/* Swap Button */}
      <button
        ref={btnRef}
        onClick={handleSwap}
        disabled={isSwapping}
        className="glass-btn w-full py-4"
        style={{
          fontFamily: 'Space Grotesk', fontWeight: 700,
          fontSize: '1rem', letterSpacing: '0.05em', borderRadius: '14px',
        }}
      >
        {isSwapping ? '⏳ SWAPPING...' : isConnected ? 'SWAP' : 'CONNECT WALLET'}
      </button>

    </div>
  )
}

export default SwapCard
