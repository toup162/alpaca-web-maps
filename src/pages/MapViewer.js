import React, { useContext, useEffect, useState } from 'react'

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent } from 'react-leaflet'
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom';
import { UserLocalContext } from '../context/UserLocalContext';
import L, { Icon } from 'leaflet';
import CreateEditMarkerModal from '../components/Modals/CreateEditMarkerModal/CreateEditMarkerModal';
import MouseTracker from '../components/MouseTracker';
import MarkerPopupControls from '../components/MarkerPopupControls';
import toast from 'react-hot-toast';
import { LinkIcon } from '../icons';
import CreateEditLabelModal from '../components/Modals/CreateEdiLabelModal/CreateEditLabelModal';
import GlobeWithMarker from '../icons/base64/globewithmarker';
import MapControls from '../components/MapControls';
import C from '../utils/constants';
import Control from 'react-leaflet-custom-control';

const MapViewer = () => {
	const { mapId, markerId: markerIdFromUrl } = useParams();
	const history = useHistory();
	const { userLocal, setMarkersByMapId, updateMap } = useContext(UserLocalContext);
	const mapDetails = userLocal?.maps?.find(m => m.mapId === mapId);
	const markers = mapDetails?.markers || [];
	const [mapRef, setMapRef] = useState(null);
	const [activeClickListener, setActiveClickListener] = useState(null);
	const [creatingEditingMarker, setCreatingEditingMarker] = useState(null);
	const [creatingEditingLabel, setCreatingEditingLabel] = useState(null);
	const [isRepositioningMarker, setIsRepositioningMarker] = useState(null);
	const [confirmDeleteMarkerTooltipIsOpen, setConfirmDeleteMarkerTooltipIsOpen] = useState(false);
	const [showMarkers, setShowMarkers] = useState(true);
	const [showLabels, setShowLabels] = useState(true);
	const [forceInitialMarkerPopup, setForceInitialMarkerPopup] = useState(true);

	const MapControlHandler = () => {

		useMapEvent('click', e => {
			if (activeClickListener === C.ADD_MARKER_CLICK_LISTENER) {
				/* Create a temporary marker that can be seen on the map while we create the real marker in the modal*/
				const placeholderMarker = {
					pos: e.latlng,
					id: 'TEMP_ID',
					type: 'marker',
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

			} else if (activeClickListener === C.ADD_LABEL_CLICK_LISTENER) {
				
				const placeholderLabel = {
					pos: e.latlng,
					id: 'TEMP_ID',
					type: 'label',
					popup: 'true',
					icon: new L.divIcon({
						className: '',
						iconAnchor: [16, 13],
						labelAnchor: [0, 0],
						popupAnchor: [0,-12],
						iconSize: [50, 28],
						html: `<div class="leaflet-tooltip map-label">
							<span class="map-label-content bg-white text-black whitespace-nowrap">...</span>
						</div>`
					})
				};

				setMarkersByMapId(mapId, [...markers, placeholderLabel])
				setCreatingEditingLabel(placeholderLabel);
				setActiveClickListener(null);

			} else if (activeClickListener === C.REPOSITION_MARKER_CLICK_LISTENER) {
				setMarkersByMapId(mapId, [
					...markers,
					{
						...isRepositioningMarker,
						pos: e.latlng
					}
				]);
				setActiveClickListener(null);
				setIsRepositioningMarker(null);
				
			}}
		)
console.log('mapControlHandler');
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
		if (!newMarker.type || newMarker.type === 'marker' ) {
			setCreatingEditingMarker(null);
			/* Just in case 'Hide Markers' is active, set it to show markers */
			!showMarkers && setShowMarkers(true);
			toast.success(
				idToDelete === 'TEMP_ID' ? 'Marker created!' : 'Marker updated!',
				{ duration: 2500 }
			);
		} else {
			setCreatingEditingLabel(null);
			!showLabels && setShowLabels(true);
			toast.success(
				idToDelete === 'TEMP_ID' ? 'Label created!' : 'Label updated!',
				{ duration: 2500 }
			);
		}		
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
		(!marker || marker.type === 'marker') ? setCreatingEditingMarker(marker) : setCreatingEditingLabel(marker);
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

	const onClickCopyMarkerUrl = ({id, type}) => {
		navigator.clipboard.writeText(`${window.location.origin}/app/map/${mapId}/${id}`);
		toast.success(`${type === 'label' ? 'Label' : 'Marker'} URL copied to clipboard!`, {
			duration: 4000
		});
	}

	const onClickVisitConnection = url => {
		try {
			const urlObject = new URL(url);
			if (urlObject?.pathname) {
				/* If it is a link to another map, navigate the browser there */
				if (!urlObject.pathname.includes(mapDetails.mapId)) {
					history.push(urlObject.pathname);
				} else {
					const destinationMarker = markers.find(m => m.id === urlObject.pathname.split('/').pop());
					mapRef.flyTo(destinationMarker.pos, mapRef.options.maxZoom);
				}
			}
				
		} catch (error) {
			toast.error('Invalid URL', {
				duration: 4000
			})
		}
	}

	const mouseTrackerVisible = activeClickListener === C.REPOSITION_MARKER_CLICK_LISTENER
		|| activeClickListener === C.ADD_MARKER_CLICK_LISTENER
		|| activeClickListener === C.ADD_LABEL_CLICK_LISTENER;
	
	return (
		<div>
			{mouseTrackerVisible && 
				<MouseTracker offset={{ x: 10, y: -40 }}>
					Click the map to place the {isRepositioningMarker?.type ? isRepositioningMarker.type : 'marker' }.
				</MouseTracker>
			}
			
			{creatingEditingMarker &&
				<CreateEditMarkerModal
					creatingEditingMarker={creatingEditingMarker}
					setCreatingEditingMarker={setCreatingEditingMarker}
					deleteMarker={deleteMarker}
					onConfirmCreateEditMarker={onConfirmCreateEditMarker}
				/>
			}

			{creatingEditingLabel &&
				<CreateEditLabelModal
					creatingEditingLabel={creatingEditingLabel}
					setCreatingEditingLabel={setCreatingEditingLabel}
					deleteLabel={deleteMarker}
					onConfirmCreateEditLabel={onConfirmCreateEditMarker}
				/>
			}
			{mapDetails &&
			<div className={isRepositioningMarker || activeClickListener === C.ADD_MARKER_CLICK_LISTENER || activeClickListener === C.ADD_LABEL_CLICK_LISTENER ? 'positioning-marker' : ''}>
				<MapContainer
					center={[Number(mapDetails.centerXCoord), Number(mapDetails.centerYCoord)]}
					zoom={Number(mapDetails.initialZoom)}
					maxZoom={Number(mapDetails.maxZoom)}
					minZoom={Number(mapDetails.minZoom)}
					zoomControl={false}
					className='fullscreen-map'
					whenReady={onMapContainerReady}
					key={mapId}
				>
					<TileLayer
						attribution='test'
						url={`${mapDetails.tileRootDirectoryUrl}${mapDetails.tileDirectorySchema}`}
						noWrap={true}
					/>
					
					{markers.map(marker => {
						if ((!showMarkers && marker.type === 'marker') || (!showLabels && marker.type === 'label')  ) {
							return null;
						}
						return (
							isRepositioningMarker !== marker.id &&
							<Marker
								key={marker.id}
								position={marker.pos}
								{...(marker.icon && { icon: marker.icon } )}
							>
								{marker.tooltip && activeClickListener !== C.REPOSITION_MARKER_CLICK_LISTENER &&
									<Tooltip>
										{marker.tooltip}
									</Tooltip>
								}

								{marker.popup && !isRepositioningMarker &&
									<Popup markerId={marker.id} maxWidth={360} closeButton={false}>
										<div>
											<div className='marker-popup-content-container text-left pb-2'>
												<div className='w-full flex justify-between items-center'>
													<div className='text-lg font-bold mr-3'>{marker.label}</div>
													
												</div>
												<div className='max-h-24 overflow-y-auto mt-2 mb-5'>
													{marker.description}
												</div>
												<div className='flex justify-end items-center'>
													{ marker.mapLinkUrl &&
														<div className='mr-2'>
															<button
																className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-3 py-1 rounded-md text-sm text-gray-800 border focus:outline-none active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray active:bg-gray-300"
																type="button"
																onClick={() => onClickVisitConnection(marker.mapLinkUrl)}
															>
																<div className="flex items-center whitespace-nowrap">
																	<GlobeWithMarker className='h-5 w-5 mr-1' />
																	<span className='text-xs whitespace-nowrap pr-4'>Visit Connection</span>
																</div>
															</button>
														</div>
													}
													<div>
														<button
															className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-3 py-1 rounded-md text-sm text-gray-800 border focus:outline-none active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray active:bg-gray-300"
															type="button"
															onClick={() => onClickCopyMarkerUrl(marker)}
														>
															<div className="flex items-center whitespace-nowrap">
																<LinkIcon className='h-3 w-3 mr-1' />
																<span className='text-xs whitespace-nowrap'>Copy URL</span>
															</div>
														</button>
													</div>
														
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
					<Control prepend position="topleft">
						<MapControls
							mapRef={mapRef}
							mapDetails={mapDetails}
							updateMap={updateMap}
							activeClickListener={activeClickListener}
							setActiveClickListener={setActiveClickListener}
							showMarkers={showMarkers}
							setShowMarkers={setShowMarkers}
							setShowLabels={setShowLabels}
							showLabels={showLabels}
						/>
						<MapControlHandler />
					</Control>
				</MapContainer>
			</div>
			}
			
		</div>
	);
}

export default MapViewer;
