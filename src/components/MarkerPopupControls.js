import { Button } from '@windmill/react-ui';
import React from 'react';
import { ArrowsPointingOutMiniIcon, TrashMiniIcon } from '../icons';
import { Tooltip as TippyTooltip } from 'react-tippy';
import _ from 'lodash';

const MarkerPopupControls = ({
	marker,
	setIsRepositioningMarker,
	deleteMarker,
	setActiveClickListener,
	confirmDeleteMarkerTooltipIsOpen,
	setConfirmDeleteMarkerTooltipIsOpen,
}) => {
	return (
		<div className='flex justify-end mt-4'>
			<Button
				size='small'
				layout='outline'
				className='marker-popup-button'
				onMouseDown={() => {
					setIsRepositioningMarker(_.cloneDeep(marker));
					deleteMarker(marker.id);
					setActiveClickListener('REPOSITION_MARKER_CLICK_LISTENER');
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
					<div>Really Delete?</div>
					<Button size='small' layout='outline' className='mr-2 border-red-600 bg-red-600 active:bg-red-800' onClick={() => deleteMarker(marker.id)}>
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
	);
}

export default MarkerPopupControls;