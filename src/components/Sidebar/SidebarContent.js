import React from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import SidebarSubmenu from './SidebarSubmenu'
import Logo60 from '../../assets/img/logo60.png'
function Icon({ icon, ...props }) {
    const Icon = Icons[icon]
    return <Icon {...props} />
}

function SidebarContent() {
    return (
			<div className="pb-4 text-gray-500 dark:text-gray-400 h-full flex flex-col justify-between">
				<div>
					<div></div>
					<div className="logo-container text-lg py-2 font-bold text-gray-800 dark:text-gray-200 flex justify-center" href="#">
						<img
							aria-hidden="true"
							className=""
							src={Logo60}
							alt="Logo Image"
						/>
					</div>
					<ul className="mt-6">
						{routes.map((route) =>
							route.routes ? (
									<SidebarSubmenu route={route} key={route.name} />
							) : (
								<li className="relative px-6 py-3" key={route.name}>
										<NavLink
												exact
												to={route.path}
												className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
												activeClassName="text-gray-800 dark:text-gray-100"
										>
												<Route path={route.path} exact={route.exact}>
														<span
																className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
																aria-hidden="true"
														></span>
												</Route>
												<Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
												<span className="ml-4">{route.name}</span>
										</NavLink>
								</li>
								)
							)}
					</ul>
				</div>
				<div className='text-gray-400 pl-2 text-xs'>
					<div>Created by <a href="https://github.com/toup162" target="_blank" rel="noreferrer"><u>Matthew Blair</u></a></div> 
					<div>Icons by <a href="https://icons8.com/" target="_blank" rel="noreferrer"><u>Icons8</u></a></div>
				</div>
			</div>
    )
}

export default SidebarContent
