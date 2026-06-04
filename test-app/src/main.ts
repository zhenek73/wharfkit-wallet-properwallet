import {
  cancelable,
  ChainDefinition,
  LoginContext,
  PromptArgs,
  PromptResponse,
  SessionKit,
  UserInterface,
  UserInterfaceAccountCreationResponse,
  UserInterfaceLoginResponse,
  UserInterfaceTranslateOptions,
} from '@wharfkit/session'
import {WalletPluginProperWallet} from 'wharfkit-wallet-properwallet'
import type {ProperWalletProvider} from 'wharfkit-wallet-properwallet'

import './styles.css'

const eosMainnet = ChainDefinition.from({
  id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  url: 'https://eos.greymass.com',
})

class MinimalWharfUI implements UserInterface {
  async login(_context: LoginContext): Promise<UserInterfaceLoginResponse> {
    return {walletPluginIndex: 0}
  }

  async onError(error: Error): Promise<void> {
    writeOutput(error)
  }

  async onAccountCreate(): Promise<UserInterfaceAccountCreationResponse> {
    throw new Error('Account creation is not implemented in this test app.')
  }

  async onAccountCreateComplete(): Promise<void> {}
  async onLogin(): Promise<void> {}
  async onLoginComplete(): Promise<void> {}
  async onTransact(): Promise<void> {}
  async onTransactComplete(): Promise<void> {}
  async onSign(): Promise<void> {}
  async onSignComplete(): Promise<void> {}
  async onBroadcast(): Promise<void> {}
  async onBroadcastComplete(): Promise<void> {}

  prompt(_args: PromptArgs) {
    return cancelable(Promise.resolve({} as PromptResponse))
  }

  status(message: string): void {
    writeOutput(message)
  }

  translate(_key: string, options?: UserInterfaceTranslateOptions): string {
    return options?.default || ''
  }

  getTranslate() {
    return this.translate.bind(this)
  }

  addTranslations(): void {}
}

const sessionKit = new SessionKit({
  appName: 'properwallet-test',
  chains: [eosMainnet],
  ui: new MinimalWharfUI(),
  walletPlugins: [new WalletPluginProperWallet()],
})

const output = document.querySelector<HTMLPreElement>('#output')
const loginButton = document.querySelector<HTMLButtonElement>('#login')
const mockButton = document.querySelector<HTMLButtonElement>('#mock')

function writeOutput(value: unknown) {
  if (!output) return
  if (value instanceof Error) {
    output.textContent = value.message
    return
  }
  output.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

function installMockProvider() {
  const provider: ProperWalletProvider = {
    isProperWallet: true,
    async getAccount() {
      return {
        actor: 'properwallet',
        permission: 'active',
        chainId: String(eosMainnet.id),
      }
    },
    async transact(_args) {
      return {
        signatures: [],
        transactionId: 'mock-transaction-id',
      }
    },
    async signArbitrary(data) {
      return `mock-signature:${data}`
    },
    async logout() {},
  }

  window.properwallet = provider
  writeOutput('Mock window.properwallet installed.')
}

loginButton?.addEventListener('click', async () => {
  try {
    const result = await sessionKit.login()
    writeOutput({
      actor: String(result.session.actor),
      permission: String(result.session.permission),
      chainId: String(result.session.chain.id),
      walletPlugin: result.session.walletPlugin.id,
    })
  } catch (error) {
    writeOutput(error)
  }
})

mockButton?.addEventListener('click', installMockProvider)

writeOutput(
  window.properwallet?.isProperWallet
    ? 'ProperWallet provider detected.'
    : 'ProperWallet provider not found.'
)
