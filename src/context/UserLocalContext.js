import _ from 'lodash'
import React, { useState, useMemo } from 'react'

export const UserLocalContext = React.createContext()

export const UserLocalProvider = ({ children }) => {
    const [userLocal, setUserLocal] = useState(null)

    const initFromLocalStorage = () => {
			const stringifiedUserLocal = localStorage.getItem('ALPACA_WEB_MAPS_USER_LOCAL');
			const parsedUserLocal = JSON.parse(stringifiedUserLocal);
			parsedUserLocal && setUserLocal(parsedUserLocal);
		}

    const saveToLocalStorage = () => {
			localStorage.setItem('ALPACA_WEB_MAPS_USER_LOCAL', JSON.stringify(userLocal));
		}

		const addMap = map => {
			const clonedUserLocal = userLocal ? _.cloneDeep(userLocal) : { };
			if (userLocal?.maps) {
				clonedUserLocal.maps.push(map);
			} else if (!userLocal || !userLocal.maps) {
				clonedUserLocal.maps = [map];
			}
			setUserLocal(clonedUserLocal);
		}

    const value = useMemo(
        () => ({
						userLocal,
            initFromLocalStorage,
            saveToLocalStorage,
						addMap,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [userLocal]
    )

    return <UserLocalContext.Provider value={value}>{children}</UserLocalContext.Provider>
}
