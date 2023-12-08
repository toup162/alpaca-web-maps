import React, { useContext, useState } from 'react'

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent } from 'react-leaflet'
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { UserLocalContext } from '../context/UserLocalContext';
import { LatLng } from 'leaflet';
import { nanoid } from 'nanoid';
import CreateMarkerModal from '../components/Modals/CreateMarkerModal/CreateMarkerModal';

const ADD_MARKER_CLICK_LISTENER = 'ADD_MARKER_CLICK_LISTENER';
const MAP_ID_PLACEHOLDER = 'TEMP_ID';

const MapViewer = () => {
	const { mapId } = useParams();
	const { userLocal } = useContext(UserLocalContext);
	const mapDetails = userLocal?.maps?.find(m => m.mapId === mapId);

	const INITIAL_MARKERS = [
		{
			tooltip: <div>London</div>,
			pos: new LatLng(51.505, -0.09),
			id: nanoid()
		},
		{
			tooltip: <div>Boston</div>,
			pos: new LatLng(42.35, -71.06),
			id: nanoid()
		},
	];


	const [markers, setMarkers] = useState(INITIAL_MARKERS);
	const [activeClickListener, setActiveClickListener] = useState(ADD_MARKER_CLICK_LISTENER);
	const [creatingMarker, setCreatingMarker] = useState(null);


	const MapControlHandler = () => {
		
		/*const map = useMapEvent('click', () => {
			map.setView([50.5, 30.5], map.getZoom())
		})*/
		useMapEvent('click', e => {
			if (activeClickListener === ADD_MARKER_CLICK_LISTENER) {
				
				/* Create a temporary marker that can be seen on the map while we create the real marker in the modal*/
				const placeholderMarker = {
					pos: e.latlng,
					id: MAP_ID_PLACEHOLDER
				};

				setMarkers([...markers, placeholderMarker])

				/* Open a modal to customize the marker being created */
				setCreatingMarker(placeholderMarker);
			}
			
		})
		return null
	}

	const deletePlaceholderMarker = () => {
		setMarkers([
			...markers.filter(marker => marker.id !== MAP_ID_PLACEHOLDER)
		]);
	}

	const onConfirmCreateMarker = newMarker => {

		console.log(newMarker.icon);

		/* Delete the placeholder marker, add the new marker */
		setMarkers([
			...markers.filter(marker => marker.id !== MAP_ID_PLACEHOLDER),
			newMarker
		]);
		/* Close the modal */
		setCreatingMarker(null);
	}

	return (
		<div>
			<CreateMarkerModal
				creatingMarker={creatingMarker}
				setCreatingMarker={setCreatingMarker}
				deletePlaceholderMarker={deletePlaceholderMarker}
				onConfirm={onConfirmCreateMarker}
			/>
			
			{mapDetails && <>
				<MapContainer
					center={[Number(mapDetails.centerXCoord), Number(mapDetails.centerYCoord)]}
					zoom={Number(mapDetails.initialZoom)}
					maxZoom={Number(mapDetails.maxZoom)}
					minZoom={Number(mapDetails.minZoom)}
					className='fullscreen-map'
				>
					<TileLayer
						attribution='test'
						url={`${mapDetails.tileRootDirectoryUrl}${mapDetails.tileDirectorySchema}`}
						noWrap={true}
					/>
						{markers.map(marker => {
							console.log(marker);
							return (
								<Marker
									key={marker.id}
									position={marker.pos}
									{...(marker.icon && { icon: marker.icon } )}
								>
									{marker.tooltip && 
										<Tooltip>
											{marker.tooltip}
										</Tooltip>
									}
									{marker.popup && 
										<Popup>
											{marker.popup}
										</Popup>
									}
								</Marker>
							)
						})}
					<MapControlHandler />
				</MapContainer>
			</>}
			
		</div>
	);
}

export default MapViewer;
