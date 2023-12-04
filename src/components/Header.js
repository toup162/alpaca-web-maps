import React, { useContext } from 'react'
import { SidebarContext } from '../context/SidebarContext'
import {
    MenuIcon,
} from '../icons'

function Header() {
    const { toggleSidebar } = useContext(SidebarContext)

    return (
        <header className="lg:hidden z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
            <div className="flex justify-between h-full px-6 mr-0 ml-0 text-purple-600 dark:text-purple-300">
                
                <div className="mobile-logo p-1">alpacatrain</div>
                
                {/* <!-- Mobile hamburger --> */}
                <button
                    className="p-1 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
                    onClick={toggleSidebar}
                    aria-label="Menu"
                >
                    <MenuIcon className="w-6 h-6" aria-hidden="true" />
                </button>
                
            </div>
        </header>
    )
}

export default Header
