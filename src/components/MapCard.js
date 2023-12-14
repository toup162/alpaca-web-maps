import { Button, Card, CardBody } from '@windmill/react-ui';
import React, { useState } from 'react';
import { ReactFitty } from 'react-fitty';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { EllipsisIcon, CogIcon, TrashMiniIcon, DownloadIcon } from '../icons';
import moment from 'moment';
import { Tooltip } from 'react-tippy';

const MapCard = ({mapDetails, setConfirmDeleteMapModalOpen}) => {
	const history = useHistory();
	const [optionsTooltipIsOpen, setOptionsTooltipIsOpen] = useState(false);

	const handleMapNameClick = e => {
		history.push(`/app/map/${mapDetails.mapId}`);
		e.preventDefault();
		e.stopPropagation();
	}

	const handleEditMapClick = e => {
		history.push(`/app/edit-map/${mapDetails.mapId}`);
		e.preventDefault();
		e.stopPropagation();
	}

	const handleDeleteMapClick = () => {
		setConfirmDeleteMapModalOpen(mapDetails);
		setOptionsTooltipIsOpen(false);
	}

	const exportAndDownloadMapJson = () => {
		if (mapDetails) {
			const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapDetails));
			let downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", `${mapDetails.mapName ? mapDetails.mapName.toLowerCase().replace(' ', '_') : 'unnamed_map'}.json`);
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	}

	const optionsTooltipContent = (
		<div className='options-tooltip-content-container'>
			<div className="tooltip-option flex text-neutral-200" onClick={handleEditMapClick}>
				<CogIcon />
				<div className='ml-2'>Edit Metadata</div>
			</div>
			<div className="tooltip-option flex text-neutral-200" onClick={exportAndDownloadMapJson}>
				<DownloadIcon className='h-5 w-5' />
				<div className='ml-2'>Export Map</div>
			</div>
			<div className="tooltip-option flex text-red-400" onClick={handleDeleteMapClick}>
				<TrashMiniIcon />
				<div className='ml-2'>Delete</div>
			</div>
		</div>
	);

	return (
		<Card className='map-card populated mr-6 mb-6' key={mapDetails.mapId} style={{
			backgroundImage: `url(${mapDetails.tileRootDirectoryUrl}/1/0/0.png)`
		}}>
			<CardBody className='h-full'>
				<div className='flex flex-col h-full'>
					<div className="mb-2 font-semibold text-gray-600 dark:text-gray-300 map-card-name flex justify-between pl-4 pr-2 pb-2">
						<div className='pt-4 pr-2 underline' title={mapDetails.mapName}>
							<ReactFitty minSize={12} maxSize={32} wrapText={true} className='underline cursor-pointer' onClick={handleMapNameClick}>
								{mapDetails.mapName}
							</ReactFitty>
						</div>
						<div className="pt-2">
						<Tooltip
							html={optionsTooltipContent}
							position="bottom-end"
							trigger="click"
							interactive
							animation='perspective'
							open={optionsTooltipIsOpen}
							onRequestClose={() => setOptionsTooltipIsOpen(false)}
						>
							<Button
								icon={EllipsisIcon}
								layout='link'
								className='bg-transparent text-lg ellipsis-button'
								style={{padding: '4px', marginTop: '2px'}}
								onClick={() => setOptionsTooltipIsOpen(true)}
							></Button>
						</Tooltip>
						</div>
					</div>
					<div onClick={handleMapNameClick} className='h-full flex flex-col justify-end cursor-pointer'>
						<div className='text-left text-sm p-4 map-card-info'>
							<p className="text-gray-600 dark:text-gray-400">
								<b>Created</b>: <span title={moment(mapDetails.createdTs).format()}>{moment(mapDetails.createdTs).format('YYYY-MM-DD')}</span><br />
								{mapDetails.modifiedTs && <>
									<b>Modified</b>: <span title={moment(mapDetails.modifiedTs).format()}>{moment(mapDetails.modifiedTs).fromNow()}</span>
								</>}
							</p>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

export default MapCard;