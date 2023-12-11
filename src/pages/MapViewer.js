import React, { useContext, useEffect, useState } from 'react'

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent } from 'react-leaflet'
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom';
import { UserLocalContext } from '../context/UserLocalContext';
import { Icon } from 'leaflet';
import CreateEditMarkerModal from '../components/Modals/CreateEditMarkerModal/CreateEditMarkerModal';
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
import MapFavorite from '../icons/base64/mapfavorite';
import toast from 'react-hot-toast';
import { LinkIcon } from '../icons';

const ADD_MARKER_CLICK_LISTENER = 'ADD_MARKER_CLICK_LISTENER';
const REPOSITION_MARKER_CLICK_LISTENER = 'REPOSITION_MARKER_CLICK_LISTENER';
const MAP_ID_PLACEHOLDER = 'TEMP_ID';

const MapViewer = () => {
	const { mapId, markerId: markerIdFromUrl } = useParams();
	const history = useHistory();
	const { userLocal, setMarkersByMapId, updateMap } = useContext(UserLocalContext);
	const mapDetails = userLocal?.maps?.find(m => m.mapId === mapId);
	const markers = mapDetails?.markers || [];
	const [mapRef, setMapRef] = useState(null);
	const [activeClickListener, setActiveClickListener] = useState(null);
	const [creatingEditingMarker, setCreatingEditingMarker] = useState(null);
	const [isRepositioningMarker, setIsRepositioningMarker] = useState(null);
	const [confirmDeleteMarkerTooltipIsOpen, setConfirmDeleteMarkerTooltipIsOpen] = useState(false);
	const [showMarkers, setShowMarkers] = useState(true);
	const [forceInitialMarkerPopup, setForceInitialMarkerPopup] = useState(true);

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

				setMarkersByMapId(mapId, [...markers, placeholderMarker])

				/* Open a modal to customize the marker being created */
				setCreatingEditingMarker(placeholderMarker);
				setActiveClickListener(null);

			} else if (activeClickListener === REPOSITION_MARKER_CLICK_LISTENER) {
				setMarkersByMapId(mapId, [
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
		setMarkersByMapId(mapId, [
			...markers.filter(marker => marker.id !== id)
		]);
		/* If the marker we're deleting is the one in the browser's URL path, remove from the path */
		markerIdFromUrl && history.replace({ pathname: `/app/map/${mapId}` })
	}

	const onConfirmCreateEditMarker = ({newMarker, idToDelete}) => {
		/* Delete the placeholder marker, add the new marker */
		setMarkersByMapId(mapId, [
			...markers.filter(marker => marker.id !== idToDelete),
			newMarker
		]);
		/* Close the modal */
		setCreatingEditingMarker(null);

		/* Just in case 'Hide Markers' is active, set it to show markers */
		!showMarkers && setShowMarkers(true);

		toast.success(
			idToDelete === 'TEMP_ID' ? 'Marker created!' : 'Marker updated!',
			{ duration: 2500 }
		);
		
	}

	/* If the marker ID from the URL is a real marker */
	const onMapContainerReady = ({ target }) => {
		setMapRef(target);
		
		const markerFromUrl = markers.find(marker => marker.id === markerIdFromUrl);
		/* Pan/Zoom to marker gathered from URL */
		if (target && markerFromUrl) {
			target && target.setView(markerFromUrl.pos, mapDetails.maxZoom, {animate: false, duration: 0});
		}
	};

	const onClickEditMarker = marker => {
		setCreatingEditingMarker(marker);
	}
	
	useEffect(() => {
		forceInitialMarkerPopup && mapRef?.eachLayer((layer) => {
			const layerPopup = layer.getPopup();
			if (layerPopup?.options?.markerId === markerIdFromUrl) {
				layer.togglePopup()
				setForceInitialMarkerPopup(false);
			}
		});
		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mapRef])

	const onClickCopyMarkerUrl = markerIdToCopy => {
		navigator.clipboard.writeText(`${window.location.origin}/app/map/${mapId}/${markerIdToCopy}`);
		toast.success('Marker URL copied to clipboard!', {
			duration: 4000
		});
	}
	
	return (
		<div>
			{(activeClickListener === REPOSITION_MARKER_CLICK_LISTENER || activeClickListener === ADD_MARKER_CLICK_LISTENER)  && 
				<MouseTracker offset={{ x: 10, y: -40 }}>Click the map to place the marker.</MouseTracker>
			}
			
			<CreateEditMarkerModal
				creatingEditingMarker={creatingEditingMarker}
				setCreatingEditingMarker={setCreatingEditingMarker}
				deleteMarker={deleteMarker}
				onConfirmCreateEditMarker={onConfirmCreateEditMarker}
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
					whenReady={onMapContainerReady}
				>
					<TileLayer
						attribution='test'
						url={`${mapDetails.tileRootDirectoryUrl}${mapDetails.tileDirectorySchema}`}
						noWrap={true}
					/>
					
					{showMarkers && markers.map(marker => {
						return (
							isRepositioningMarker !== marker.id &&
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
									<Popup markerId={marker.id} maxWidth={360} closeButton={false}>
										<div>
											<div className='marker-popup-content-container text-left pb-2'>
												<div className='w-full flex justify-between items-center'>
													<div className='text-lg font-bold mr-3'>{marker.label}</div>
													<div>
														<button
															className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-3 py-1 rounded-md text-sm text-gray-800 border focus:outline-none active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray active:bg-gray-300"
															type="button"
															onClick={() => onClickCopyMarkerUrl(marker.id)}
														>
															<div className="flex items-center whitespace-nowrap">
																<LinkIcon className='h-3 w-3 mr-1' />
																<span className='text-xs whitespace-nowrap'>Copy URL</span>
															</div>
														</button>
													</div>
												</div>
												<div className='max-h-24 overflow-y-auto mt-4'>
													{marker.description}
												</div>
											</div>
											<div className='marker-popup-editor-controls-container'>
												<div className='text-xs text-black flex-0'>Editor Controls</div>
												<MarkerPopupControls
													marker={marker}
													setIsRepositioningMarker={setIsRepositioningMarker}
													deleteMarker={deleteMarker}
													setActiveClickListener={setActiveClickListener}
													confirmDeleteMarkerTooltipIsOpen={confirmDeleteMarkerTooltipIsOpen}
													setConfirmDeleteMarkerTooltipIsOpen={setConfirmDeleteMarkerTooltipIsOpen}
													onClickEditMarker={() => onClickEditMarker(marker)}
												/>
											</div>
										</div>
									</Popup>
								}
							</Marker>
						)
					})}
					<Control prepend position='topleft' >
						<Card colored className='bg-gray-700'>
							<CardBody>
								{/* Zoom Controls */}
								<div className='flex flex-col text-gray-400 text-center'>
									<button onClick={() => mapRef.setZoom(mapRef.getZoom() + 1)} color='inherit' layout='outline' className='rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray'> 
										<ZoomIn className='h-8 w-8'  />
									</button>
									<button onClick={() => mapRef.setZoom(mapRef.getZoom() - 1)} color='inherit' layout='outline' className='align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray'> 
										<ZoomOut className='h-8 w-8' />
									</button>
									<TippyTooltip
										html={<div className='p-2 text-xs text-black'>Set current Pan/Zoom as default view</div>}
										position="right"
										trigger='mouseenter'
										arrow
										theme='light'
									>
										<button
											color='inherit'
											layout='outline'
											className='rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray' 
											onClick={() => {
												updateMap({
													...mapDetails,
													center: mapRef.getBounds().getCenter(),
													centerXCoord: mapRef.getBounds().getCenter()?.lat,
													centerYCoord: mapRef.getBounds().getCenter()?.lng,
													initialZoom: mapRef.getZoom()
												});
												toast.success('Saved current view as default!', {duration: 3000});
											}}
										>
											<MapFavorite className='h-8 w-8' />
										</button>
									</TippyTooltip>
								</div>

								<hr className='my-4 border-gray-600' />

								{/* Marker Controls */}
								<div className='flex flex-col text-gray-400 text-center'>
									<TippyTooltip
										html={<div className='p-2 text-xs text-black'>New Marker</div>}
										position="right"
										trigger='mouseenter'
										arrow
										theme='light'
										disabled={activeClickListener === ADD_MARKER_CLICK_LISTENER}
									>
										<button onClick={() => setActiveClickListener(ADD_MARKER_CLICK_LISTENER)} color='inherit' layout='outline' className='rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray'> 
											<AddMarker className='h-8 w-8' />
										</button>
									</TippyTooltip>
									<TippyTooltip
										html={
											<div className='p-2 text-xs text-black'>
												{showMarkers ? 'Hide Markers' : 'Show Markers'}
											</div>
										}
										position="right"
										trigger='mouseenter'
										arrow
										theme='light'
									>
										<button onClick={() => setShowMarkers(!showMarkers)} color='inherit' layout='outline' className={`${!showMarkers && 'bg-red-300 '} rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray`}> 
											{ showMarkers 
													? <HideMarker className='h-8 w-8' />
													: <ShowMarker className='h-8 w-8' />
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
