import React, { useState } from 'react';

import styles from './TextButton.module.scss';

const TextButton = (props) => {
	const [selected, setSelected] = useState(false);

	const handleClick = () => {
		setSelected(!selected);
		if (props.onClick) props.onClick();
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.textButton} ${
				(props.toggleable && selected) || props.selected ? styles.selected : ''
			} ${props.className ? props.className : ''}`}
			style={props.style}
		>
			{props.children}
		</button>
	);
};

export default TextButton;
