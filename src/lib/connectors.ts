import { InjectedConnector as MetaMask } from '@web3-react/injected-connector';
import { NetworkConnector as Network } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
import { FrameConnector } from '@web3-react/frame-connector';
import { AuthereumConnector } from '@web3-react/authereum-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { MagicConnector } from '@web3-react/magic-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { TorusConnector } from '@web3-react/torus-connector';

const POLLING_INTERVAL = 12000;
export const RPC_URLS: { [chainId: number]: string } = {
	1: process.env.REACT_APP_RPC_URL_1 as string,
	// 4: process.env.REACT_APP_RPC_URL_4 as string,
	42: process.env.REACT_APP_RPC_URL_42 as string,
};

export const injected = new MetaMask({
	supportedChainIds: [1, 3, 4, 5, 42],
});

export const network = new Network({
	urls: { 1: RPC_URLS[1], 42: RPC_URLS[42] },
	defaultChainId: 1,
});

export const createWalletConnectConnector = () => {
	return new WalletConnectConnector({
		rpc: { 1: RPC_URLS[1], 42: RPC_URLS[42] },
		bridge: 'https://bridge.walletconnect.org',
		qrcode: true,
		pollingInterval: POLLING_INTERVAL,
		supportedChainIds: [1, 42],
	});
};

export const walletlink = new WalletLinkConnector({
	url: RPC_URLS[1],
	appName: 'Wilder World',
});

export const ledger = new LedgerConnector({
	chainId: 1,
	url: RPC_URLS[1],
	pollingInterval: POLLING_INTERVAL,
});

export const trezor = new TrezorConnector({
	chainId: 1,
	url: RPC_URLS[1],
	pollingInterval: POLLING_INTERVAL,
	manifestEmail: 'dummy@abc.xyz',
	manifestAppUrl: 'http://localhost:1234',
});

export const frame = new FrameConnector({ supportedChainIds: [1] });

export const authereum = new AuthereumConnector({ chainId: 42 });

export const fortmatic = new FortmaticConnector({
	apiKey: process.env.REACT_APP_FORTMATIC_API_KEY_MAIN as string,
	chainId: 1,
});

export const magic = new MagicConnector({
	apiKey: process.env.MAGIC_API_KEY as string,
	chainId: 4,
	email: 'hello@example.org',
});

export const portis = new PortisConnector({
	dAppId: process.env.REACT_APP_PORTIS_DAPP_ID as string,
	networks: [1, 100],
});

export const torus = new TorusConnector({ chainId: 1 });
