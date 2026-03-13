import { create } from 'zustand'

const useStore = create((set) => ({
  account: null,
  isConnected: false,
  chainId: null,
  isDark: true,
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amountIn: '',
  amountOut: '',
  isSwapping: false,
  isLoading: false,
  setAccount: (account) => set({ account, isConnected: !!account }),
  setChainId: (chainId) => set({ chainId }),
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  setTokenIn: (tokenIn) => set({ tokenIn }),
  setTokenOut: (tokenOut) => set({ tokenOut }),
  setAmountIn: (amountIn) => set({ amountIn }),
  setAmountOut: (amountOut) => set({ amountOut }),
  setIsSwapping: (isSwapping) => set({ isSwapping }),
  setIsLoading: (isLoading) => set({ isLoading }),
  switchTokens: () => set((state) => ({
    tokenIn: state.tokenOut,
    tokenOut: state.tokenIn,
    amountIn: state.amountOut,
    amountOut: state.amountIn,
  })),
}))

export default useStore
