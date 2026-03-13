import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import useStore from '../store/useStore'
import { ADDRESSES } from '../contracts/addresses'
import { TOKEN_ABI } from '../contracts/abi'

const useBalance = () => {
  const { account, isConnected } = useStore()
  const [balances, setBalances] = useState({
    ETH: '0.0000',
    USDC: '0.0000',
    USDT: '0.0000',
  })

  const fetchBalances = async () => {
    if (!account || !isConnected) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)

      // ETH balance
      const ethBal = await provider.getBalance(account)
      
      // USDC balance
      const usdc = new ethers.Contract(ADDRESSES.USDC, TOKEN_ABI, provider)
      const usdcBal = await usdc.balanceOf(account)

      // USDT balance
      const usdt = new ethers.Contract(ADDRESSES.USDT, TOKEN_ABI, provider)
      const usdtBal = await usdt.balanceOf(account)

      setBalances({
        ETH: parseFloat(ethers.formatEther(ethBal)).toFixed(4),
        USDC: parseFloat(ethers.formatUnits(usdcBal, 18)).toFixed(4),
        USDT: parseFloat(ethers.formatUnits(usdtBal, 18)).toFixed(4),
      })
    } catch (err) {
      console.error('Fetch balance error:', err)
    }
  }

  useEffect(() => {
    fetchBalances()
  }, [account, isConnected])

  return { balances, fetchBalances }
}

export default useBalance
