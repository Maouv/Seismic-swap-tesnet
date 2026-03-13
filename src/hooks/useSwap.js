import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import useStore from '../store/useStore'
import { ADDRESSES } from '../contracts/addresses'
import { DEX_ABI, TOKEN_ABI } from '../contracts/abi'

const useSwap = () => {
  const { tokenIn, tokenOut, amountIn, setAmountOut, setIsSwapping } = useStore()

  const getProvider = () => new ethers.BrowserProvider(window.ethereum)

  const getDexAddress = () => {
    if (tokenIn === 'ETH' && tokenOut === 'USDC') return ADDRESSES.DEX_USDC
    if (tokenIn === 'ETH' && tokenOut === 'USDT') return ADDRESSES.DEX_USDT
    if (tokenIn === 'USDC' && tokenOut === 'ETH') return ADDRESSES.DEX_USDC
    if (tokenIn === 'USDT' && tokenOut === 'ETH') return ADDRESSES.DEX_USDT
    return ADDRESSES.DEX_USDC
  }

  const getTokenAddress = () => {
    if (tokenIn === 'USDC' || tokenOut === 'USDC') return ADDRESSES.USDC
    if (tokenIn === 'USDT' || tokenOut === 'USDT') return ADDRESSES.USDT
    return ADDRESSES.USDC
  }

  const calculateOutput = async (value) => {
    if (!value || isNaN(value) || Number(value) <= 0) {
      setAmountOut('')
      return
    }
    try {
      const provider = getProvider()
      const dex = new ethers.Contract(getDexAddress(), DEX_ABI, provider)
      if (tokenIn === 'ETH') {
        const amountInWei = ethers.parseEther(value)
        const out = await dex.getTokenForETH(amountInWei)
        setAmountOut(ethers.formatUnits(out, 18))
      } else {
        const amountInWei = ethers.parseUnits(value, 18)
        const out = await dex.getETHForToken(amountInWei)
        setAmountOut(ethers.formatEther(out))
      }
    } catch (err) {
      console.error('Calculate output error:', err)
      setAmountOut('')
    }
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const swap = async () => {
    if (!amountIn || Number(amountIn) <= 0) {
      toast.error('Enter a valid amount!')
      return
    }
    try {
      setIsSwapping(true)
      const provider = getProvider()
      const signer = await provider.getSigner()
      const dex = new ethers.Contract(getDexAddress(), DEX_ABI, signer)

      let tx

      if (tokenIn === 'ETH') {
        const amountInWei = ethers.parseEther(amountIn)
        const toastId = toast.loading('Sending transaction...')
        tx = await dex.swapETHForToken({ value: amountInWei })
        toast.loading('Waiting for confirmation...', { id: toastId })
        await tx.wait()
        await sleep(800)
        toast.success('Swap successful! 🎉', { id: toastId, duration: 4000 })
      } else {
        const amountInWei = ethers.parseUnits(amountIn, 18)
        const tokenContract = new ethers.Contract(getTokenAddress(), TOKEN_ABI, signer)

        const toastId = toast.loading('Approving token...')
        const approveTx = await tokenContract.approve(getDexAddress(), amountInWei)
        await approveTx.wait()
        await sleep(500)

        toast.loading('Sending swap...', { id: toastId })
        tx = await dex.swapTokenForETH(amountInWei)
        toast.loading('Waiting for confirmation...', { id: toastId })
        await tx.wait()
        await sleep(800)
        toast.success('Swap successful! 🎉', { id: toastId, duration: 4000 })
      }
    } catch (err) {
      console.error('Swap error:', err)
      toast.error('Swap failed! ' + (err?.reason || ''), { duration: 4000 })
    } finally {
      setIsSwapping(false)
    }
  }

  return { calculateOutput, swap }
}

export default useSwap
