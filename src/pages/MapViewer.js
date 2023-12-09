import React, { useContext, useState } from 'react'

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent } from 'react-leaflet'
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { UserLocalContext } from '../context/UserLocalContext';
import { Icon } from 'leaflet';
import CreateMarkerModal from '../components/Modals/CreateMarkerModal/CreateMarkerModal';
import { Card, CardBody } from '@windmill/react-ui';
import MouseTracker from '../components/MouseTracker';
import { Tooltip as TippyTooltip } from 'react-tippy';
import Control from 'react-leaflet-custom-control'
import MarkerPopupControls from '../components/MarkerPopupControls';
import AddMarker from '../icons/base64/addmarker';
import HideMarker from '../icons/base64/hidemarker';
import ZoomIn from '../icons/base64/zoomin';
import ZoomOut from '../icons/base64/zoomout';
import ShowMarker from '../icons/base64/showmarker';

const ADD_MARKER_CLICK_LISTENER = 'ADD_MARKER_CLICK_LISTENER';
const REPOSITION_MARKER_CLICK_LISTENER = 'REPOSITION_MARKER_CLICK_LISTENER';
const MAP_ID_PLACEHOLDER = 'TEMP_ID';

const MapViewer = () => {
	const { mapId } = useParams();
	const { userLocal } = useContext(UserLocalContext);
	const mapDetails = userLocal?.maps?.find(m => m.mapId === mapId);
	const [mapRef, setMapRef] = useState(null);
	const [markers, setMarkers] = useState([]);
	const [activeClickListener, setActiveClickListener] = useState(null);
	const [creatingMarker, setCreatingMarker] = useState(null);
	const [isRepositioningMarker, setIsRepositioningMarker] = useState(null);
	const [confirmDeleteMarkerTooltipIsOpen, setConfirmDeleteMarkerTooltipIsOpen] = useState(false);
	const [showMarkers, setShowMarkers] = useState(true);

	const MapControlHandler = () => {
		
		useMapEvent('click', e => {
			if (activeClickListener === ADD_MARKER_CLICK_LISTENER) {
				
				/* Create a temporary marker that can be seen on the map while we create the real marker in the modal*/
				const placeholderMarker = {
					pos: e.latlng,
					id: MAP_ID_PLACEHOLDER,
					icon: new Icon ({
						iconUrl: `https://img.icons8.com/?size=50&id=Sk4BAluINF9y&format=png`,
						iconSize: [36,36],
						iconAnchor: [18,36],
						tooltipAnchor: [188,-18]
					})
				};

				setMarkers([...markers, placeholderMarker])

				/* Open a modal to customize the marker being created */
				setCreatingMarker(placeholderMarker);
				setActiveClickListener(null);

			} else if (activeClickListener === REPOSITION_MARKER_CLICK_LISTENER) {
				setMarkers([
					...markers,
					{
						...isRepositioningMarker,
						pos: e.latlng
					}
				]);
				setActiveClickListener(null);
				setIsRepositioningMarker(null);
				
			}
		})

		return <div />;
	}

	const deleteMarker = id => {
		setMarkers([
			...markers.filter(marker => marker.id !== id)
		]);
	}

	const onConfirmCreateMarker = newMarker => {
		/* Delete the placeholder marker, add the new marker */
		setMarkers([
			...markers.filter(marker => marker.id !== MAP_ID_PLACEHOLDER),
			newMarker
		]);
		/* Close the modal */
		setCreatingMarker(null);

		/* Just in case 'Hide Markers' is active, set it to show markers */
		!showMarkers && setShowMarkers(true);
	}

	return (
		<div>
			{(activeClickListener === REPOSITION_MARKER_CLICK_LISTENER || activeClickListener === ADD_MARKER_CLICK_LISTENER)  && 
				<MouseTracker offset={{ x: 10, y: -40 }}>Click the map to place the marker.</MouseTracker>
			}
			
			<CreateMarkerModal
				creatingMarker={creatingMarker}
				setCreatingMarker={setCreatingMarker}
				deleteMarker={deleteMarker}
				onConfirm={onConfirmCreateMarker}
			/>
			
			{mapDetails &&
			<div className={isRepositioningMarker || activeClickListener === ADD_MARKER_CLICK_LISTENER ? 'positioning-marker' : ''}>
				<MapContainer
					center={[Number(mapDetails.centerXCoord), Number(mapDetails.centerYCoord)]}
					zoom={Number(mapDetails.initialZoom)}
					maxZoom={Number(mapDetails.maxZoom)}
					minZoom={Number(mapDetails.minZoom)}
					zoomControl={false}
					className='fullscreen-map'
					whenReady={({ target }) => setMapRef(target)}
				>
					<TileLayer
						attribution='test'
						url={`${mapDetails.tileRootDirectoryUrl}${mapDetails.tileDirectorySchema}`}
						noWrap={true}
					/>
					
					{showMarkers && markers.map(marker => {
						return (
							isRepositioningMarker !== marker.markerId &&
							<Marker
								key={marker.id}
								position={marker.pos}
								{...(marker.icon && { icon: marker.icon } )}
							>
								{marker.tooltip && activeClickListener !== REPOSITION_MARKER_CLICK_LISTENER &&
									<Tooltip >
										{marker.tooltip}
									</Tooltip>
								}

								{marker.popup && !isRepositioningMarker &&
									<Popup maxWidth={360}>
										<div className='text-left pb-2'>
											<div className='text-lg font-bold'>{marker.label}</div>
											<div className='max-h-24 overflow-y-auto mt-2'>
												Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, cum commodi a omnis numquam
												quod? Totam exercitationem quos hic ipsam at qui cum numquam, sed amet ratione! Ratione, nihil
												dolorum. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, cum commodi a omnis numquam
												quod? Totam exercitationem quos hic ipsam at qui cum numquam, sed amet ratione! Ratione, nihil
												dolorum.
											</div>
											<hr className='mt-5' />
											<MarkerPopupControls
												marker={marker}
												setIsRepositioningMarker={setIsRepositioningMarker}
												deleteMarker={deleteMarker}
												setActiveClickListener={setActiveClickListener}
												confirmDeleteMarkerTooltipIsOpen={confirmDeleteMarkerTooltipIsOpen}
												setConfirmDeleteMarkerTooltipIsOpen={setConfirmDeleteMarkerTooltipIsOpen}
											/>
										</div>
									</Popup>
								}
							</Marker>
						)
					})}
					<Control prepend position='topleft' >
						<Card colored  className='bg-white'>
							<CardBody>
								{/* Zoom Controls */}
								<div className='flex flex-col text-gray-400 text-center'>
									<div className='font-bold'>Zoom</div>
									<button onClick={() => mapRef.setZoom(mapRef.getZoom() + 1)} color='inherit' layout='outline' className='rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-300 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray'> 
										<ZoomIn className='h-10 w-10'  />
									</button>
									<button onClick={() => mapRef.setZoom(mapRef.getZoom() - 1)} color='inherit' layout='outline' className='rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-300 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray'> 
										<ZoomOut className='h-10 w-10' />
									</button>
								</div>

								<hr className='mt-4 mb-3' />

								{/* Marker Controls */}
								<div className='flex flex-col text-gray-400 text-center'>
									<div className='font-bold'>Markers</div>
									<TippyTooltip
										html={<div className='p-2'>New Marker</div>}
										position="right"
										trigger='mouseenter'
										arrow
										theme='light'
										disabled={activeClickListener === ADD_MARKER_CLICK_LISTENER}
									>
										<button onClick={() => setActiveClickListener(ADD_MARKER_CLICK_LISTENER)} color='inherit' layout='outline' className='rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-300 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray'> 
											<AddMarker className='h-10 w-10' />
										</button>
									</TippyTooltip>
									<TippyTooltip
										html={
											<div className='p-2'>
												{showMarkers ? 'Hide Markers' : 'Show Markers'}
											</div>
										}
										position="right"
										trigger='mouseenter'
										arrow
										theme='light'
									>
										<button onClick={() => setShowMarkers(!showMarkers)} color='inherit' layout='outline' className={`${!showMarkers && 'bg-red-300'} rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-300 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray`}> 
											{ showMarkers 
													? <HideMarker className='h-10 w-10' />
													: <ShowMarker className='h-10 w-10' />
											}
										</button>
									</TippyTooltip>
								</div>
							</CardBody>
						</Card>
					</Control>

					<MapControlHandler />
				</MapContainer>
			</div>
			}
			
		</div>
	);
}

export default MapViewer;
