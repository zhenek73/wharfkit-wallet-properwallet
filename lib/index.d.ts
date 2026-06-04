import { AbstractWalletPlugin, WalletPlugin, WalletPluginConfig, WalletPluginMetadata, LoginContext, WalletPluginLoginResponse, ResolvedSigningRequest, TransactContext, WalletPluginSignResponse, LogoutContext } from '@wharfkit/session';

interface ProperWalletAccount {
    actor: string;
    permission: string;
    chainId: string;
}
interface ProperWalletSignTransactionArgs {
    chainId: string;
    permissionLevel: string;
    transaction: unknown;
    request: string;
}
interface ProperWalletSignTransactionResponse {
    signatures: string[];
}
interface ProperWalletTransactResponse {
    signatures: string[];
    transactionId?: string;
}
interface ProperWalletProvider {
    isProperWallet: true;
    getAccount(): Promise<ProperWalletAccount>;
    signTransaction(args: ProperWalletSignTransactionArgs): Promise<ProperWalletSignTransactionResponse>;
    transact(args: unknown): Promise<ProperWalletTransactResponse>;
    signArbitrary(data: string): Promise<string>;
    logout(): Promise<void>;
}
declare global {
    interface Window {
        properwallet?: ProperWalletProvider;
    }
}

declare class WalletPluginProperWallet extends AbstractWalletPlugin implements WalletPlugin {
    id: string;
    translations: {};
    readonly config: WalletPluginConfig;
    readonly metadata: WalletPluginMetadata;
    login(_context: LoginContext): Promise<WalletPluginLoginResponse>;
    sign(resolved: ResolvedSigningRequest, context: TransactContext): Promise<WalletPluginSignResponse>;
    logout(_context: LogoutContext): Promise<void>;
    private getProvider;
}

export { type ProperWalletAccount, type ProperWalletProvider, type ProperWalletSignTransactionArgs, type ProperWalletSignTransactionResponse, type ProperWalletTransactResponse, WalletPluginProperWallet };
