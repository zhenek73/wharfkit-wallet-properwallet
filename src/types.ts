export interface ProperWalletAccount {
  actor: string
  permission: string
  chainId: string
}

export interface ProperWalletSignTransactionArgs {
  chainId: string
  permissionLevel: string
  transaction: unknown
  request: string
}

export interface ProperWalletSignTransactionResponse {
  signatures: string[]
}

export interface ProperWalletTransactResponse {
  signatures: string[]
  transactionId?: string
}

export interface ProperWalletProvider {
  isProperWallet: true
  getAccount(): Promise<ProperWalletAccount>
  signTransaction(
    args: ProperWalletSignTransactionArgs
  ): Promise<ProperWalletSignTransactionResponse>
  transact(args: unknown): Promise<ProperWalletTransactResponse>
  signArbitrary(data: string): Promise<string>
  logout(): Promise<void>
}

declare global {
  interface Window {
    properwallet?: ProperWalletProvider
  }
}
