import L, { Icon } from 'leaflet';
import _ from 'lodash'
import React, { useState, useMemo, useEffect } from 'react'

export const UserLocalContext = React.createContext()

export const UserLocalProvider = ({ children }) => {
	
	/* Try to get local storage for user data */
	const stringifiedUserLocal = localStorage.getItem('ALPACA_WEB_MAPS_USER_LOCAL');
	const parsedUserLocal = JSON.parse(stringifiedUserLocal);
	parsedUserLocal?.maps?.forEach(map => {
		/* factory for parsed JSON of marker icons into Icon objects */
		map.markers?.forEach(marker => {
			if (!marker.type || marker.type === 'marker') {
				marker.icon = new Icon ({
					...marker.icon.options
				})
			} else if (marker.type === 'label') {
				marker.icon = new L.divIcon({
					...marker.icon.options,
				})
			}
		})
	});

	const [userLocal, setUserLocal] = useState(parsedUserLocal ? parsedUserLocal : {
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
				tileDirectorySchema: '/{z}/{y}/{x}.png'
			},
			{
				mapName: "Test OSM",
				tileRootDirectoryUrl: "https://tile.osm.org",
				mapAttribution: "a",
				createdTs: "2023-12-07T07:03:35.249Z",
				modifiedTs: "2023-12-07T07:03:35.249Z",
				mapId: "QnfGogwN0jKYk9EeEaGsL",
				centerXCoord: '37.56',
				centerYCoord: '-95.16',
				initialZoom: '5',
				minZoom: '2',
				maxZoom: '13',
				tileDirectorySchema: '/{z}/{x}/{y}.png'
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

	useEffect(() => {
		localStorage.setItem('ALPACA_WEB_MAPS_USER_LOCAL', JSON.stringify(userLocal));
	}, [userLocal])

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

	const setMarkersByMapId = (mapId, markers) => {
		const clonedUserLocal = userLocal ? _.cloneDeep(userLocal) : { };
		const mapToUpdate = clonedUserLocal?.maps?.find(m => m.mapId === mapId);
		if (mapToUpdate) {
			mapToUpdate.markers = markers;
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
			addMap,
			deleteMap,
			updateMap,
			setMarkersByMapId,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[userLocal]
	)

	return <UserLocalContext.Provider value={value}>{children}</UserLocalContext.Provider>
}
