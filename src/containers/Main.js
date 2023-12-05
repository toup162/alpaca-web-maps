import React from 'react'
import { useLocation } from 'react-router-dom';

function Main({ children }) {
	const location = useLocation();
	return (
		<main className={`layout_background h-full overflow-${location?.pathname === '/app/dashboard' ? 'hidden' : 'y-auto'}`}>
			<div className="dashboard-container container grid w-100">{children}</div>
		</main>
  )
}

export default Main
