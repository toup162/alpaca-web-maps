import React from 'react'

import { ForbiddenIcon } from '../icons'
import MapIcon from '../assets/img/location.png'

function Page404() {
    return (
        /* <div className="flex flex-col items-center">
            <ForbiddenIcon className="w-12 h-12 mt-8 text-purple-200" aria-hidden="true" />
            <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">404</h1>
            <p className="text-gray-700 dark:text-gray-300">
                Page not found. Check the address or{' '}
                <a className="text-purple-600 hover:underline dark:text-purple-300" href="../">
                    go back
                </a>
                .
            </p>
        </div> */

				<div className="flex flex-col items-center">
            <img className="text-purple-200 map-icon" alt='map icon' aria-hidden="true" src={MapIcon} />
            <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">404</h1>
            <p className="text-gray-700 dark:text-gray-300">
                Start by importing a map or
                <a className="text-purple-600 hover:underline dark:text-purple-300" href="./create-map">
                    go back
                </a>
                .
            </p>
        </div>
    )
}

export default Page404
