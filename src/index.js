import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client';
import './assets/css/tailwind.output.css'
import './assets/css/global.css'
import 'react-tippy/dist/tippy.css';
import App from './App'
import { SidebarProvider } from './context/SidebarContext'
import ThemedSuspense from './components/ThemedSuspense'
import { Windmill } from '@windmill/react-ui'
import * as serviceWorker from './serviceWorker'
import { UserLocalProvider } from './context/UserLocalContext'

// if (process.env.NODE_ENV !== 'production') {
//     const axe = require('react-axe')
//     axe(React, ReactDOM, 1000)
// }
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserLocalProvider>
    <SidebarProvider>
        <Suspense fallback={<ThemedSuspense />}>
            <Windmill usePreferences>
                <App />
            </Windmill>
        </Suspense>
    </SidebarProvider>
	</UserLocalProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()