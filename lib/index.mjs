// src/WalletPluginProperWallet.ts
import {
  AbstractWalletPlugin,
  Checksum256,
  PermissionLevel,
  Signature,
  WalletPluginMetadata
} from "@wharfkit/session";
var PROVIDER_NOT_FOUND = "ProperWallet provider not found";
var WalletPluginProperWallet = class extends AbstractWalletPlugin {
  constructor() {
    super(...arguments);
    this.id = "properwallet";
    this.translations = {};
    this.config = {
      requiresChainSelect: false,
      requiresPermissionSelect: false
    };
    this.metadata = WalletPluginMetadata.from({
      name: "ProperWallet",
      description: "Use the ProperWallet account available in Discovery.",
      logo: {
        dark: "https://webdex.space/icons/webdexlogo.png",
        light: "https://webdex.space/icons/webdexlogo.png"
      }
    });
  }
  async login(_context) {
    const provider = this.getProvider();
    const account = await provider.getAccount();
    return {
      chain: Checksum256.from(account.chainId),
      permissionLevel: PermissionLevel.from({
        actor: account.actor,
        permission: account.permission
      })
    };
  }
  async sign(resolved, context) {
    const provider = this.getProvider();
    const response = await provider.transact({
      chainId: String(context.chain.id),
      permissionLevel: String(context.permissionLevel),
      transaction: resolved.transaction,
      request: String(resolved.request)
    });
    return {
      signatures: response.signatures.map((signature) => Signature.from(signature))
    };
  }
  async logout(_context) {
    const provider = this.getProvider();
    await provider.logout();
  }
  getProvider() {
    if (typeof window === "undefined" || !window.properwallet?.isProperWallet) {
      throw new Error(PROVIDER_NOT_FOUND);
    }
    return window.properwallet;
  }
};
export {
  WalletPluginProperWallet
};
//# sourceMappingURL=index.mjs.map