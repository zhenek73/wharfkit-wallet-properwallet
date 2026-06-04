import {
  AbstractWalletPlugin,
  Checksum256,
  LoginContext,
  LogoutContext,
  PermissionLevel,
  ResolvedSigningRequest,
  Signature,
  TransactContext,
  WalletPlugin,
  WalletPluginConfig,
  WalletPluginLoginResponse,
  WalletPluginMetadata,
  WalletPluginSignResponse,
} from '@wharfkit/session'

import {ProperWalletProvider} from './types'

const PROVIDER_NOT_FOUND = 'ProperWallet provider not found'

export class WalletPluginProperWallet extends AbstractWalletPlugin implements WalletPlugin {
  id = 'properwallet'

  translations = {}

  readonly config: WalletPluginConfig = {
    requiresChainSelect: false,
    requiresPermissionSelect: false,
  }

  readonly metadata: WalletPluginMetadata = WalletPluginMetadata.from({
    name: 'ProperWallet',
    description: 'Use the ProperWallet account available in Discovery.',
    logo: {
      dark: 'https://webdex.space/icons/webdexlogo.png',
      light: 'https://webdex.space/icons/webdexlogo.png',
    },
  })

  async login(_context: LoginContext): Promise<WalletPluginLoginResponse> {
    const provider = this.getProvider()
    const account = await provider.getAccount()

    return {
      chain: Checksum256.from(account.chainId),
      permissionLevel: PermissionLevel.from({
        actor: account.actor,
        permission: account.permission,
      }),
    }
  }

  async sign(
    resolved: ResolvedSigningRequest,
    context: TransactContext
  ): Promise<WalletPluginSignResponse> {
    const provider = this.getProvider()
    const response = await provider.transact({
      chainId: String(context.chain.id),
      permissionLevel: String(context.permissionLevel),
      transaction: resolved.transaction,
      request: String(resolved.request),
    })

    return {
      signatures: response.signatures.map((signature) => Signature.from(signature)),
    }
  }

  async logout(_context: LogoutContext): Promise<void> {
    const provider = this.getProvider()
    await provider.logout()
  }

  private getProvider(): ProperWalletProvider {
    if (typeof window === 'undefined' || !window.properwallet?.isProperWallet) {
      throw new Error(PROVIDER_NOT_FOUND)
    }

    return window.properwallet
  }
}
