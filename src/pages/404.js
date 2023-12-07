import React from 'react'
import { ForbiddenIcon } from '../icons'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

function Page404() {
	const history = useHistory();

	const onGoBack = () => {
		history.goBack();
	}
	
	return (
		<div className="flex flex-col items-center">
			<ForbiddenIcon className="w-12 h-12 mt-8 text-purple-200" aria-hidden="true" />
			<h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">404</h1>
			<p className="text-gray-700 dark:text-gray-300">
				Page not found. Check the address or{' '}
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				<a className="text-purple-600 hover:underline dark:text-purple-300" href="#" onClick={onGoBack}>
						go back
				</a>
				.
			</p>
		</div>
	);
}

export default Page404
