import React, { useContext, useState } from 'react'

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent } from 'react-leaflet'
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { UserLocalContext } from '../context/UserLocalContext';
import { Icon } from 'leaflet';
import CreateMarkerModal from '../components/Modals/CreateMarkerModal/CreateMarkerModal';
import { Button } from '@windmill/react-ui';
import { ArrowsPointingOutMiniIcon, TrashMiniIcon } from '../icons';
import _ from 'lodash';
import MouseTracker from '../components/MouseTracker';
import { Tooltip as TippyTooltip } from 'react-tippy';

const ADD_MARKER_CLICK_LISTENER = 'ADD_MARKER_CLICK_LISTENER';
const REPOSITION_MARKER_CLICK_LISTENER = 'REPOSITION_MARKER_CLICK_LISTENER';

const MAP_ID_PLACEHOLDER = 'TEMP_ID';

const MapViewer = () => {
	const { mapId } = useParams();
	const { userLocal } = useContext(UserLocalContext);
	const mapDetails = userLocal?.maps?.find(m => m.mapId === mapId);

	const [markers, setMarkers] = useState([]);
	const [activeClickListener, setActiveClickListener] = useState(ADD_MARKER_CLICK_LISTENER);
	const [creatingMarker, setCreatingMarker] = useState(null);
	const [isRepositioningMarker, setIsRepositioningMarker] = useState(null);
	const [confirmDeleteMarkerTooltipIsOpen, setConfirmDeleteMarkerTooltipIsOpen] = useState(false);

	const MapControlHandler = () => {
		
		/*const map = useMapEvent('click', () => {
			map.setView([50.5, 30.5], map.getZoom())
		})*/
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
		return null
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
	}

	return (
		<div>
			{activeClickListener === REPOSITION_MARKER_CLICK_LISTENER && 
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
					className='fullscreen-map'
				>
					<TileLayer
						attribution='test'
						url={`${mapDetails.tileRootDirectoryUrl}${mapDetails.tileDirectorySchema}`}
						noWrap={true}
					/>
						{markers.map(marker => {
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
													Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum.
													Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum.
													Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum.
													Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum.
													Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum.
												</div>
												<div className='flex justify-end mt-4'>
													<Button
														size='small'
														layout='outline'
														className='marker-popup-button'
														onClick={() => {
															setIsRepositioningMarker(_.cloneDeep(marker));
															deleteMarker(marker.id);
															setTimeout(() => setActiveClickListener(REPOSITION_MARKER_CLICK_LISTENER), 100);
														}}
													>
														<div className='transform rotate-45 mr-2'>
															<ArrowsPointingOutMiniIcon />
														</div>
														Move
													</Button>
													<TippyTooltip
														html={
														<div className='p-2'>
															<div>
															Really Delete?
															</div>
															<Button size='small' layout='outline' className='mr-2 border-red-600 bg-red-600' onClick={() => deleteMarker(marker.id)}>
																<div className='text-white flex'>
																	<span className='mr-2'>
																		<TrashMiniIcon />
																	</span>
																	Delete
																</div>
															</Button>
															<Button size='small' layout='outline' onClick={() => setConfirmDeleteMarkerTooltipIsOpen(false)}>
																<span className='text-gray-700'>Cancel</span>
															</Button>
														</div>}
														position="right-end"
														arrow
														trigger="click"
														interactive
														animation='perspective'
														open={confirmDeleteMarkerTooltipIsOpen}
														onRequestClose={() => setConfirmDeleteMarkerTooltipIsOpen(false)}
														theme='light'
													>
														<Button
															size='small'
															layout='outline'
															className='marker-popup-button ml-2'
															onClick={() => setConfirmDeleteMarkerTooltipIsOpen(true)}
														>
															<div className='mr-2'>
																<TrashMiniIcon />
															</div>
															Delete
														</Button>
													</TippyTooltip>
												</div>
											</div>
										</Popup>
									}
								</Marker>
							)
						})}
					<MapControlHandler />
				</MapContainer>
			</div>
			}
			
		</div>
	);
}

export default MapViewer;
