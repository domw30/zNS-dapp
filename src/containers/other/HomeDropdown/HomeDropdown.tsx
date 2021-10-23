import styles from './HomeDropdown.module.scss';

import { OptionDropdown } from 'components';

type HomeDropdownProps = {
	onConnectWallet: () => void;
	onMint: () => void;
	onProfile: () => void;
	isWalletConnected?: boolean;
};

const HomeDropdown: React.FC<HomeDropdownProps> = ({
	onConnectWallet,
	onMint,
	onProfile,
	isWalletConnected,
}) => {
	const defaultOptions = [
		{
			text: 'Connect Wallet',
			onSelect: onConnectWallet,
		},
	];

	const connectedOptions = [
		...defaultOptions,
		{
			text: 'Mint',
			onSelect: onMint,
		},
	];

	const options = isWalletConnected ? connectedOptions : defaultOptions;

	const onSelect = (selection: string) => {
		const option = options.filter((e) => e.text === selection)?.[0];
		if (option) {
			option.onSelect();
		}
	};

	return (
		<OptionDropdown
			options={options.map((o) => o.text)}
			onSelect={onSelect}
			placement="bottom-end"
		>
			<div className={styles.Dots}>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</OptionDropdown>
	);
};

export default HomeDropdown;
