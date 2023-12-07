import { Button, Card, CardBody } from '@windmill/react-ui';
import React from 'react';
import { ReactFitty } from 'react-fitty';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { EllipsisIcon, PencilMiniIcon, TrashMiniIcon } from '../icons';
import moment from 'moment';
import { Tooltip } from 'react-tippy';

const MapCard = ({mapDetails, setConfirmDeleteMapModalOpen}) => {
	const history = useHistory();
	const handleMapNameClick = e => {
		history.push(`/app/map/${mapDetails.mapId}`);
		e.preventDefault();
		e.stopPropagation();
	}

	const optionsTooltipContent = (
		<div className='options-tooltip-content-container'>
			<div className="tooltip-option flex text-neutral-200">
				<PencilMiniIcon />
				<div className='ml-2'>Edit</div>
			</div>
			<div className="tooltip-option flex text-red-400" onClick={() => setConfirmDeleteMapModalOpen(mapDetails)}>
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
				<div className='flex flex-col h-full justify-between'>
					<div className="mb-2 font-semibold text-gray-600 dark:text-gray-300 map-card-name flex justify-between pl-4 pr-2 pb-2">
						<div className='pt-4 pr-2 underline' title={mapDetails.mapName}>
							<ReactFitty minSize={12} maxSize={32} wrapText={true} className='underline cursor-pointer' onClick={handleMapNameClick}>
								{mapDetails.mapName}
							</ReactFitty>
						</div>
						<div className="pt-2">
						<Tooltip
							html={optionsTooltipContent}
							position="bottom-start"
							trigger="click"
							interactive
							animation='perspective'
						>
							<Button icon={EllipsisIcon} layout='link' className='bg-transparent text-lg ellipsis-button' style={{padding: '4px', marginTop: '2px'}}></Button>
						</Tooltip>
						</div>
					</div>
					<div className='text-left text-sm p-4 map-card-info'>
						<p className="text-gray-600 dark:text-gray-400">
							<b>Created</b>: <span title={moment(mapDetails.createdTs).format()}>{moment(mapDetails.createdTs).format('YYYY-MM-DD')}</span><br />
							{mapDetails.modifiedTs && <>
								<b>Modified</b>: <span title={moment(mapDetails.modifiedTs).format()}>{moment(mapDetails.modifiedTs).fromNow()}</span>
							</>}
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

export default MapCard;