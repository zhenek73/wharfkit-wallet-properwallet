# wharfkit-wallet-properwallet

ProperWallet wallet plugin for [`@wharfkit/session`](https://www.npmjs.com/package/@wharfkit/session).

This package is the dApp-side WharfKit integration point for dApps opened inside ProperWallet Discovery. It discovers the injected `window.properwallet` provider and delegates account lookup and signing to ProperWallet. Private keys are never stored in this plugin.

## Installation

From npm (after publish):

```bash
npm install wharfkit-wallet-properwallet
```

From GitHub (for testing before npm publish):

```bash
npm install github:zhenek73/wharfkit-wallet-properwallet
```

## Usage

```ts
import {SessionKit} from '@wharfkit/session'
import {WalletPluginProperWallet} from 'wharfkit-wallet-properwallet'

const sessionKit = new SessionKit({
  appName: 'my-dapp',
  chains: [chain],
  walletPlugins: [new WalletPluginProperWallet()],
})

const {session} = await sessionKit.login()
```

When the dApp is opened in ProperWallet Discovery, ProperWallet should inject:

```ts
window.properwallet
```

If the provider is missing, `login()` throws `ProperWallet provider not found`.
