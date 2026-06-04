export interface ProperWalletAccount {
  actor: string
  permission: string
  chainId: string
}

export interface ProperWalletTransactResponse {
  signatures: string[]
  transactionId?: string
}

export interface ProperWalletProvider {
  isProperWallet: true
  getAccount(): Promise<ProperWalletAccount>
  transact(args: unknown): Promise<ProperWalletTransactResponse>
  signArbitrary(data: string): Promise<string>
  logout(): Promise<void>
}

declare global {
  interface Window {
    properwallet?: ProperWalletProvider
  }
}
