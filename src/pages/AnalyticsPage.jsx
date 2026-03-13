import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import BackgroundFX from '../components/BackgroundFX'
import NoiseFX from '../components/NoiseFX'
import Navbar from '../components/Navbar'

const mockData = [
  { time: '00:00', usdc: 1800, usdt: 1750 },
  { time: '04:00', usdc: 1950, usdt: 1820 },
  { time: '08:00', usdc: 1870, usdt: 1900 },
  { time: '12:00', usdc: 2100, usdt: 1980 },
  { time: '16:00', usdc: 2050, usdt: 2100 },
  { time: '20:00', usdc: 2200, usdt: 2050 },
  { time: '24:00', usdc: 2150, usdt: 2200 },
]

const AnalyticsPage = () => {
  const chartRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(chartRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.3 }
    )
    gsap.fromTo(statsRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.5 }
    )
  }, [])

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <BackgroundFX />
      <NoiseFX />
      <Navbar />
      <main style={{
        position: 'relative',
        zIndex: 10,
        padding: '110px 16px 40px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>

        {/* Stats */}
        <div ref={statsRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {[
            { label: 'ETH/USDC', value: '2,150' },
            { label: 'ETH/USDT', value: '2,200' },
            { label: 'Total Swaps', value: '128' },
            { label: 'Volume', value: '$48,200' },
          ].map((stat) => (
            <div key={stat.label} className="glass p-4">
              <div style={{ fontSize: '0.72rem', opacity: 0.4, marginBottom: '6px', letterSpacing: '0.05em' }}>
                {stat.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.4rem' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div ref={chartRef} className="glass p-6">
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', marginBottom: '24px' }}>
            PRICE CHART
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockData}>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10,10,15,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="usdc" stroke="rgba(255,255,255,0.8)"
                strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="usdt" stroke="rgba(255,255,255,0.4)"
                strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  )
}

export default AnalyticsPage
