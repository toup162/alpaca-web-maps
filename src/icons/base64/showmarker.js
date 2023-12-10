import React from 'react';

const ShowMarker = ({className}) => {
	return (
		<img className={className} alt='show marker icon' src='data:image/png;base64,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' />
	);
}

export default ShowMarker;
