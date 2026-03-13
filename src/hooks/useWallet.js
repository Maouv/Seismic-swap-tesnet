import { useEffect } from 'react'
import { ethers } from 'ethers'
import useStore from '../store/useStore'
import { CHAIN_ID } from '../contracts/addresses'

const useWallet = () => {
  const { setAccount, setChainId } = useStore()

  const connect = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not found! Please install MetaMask.')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const network = await provider.getNetwork()

      setAccount(accounts[0])
      setChainId(Number(network.chainId))

      // Simpan status connected
      localStorage.setItem('walletConnected', 'true')

      if (Number(network.chainId) !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1404' }],
          })
        } catch (e) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x1404',
              chainName: 'Seismic Testnet',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://node.testnet.seismic.systems'],
              blockExplorerUrls: ['https://explorer.testnet.seismic.systems'],
            }],
          })
        }
      }
    } catch (err) {
      console.error('Connect wallet error:', err)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setChainId(null)
    // Hapus status connected
    localStorage.removeItem('walletConnected')
  }

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAccount(accounts[0])
      }
    }

    const handleChainChanged = (chainId) => {
      setChainId(Number(chainId))
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    // Auto connect HANYA kalau sebelumnya tidak disconnect
    const wasConnected = localStorage.getItem('walletConnected')
    if (wasConnected === 'true') {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          connect()
        }
      })
    }

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  return { connect, disconnect }
}

export default useWallet
