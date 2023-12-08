import _ from 'lodash'
import React, { useState, useMemo } from 'react'

export const UserLocalContext = React.createContext()

export const UserLocalProvider = ({ children }) => {
	
	const [userLocal, setUserLocal] = useState({
    maps: [
			{
				mapName: "Map Name",
				tileRootDirectoryUrl: "https://raw.githubusercontent.com/toup162/alpaca-web-maps/master/public/placeholder_map",
				mapAttribution: "111",
				createdTs: "2023-12-07T06:15:52.510Z",
				modifiedTs: "2023-12-07T06:22:45.476Z",
				mapId: "8zwl-kEi1GqFZHnIcZYm9",
				centerXCoord: '60',
				centerYCoord: '-20',
				initialZoom: '2',
				minZoom: '2',
				maxZoom: '6',
			},
			{
				mapName: "Test OSM",
				tileRootDirectoryUrl: "https://tile.osm.org",
				mapAttribution: "a",
				createdTs: "2023-12-07T07:03:35.249Z",
				modifiedTs: "2023-12-07T07:03:35.249Z",
				mapId: "QnfGogwN0jKYk9EeEaGsL",
				centerXCoord: '60',
				centerYCoord: '-20',
				initialZoom: '2',
				minZoom: '2',
				maxZoom: '6',
			}
    ]
	})

/*
	const [userLocal, setUserLocal] = useState({
		maps: null,
	})
*/

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

	const updateMap = map => {
		const clonedUserLocal = userLocal ? _.cloneDeep(userLocal) : { };
		if (clonedUserLocal?.maps) {
			let existingMapDetails = clonedUserLocal.maps.find(m => m.mapId === map.mapId);
			Object.keys(map).forEach(key => {
				existingMapDetails[key] = map[key];
			})
			setUserLocal(clonedUserLocal);
		}
	}

	const deleteMap = mapId => {
		const clonedUserLocal = userLocal ? _.cloneDeep(userLocal) : { };
		clonedUserLocal.maps = userLocal.maps.filter(m => m.mapId !== mapId);
		setUserLocal(clonedUserLocal);
	}

	const value = useMemo(
			() => ({
					userLocal,
					initFromLocalStorage,
					saveToLocalStorage,
					addMap,
					deleteMap,
					updateMap
			}),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[userLocal]
	)

	return <UserLocalContext.Provider value={value}>{children}</UserLocalContext.Provider>
}
