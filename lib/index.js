"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  WalletPluginProperWallet: () => WalletPluginProperWallet
});
module.exports = __toCommonJS(index_exports);

// src/WalletPluginProperWallet.ts
var import_session = require("@wharfkit/session");
var PROVIDER_NOT_FOUND = "ProperWallet provider not found";
var WalletPluginProperWallet = class extends import_session.AbstractWalletPlugin {
  constructor() {
    super(...arguments);
    this.id = "properwallet";
    this.translations = {};
    this.config = {
      requiresChainSelect: false,
      requiresPermissionSelect: false
    };
    this.metadata = import_session.WalletPluginMetadata.from({
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
    console.log("[ProperWallet] provider detected");
    const account = await provider.getAccount();
    console.log("[ProperWallet] login success");
    return {
      chain: import_session.Checksum256.from(account.chainId),
      permissionLevel: import_session.PermissionLevel.from({
        actor: account.actor,
        permission: account.permission
      })
    };
  }
  async sign(resolved, context) {
    const provider = this.getProvider();
    console.log("[ProperWallet] sign called");
    const response = await provider.signTransaction({
      chainId: String(context.chain.id),
      permissionLevel: String(context.permissionLevel),
      transaction: resolved.transaction,
      request: String(resolved.request)
    });
    console.log("[ProperWallet] sign success");
    return {
      signatures: response.signatures.map((signature) => import_session.Signature.from(signature))
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WalletPluginProperWallet
});
//# sourceMappingURL=index.js.map