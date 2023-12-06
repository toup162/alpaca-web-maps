import React from 'react'
import { useLocation } from 'react-router-dom';

function Main({ children }) {
	const location = useLocation();
	return (
		<main className={`layout_background h-full overflow-${location?.pathname?.includes('/app/map/') ? 'hidden' : 'y-auto'}`}>
			<div className="main-container container grid">{children}</div>
		</main>
  )
}

export default Main
