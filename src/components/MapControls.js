import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@windmill/react-ui';
import Control from 'react-leaflet-custom-control'
import { Tooltip as TippyTooltip } from 'react-tippy';
import AddMarker from '../icons/base64/addmarker';
import HideMarker from '../icons/base64/hidemarker';
import ZoomIn from '../icons/base64/zoomin';
import ZoomOut from '../icons/base64/zoomout';
import ShowMarker from '../icons/base64/showmarker';
import MapFavorite from '../icons/base64/mapfavorite';
import AddLabel from '../icons/base64/addlabel';
import HideLabel from '../icons/base64/hidelabel';
import ShowLabel from '../icons/base64/showlabel';
import SearchIcon from '../icons/base64/search';
import toast from 'react-hot-toast';
import C from '../utils/constants';
import Select from 'react-select'

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

	const searchOptions = mapDetails?.markers?.map(marker => {
		return {
			label: marker.label,
			value: marker.id,
		};
	})

	useEffect(() => {
		if (isSearchCardExpanded) {
			const inputElement = document.getElementsByClassName('icon-select__input')[0];
			inputElement.focus();
		}

	}, [isSearchCardExpanded]);

	const handleSeachOptionSelect = (inputValue, event) => {
		console.log(inputValue);

		setIsSearchCardExpanded(false);
	}

	return (
		<Control prepend position="topleft">
			<div className=''>
				<div className='flex map-search-control-container'>
					<Card colored className="bg-gray-700 mb-3 search-togle-card mr-2">
						<CardBody>
							{/* Search */}
								<button
									onClick={() => setIsSearchCardExpanded(!isSearchCardExpanded)}
									color="inherit"
									layout="outline"
									className="flex-0 align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
								>
									<SearchIcon className="h-8 w-8" />
								</button>
						</CardBody>
					</Card>
					{isSearchCardExpanded && 
						<div className='map-search-control'>
							<Card colored className="bg-gray-700 flex-1">
								<CardBody className='map-search-control-card'>
									{/* Search */}
									<div className='w-full flex-1' onClick={e => e.preventDefault()}>
										<Select
											options={searchOptions}
											isSearchable={true}
											className="icon-select-container"
											onChange={(o, e) => handleSeachOptionSelect(o, e)}
											classNamePrefix="icon-select"
											placeholder='Search ...'
											menuIsOpen={true}
											components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
											/*menuIsOpen={true}*/
										/>
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
									<ZoomIn className="h-8 w-8 hue-rotate-280" />
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
									<ZoomOut className="h-8 w-8 hue-rotate-280" />
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
									<MapFavorite className="h-8 w-8" />
								</button>
							</TippyTooltip>
						</div>

						<hr className="my-4 border-gray-600" />

						{/* Marker Controls */}
						<div className="flex flex-col text-gray-400 text-center">
							<TippyTooltip
								position="right"
								trigger="mouseenter"
								arrow
								theme="light"
								html={
									<div className="p-2 text-xs text-black">
											New Marker
									</div>
								}
								disabled={
										activeClickListener ===
										C.ADD_MARKER_CLICK_LISTENER
								}
							>
								<button
										color="inherit"
										layout="outline"
										className="rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
										onClick={() =>
											setActiveClickListener(
													C.ADD_MARKER_CLICK_LISTENER
											)
									}
								>
									<AddMarker className="h-8 w-8" />
								</button>
							</TippyTooltip>
							<div className="flex flex-col text-gray-400 text-center">
								<TippyTooltip
									position="right"
									trigger="mouseenter"
									arrow
									theme="light"
									disabled={ activeClickListener === C.ADD_LABEL_CLICK_LISTENER }
									html={
										<div className="p-2 text-xs text-black">
												New Label
										</div>
									}
								>
									<button
										color="inherit"
										layout="outline"
										className="rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray"
										onClick={() =>
											setActiveClickListener(
												C.ADD_LABEL_CLICK_LISTENER
											)
										}
									>
											<AddLabel className="h-8 w-8" />
									</button>
								</TippyTooltip>
						</div>
						</div>

						<hr className="my-4 border-gray-600" />

						{/* Label Controls */}
						<div className="flex flex-col text-gray-400 text-center">
							<TippyTooltip
								position="right"
								trigger="mouseenter"
								arrow
								theme="light"
								html={
									<div className="p-2 text-xs text-black">
										{showMarkers
											? "Hide Markers"
											: "Show Markers"}
									</div>
								}
							>
								<button
									onClick={() => setShowMarkers(!showMarkers)}
									color="inherit"
									layout="outline"
									className={`${
										!showMarkers && "bg-red-300 "
									} rounded-b-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray`}
								>
									{showMarkers ? (
										<HideMarker className="h-8 w-8" />
									) : (
										<ShowMarker className="h-8 w-8" />
									)}
								</button>
							</TippyTooltip>
						</div>
						<div className="flex flex-col text-gray-400 text-center">
							<TippyTooltip
								position="right"
								trigger="mouseenter"
								arrow
								theme="light"
								html={
									<div className="p-2 text-xs text-black">
										{showLabels ? "Hide Labels" : "Show Labels"}
									</div>
								}
							>
								<button
									onClick={() => setShowLabels(!showLabels)}
									color="inherit"
									layout="outline"
									className={`${
										!showLabels && "bg-red-300 "
									} rounded-t-none align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-lg text-sm text-gray-600 border-gray-600 border focus:outline-none active:bg-gray-300 hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray`}
								>
									{showLabels ? (
										<HideLabel className="h-8 w-8" />
									) : (
										<ShowLabel className="h-8 w-8" />
									)}
								</button>
							</TippyTooltip>
						</div>
					</CardBody>
				</Card>
			</div>
		</Control>
	);
};

export default MapControls;