//- React Imports
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLayer } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';

//- Style Imports
import styles from './OptionDropdown.module.scss';

type OptionDropdownProps = {
	options: string[];
	selectionMode?: 'none' | 'single' | 'multi';
	onSelect?: (selection: string) => void;
	children: React.ReactNode | string | number;
	placement?: 'bottom-start' | 'bottom-center' | 'bottom-end';
};

const OptionDropdown: React.FC<OptionDropdownProps> = ({
	options,
	onSelect,
	selectionMode = 'none',
	children,
	placement = 'bottom-center',
}) => {
	//////////////////
	// State & Refs //
	//////////////////

	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(options[0] || '');

	const { triggerProps, layerProps, renderLayer } = useLayer({
		isOpen: isOpen,
		placement,
		onOutsideClick: close,
	});

	const animationProps = {
		initial: { zIndex: 10000, opacity: 0, scale: 0.9 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.9 },
		transition: { duration: 0.1 },
	};

	///////////////
	// Functions //
	///////////////

	const select = (option: string) => {
		if (selectionMode !== 'none') {
			setSelected(option);
		}
		if (onSelect) {
			onSelect(option);
		}
		close();
	};

	const open = () => {
		setIsOpen(true);
	};

	function close() {
		setIsOpen(false);
	}

	// Toggles the visibility of the drawer
	const toggle = () => {
		if (isOpen) close();
		else open();
	};

	/////////////
	// Effects //
	/////////////

	return (
		<div>
			<div className={styles.Header} {...triggerProps} onClick={toggle}>
				{children}
			</div>
			{renderLayer(
				<AnimatePresence>
					{isOpen && (
						<motion.div {...animationProps} {...layerProps}>
							<ul className={styles.Drawer}>
								{options.map((o) => (
									<li
										className={
											selectionMode !== 'none' && selected === o
												? styles.Selected
												: ''
										}
										onClick={() => select(o)}
										key={o}
									>
										{o}
									</li>
								))}
							</ul>
						</motion.div>
					)}
				</AnimatePresence>,
			)}
		</div>
	);
};

export default OptionDropdown;
