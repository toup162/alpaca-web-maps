import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, Card, CardBody } from '@windmill/react-ui';
import { Tooltip as TippyTooltip } from 'react-tippy';
import AddMarker from '../icons/base64/addmarker';
import HideMarker from '../icons/base64/hidemarker';
import ShowMarker from '../icons/base64/showmarker';
import AddLabel from '../icons/base64/addlabel';
import HideLabel from '../icons/base64/hidelabel';
import ShowLabel from '../icons/base64/showlabel';
import toast from 'react-hot-toast';
import C from '../utils/constants';
import { BookmarkIcon, FunnelIcon, PlusIcon, ZoomInIcon, ZoomOutIcon, SearchIcon } from '../icons';

const MapControls = ({
		mapRef,
		mapDetails,
		updateMap,
		activeClickListener,
		setActiveClickListener,
		showMarkers,
		setShowMarkers,
		setShowLabels,
		showLabels,
}) => {

	const [isSearchCardExpanded, setIsSearchCardExpanded] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [isBackdropOpen, setIsBackdropOpen] = useState(false);
	const mapSearchInputRef = useRef(null);

	useEffect(() => {
		mapSearchInputRef?.current?.focus();
	}, [isSearchCardExpanded])

	const handleSearchChange = event => {
		setSearchValue(event.target.value)		
	}

	const matchedSearchResults = !searchValue
		? []
		: mapDetails?.markers?.filter(m => m.label?.toLowerCase()?.includes(searchValue.toLowerCase()) );
	
	const closeAndClearSearchCard = () => {
		setSearchValue('');
		setIsSearchCardExpanded(false);
	}

	const onClickResult = markerId => {
		const destinationMarker = mapDetails.markers.find(m => m.id === markerId);
		mapRef.flyTo(destinationMarker.pos, mapRef.options.maxZoom, { duration: 1 });
		mapRef?.eachLayer((layer) => {
			const layerPopup = layer.getPopup();
			if (layerPopup?.options?.markerId === markerId) {
				layer.togglePopup()
			}
		});
		closeAndClearSearchCard();
	}

	console.log(activeClickListener);

	return (
		
			<div className=''>
				{isSearchCardExpanded && <Backdrop onClick={closeAndClearSearchCard} />}
				<div className='flex map-search-control-container'>
					<Card colored className="bg-gray-700 mb-3 search-togglecard mr-2">
						<CardBody>
							{/* Search */}
								<button
									onClick={() => setIsSearchCardExpanded(!isSearchCardExpanded)}
									color="inherit"
									layout="outline"
									className="flex-0 align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
								>
									<SearchIcon className="h-8 w-8 text-white" />
								</button>
						</CardBody>
					</Card>
					{isSearchCardExpanded &&
						<div className='map-search-control z-1000'>
							<Card colored className="bg-gray-700 flex-1">
								<CardBody className='map-search-control-card'>
									{/* Search */}
									<div className='w-full flex-1'>
										<input
											id='map-search-label'
											className="block w-full text-sm focus:outline-none dark:text-gray-300 form-input leading-5 focus:border-purple-400 dark:border-gray-600 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 placeholder-gray-500"
											placeholder="Search ..."
											onChange={handleSearchChange}
											value={searchValue}
											ref={mapSearchInputRef}
											autocomplete="off"
										/>
									</div>
									<div className='map-search-results-container'>
										{searchValue && 
											<div className='p-2'>
												{!matchedSearchResults || matchedSearchResults.length === 0
													? '0 results found.'
													: matchedSearchResults.length > 8
														? (<span>Displaying <b>8</b> results out of (<b>{matchedSearchResults.length}</b>) total.</span>)
														: `${matchedSearchResults.length} result${matchedSearchResults.length === 1 ? '' : 's'} found.`
												}
											</div>
										}
										{searchValue && matchedSearchResults?.slice(0, 8).map(marker => (
											<div
												className='p-2 flex items-center cursor-pointer text-gray-200'
												key={marker.id}
												onClick={() => onClickResult(marker.id)}
											>
												<div>
													<img
														src={marker.icon?.options?.iconUrl}
														alt='marker'
														className='mr-2 h-6'
													/>
												</div>
												<div>{marker.label}</div>
											</div>
										))}
									</div>
								</CardBody>
							</Card>
						</div>
					}
				</div>
				
				<Card colored className="bg-gray-700 inline-flex">
					<CardBody>
						{/* Zoom Controls */}
						<div className="flex flex-col text-gray-400 text-center">
							<TippyTooltip
								position="right"
								trigger="mouseenter"
								arrow
								theme="light"
								disabled={true}
								html={
									<div className="p-2 text-xs text-black">
											Zoom In
									</div>
								}
							>
								<button
									onClick={() => mapRef.setZoom(mapRef.getZoom() + 1)}
									color="inherit"
									layout="outline"
									className="rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
								>
									<ZoomInIcon className="h-8 w-8 hue-rotate-280 text-white" />
								</button>
							</TippyTooltip>
							<TippyTooltip
								position="right"
								trigger="mouseenter"
								className='inline-flex'
								arrow
								theme="light"
								disabled={true}
								html={
									<div className="p-2 text-xs text-black">
											Zoom Out
									</div>
								}
							>
								<button
									onClick={() => mapRef.setZoom(mapRef.getZoom() - 1)}
									color="inherit"
									layout="outline"
									className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
								>
									<ZoomOutIcon className="h-8 w-8 hue-rotate-280 text-white" />
								</button>
							</TippyTooltip>


							<TippyTooltip
								position="right"
								trigger="mouseenter"
								arrow
								theme="light"
								html={
									<div className="p-2 text-xs text-black">
											Set current Pan/Zoom as default view
									</div>
								}
							>
								<button
									color="inherit"
									layout="outline"
									className="rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
									onClick={() => {
										updateMap({
												...mapDetails,
												center: mapRef.getBounds().getCenter(),
												centerXCoord: mapRef
														.getBounds()
														.getCenter()?.lat,
												centerYCoord: mapRef
														.getBounds()
														.getCenter()?.lng,
												initialZoom: mapRef.getZoom(),
										});
										toast.success(
												"Saved current view as default!",
												{ duration: 3000 }
										);
									}}
								>
									<BookmarkIcon className="h-8 w-8 text-white" />
								</button>
							</TippyTooltip>
						</div>

						<hr className="my-4 border-gray-600" />

						{/* Marker Controls */}
						<div className="flex flex-col text-gray-400 text-center">
							<TippyTooltip
								position="right"
								trigger="click"
								arrow
								interactive={true}
								theme="light"
								html={
									<div className='bg-gray-700 p-2 flex rounded'>
										<button
												color="inherit"
												layout="outline"
												className="rounded-r-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
												onClick={() =>
													setActiveClickListener(
															C.ADD_MARKER_CLICK_LISTENER
													)
											}
										>
											<AddMarker className="h-8 w-8" />
										</button>
										<button
											color="inherit"
											layout="outline"
											className="rounded-l-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
											onClick={() =>
												setActiveClickListener(
													C.ADD_LABEL_CLICK_LISTENER
												)
											}
										>
												<AddLabel className="h-8 w-8" />
										</button>
									</div>
								}
								disabled={
										activeClickListener ===
										C.ADD_MARKER_CLICK_LISTENER || activeClickListener === C.ADD_LABEL_CLICK_LISTENER
								}
							>
								<button
										color="inherit"
										layout="outline"
										className="rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"

								>
									<PlusIcon className="h-8 w-8 text-white" />
								</button>
							</TippyTooltip>
							<div className="flex flex-col text-gray-400 text-center">
								<TippyTooltip
									key='funnel-selection'
									position="right"
									trigger="click"
									arrow
									interactive={true}
									theme="light"
									html={
										<div className='bg-gray-700 p-2 flex rounded'>
											<button
												onClick={(e) => {setShowMarkers(!showMarkers); e.stopPropagation();}}
												color="inherit"
												layout="outline"
												className={`${
													!showMarkers && "bg-red-300 "
												} rounded-r-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray`}
											>
												{showMarkers ? (
													<HideMarker className="h-8 w-8" />
												) : (
													<ShowMarker className="h-8 w-8" />
												)}
											</button>
											<button
												onClick={(e) => {setShowLabels(!showLabels); e.stopPropagation();}}
												color="inherit"
												layout="outline"
												className={`${
													!showLabels && "bg-red-300 "
												} rounded-l-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray`}
											>
												{showLabels ? (
													<HideLabel className="h-8 w-8" />
												) : (
													<ShowLabel className="h-8 w-8" />
												)}
											</button>
										</div>
									}
									disabled={
											activeClickListener ===
											C.ADD_MARKER_CLICK_LISTENER || activeClickListener === C.ADD_LABEL_CLICK_LISTENER
									}
								>
									<button
											color="inherit"
											layout="outline"
											className={
												`${ (!showLabels || !showMarkers) ? "bg-red-300 " : ''}rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray`
											}

									>
										<FunnelIcon className="h-8 w-8 text-white" />
									</button>
								</TippyTooltip>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
	);
};

export default MapControls;