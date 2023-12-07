import React, { useContext, Suspense, useEffect, lazy } from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import routes from '../routes'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Main from '../containers/Main'
import ThemedSuspense from '../components/ThemedSuspense'
import { SidebarContext } from '../context/SidebarContext'
import { Toaster } from 'react-hot-toast';

const Page404 = lazy(() => import('../pages/404'))
const MapViewer = lazy(() => import('../pages/MapViewer'))
const CreateEditMap = lazy(() => import('../pages/CreateEditMap'))

function Layout() {
    const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
    let location = useLocation()

    useEffect(() => {
        closeSidebar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])
    return (
        <div
            className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'}`}
        >
            <Sidebar />
						<Toaster toastOptions={{
								className: '',
								style: {
									borderRadius: '10px',
									background: 'rgb(26, 28, 35)',
									color: '#fff',
								},
							}}
						/>
            <div className="flex flex-col flex-1 w-full">
                <Header />
                <Main>
                    <Suspense fallback={<ThemedSuspense />}>
                        <Switch>
                            {routes.map((route, i) => {
                                return route.component ? (
                                    <Route
                                        key={i}
                                        exact={true}
                                        path={`/app${route.path}`}
                                        render={(props) => <route.component {...props} />}
                                    />
                                ) : null
                            })}
														<Route component={MapViewer} path={`/app/map/:mapId`} />
														<Route component={CreateEditMap} path={`/app/create-map`} />
														<Route component={CreateEditMap} path={`/app/edit-map/:mapId`} />
                            <Redirect exact from="/app" to="/app/dashboard" />
                            <Route component={Page404} />
                        </Switch>
                    </Suspense>
                </Main>
            </div>
        </div>
    )
}

export default Layout
