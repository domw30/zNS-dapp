//- React Imports
import React, { useState } from 'react';

//- Web3 Imports
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useWeb3React } from '@web3-react/core';
import {
	injected,
	walletlink,
	fortmatic,
	portis,
	createWalletConnectConnector,
} from 'lib/connectors';
import { AbstractConnector } from '@web3-react/abstract-connector';

//- Style Imports
import styles from './Wallet.module.scss';

//- Component Imports
import { FutureButton, Spinner, Image } from 'components';

//- Asset Imports
import metamaskIcon from './assets/metamask.svg';
import walletConnectIcon from './assets/walletconnect.svg';
import coinbaseWalletIcon from './assets/coinbasewallet.svg';
import fortmaticIcon from './assets/fortmatic.svg';
import portisIcon from './assets/portis.svg';
import useNotification from 'lib/hooks/useNotification';

type ConnectToWalletProps = {
	onConnect: () => void;
};

const nameToConnector: { [key: string]: AbstractConnector } = {
	metamask: injected,
	coinbase: walletlink,
	fortmatic: fortmatic,
	portis: portis,
};

export const connectorFromName = (name: string) => {
	if (name === 'walletconnect') {
		return createWalletConnectConnector();
	}

	const connector = nameToConnector[name];

	if (!connector) {
		console.error(`invalid connector ${name}`);
		return null;
	}

	return connector;
};

const nameFromConnector = (c: AbstractConnector) => {
	switch (c) {
		case injected:
			return 'MetaMask';
	}

	return 'Wallet';
};

const ConnectToWallet: React.FC<ConnectToWalletProps> = ({ onConnect }) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { active, connector, activate, deactivate } = walletContext;
	const [isLoading, setIsLoading] = useState(false); //state for trigger the loading spinner

	//- Notification State
	const { addNotification } = useNotification();

	const connectToWallet = async (wallet: string) => {
		setIsLoading(true);
		const c = connectorFromName(wallet) as AbstractConnector;

		if (c) {
			//if user tries to connect metamask without provider
			if (wallet === 'metamask' && !window.ethereum) {
				addNotification('Start or get wallet provider and reload');
				setIsLoading(false);
				return;
			}

			const previousWallet = localStorage.getItem('chosenWallet');
			if (previousWallet) await closeSession(previousWallet);
			localStorage.setItem('chosenWallet', wallet); //sets the actual wallet key to reconnect if connected

			//metamask may get stuck due to eth_requestAccounts promise, if user close log in overlay
			if (wallet === 'metamask') {
				setTimeout(async () => {
					const authorized = await injected.isAuthorized();
					if (
						!authorized &&
						localStorage.getItem('chosenWallet') === 'metamask'
					)
						addNotification('Cant connect?, please reload and retry');
				}, 20000); //@todo: check if metamask solves this, issue #10085
			}

			await activate(c, async (e) => {
				addNotification(`Failed to connect to wallet.`);
				localStorage.removeItem('chosenWallet');
				console.error(`Encounter error while connecting to ${wallet}.`);
				console.error(e);
				//if page has a connection request stuck, it needs to reload to get connected again
				if (
					e.message === 'Already processing eth_requestAccounts. Please wait.'
				)
					window.location.reload();
			});

			setIsLoading(false);
			onConnect();
		}
	};

	const closeSession = (wallet: string) => {
		deactivate();
		//if has a wallet connected, instead of just deactivate, close connection too
		switch (wallet) {
			case 'coinbase': {
				walletlink.close();
				break;
			}
			case 'portis': {
				portis.close();
				break;
			}
			case 'fortmatic': {
				fortmatic.close();
				break;
			}
			case 'walletconnect': {
				localStorage.removeItem('walletconnect'); //session info of walletconnect
				break;
			}
			default:
				break;
		}
		localStorage.removeItem('chosenWallet');
	};

	const disconnect = () => {
		const wallet = localStorage.getItem('chosenWallet');
		if (wallet) closeSession(wallet);
		onConnect();
	};

	return (
		<div className={`${styles.Container} border-primary`}>
			<div className={styles.Header}>
				<h3 className={`glow-text-white`}>Connect To A Wallet</h3>
			</div>
			<hr className="glow" />

			<ul>
				<li
					onClick={() => connectToWallet('metamask')}
					className={styles.Wallet}
				>
					Metamask
					<div>
						<img
							style={{ height: 36, width: 36 }}
							alt="metamask"
							src={metamaskIcon}
						/>
					</div>
				</li>
				<li
					onClick={() => connectToWallet('walletconnect')}
					className={`${styles.Wallet} ${styles.MobileEnabled}`}
				>
					<span>Wallet Connect</span>
					<div>
						<img alt="wallet connect" src={walletConnectIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('coinbase')}
					className={styles.Wallet}
				>
					<span>Coinbase Wallet</span>
					<div>
						<img alt="coinbase wallet" src={coinbaseWalletIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('fortmatic')}
					className={styles.Wallet}
				>
					<span>Fortmatic</span>
					<div>
						<img alt="fortmatic" src={fortmaticIcon} />
					</div>
				</li>
				<li onClick={() => connectToWallet('portis')} className={styles.Wallet}>
					<span>Portis</span>
					<div>
						<img alt="portis" src={portisIcon} />
					</div>
				</li>
			</ul>

			{active && connector && (
				<>
					<hr className="glow" />
					<div className={styles.Disconnect}>
						<p>Connected to {nameFromConnector(connector)}</p>
						<FutureButton glow onClick={disconnect}>
							Disconnect
						</FutureButton>
					</div>
				</>
			)}
			<hr className="glow" />
			<div className={styles.Footer}>
				<p>
					New to Ethereum?
					<br />
					<a
						rel="noreferrer"
						href="https://ethereum.org/en/wallets/"
						target="_blank"
					>
						Learn more about wallets
					</a>
				</p>
			</div>
		</div>
	);
};

export default ConnectToWallet;
