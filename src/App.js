import React, { lazy } from 'react'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'

const Layout = lazy(() => import('./containers/Layout'))


function App() {

	return (
		<>
			<Router>
				<AccessibleNavigationAnnouncer />
				<Switch>
						{/* Place new routes over this */}
						<Route path="/app" component={Layout} />
						{/* If you have an index page, you can remothis Redirect */}
						<Redirect exact from="/" to="/app" />
				</Switch>
			</Router>
		</>
		
	);
}

export default App;
