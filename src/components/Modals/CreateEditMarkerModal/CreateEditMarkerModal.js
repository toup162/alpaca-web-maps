import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, Button, Label, Input } from '@windmill/react-ui'
import './CreateEditMarkerModal.css';
import { nanoid } from 'nanoid';
import { Icon } from 'leaflet';
import Select from 'react-select'
import _ from 'lodash';
import IconSizeRadio from './IconSizeRadio';

const CreateEditMarkerModal = ({ creatingEditingMarker, setCreatingEditingMarker, onConfirmCreateEditMarker, deleteMarker }) => {
  
	const isCreatingNewMarker = (!creatingEditingMarker || creatingEditingMarker?.id === 'TEMP_ID');

	const handleInputChange = (e, inputId) => {
		let newFormValues = _.cloneDeep(formValues);
		newFormValues[inputId] = e.target?.value;
		setFormValues(newFormValues);
	}

	const handleIconOptionSelect = selectedOption => {
		let newFormValues = _.cloneDeep(formValues);
		newFormValues.icon = selectedOption;
		setFormValues(newFormValues);
	}
	
	const onClose = () => {
		if (isCreatingNewMarker) {
			deleteMarker('TEMP_ID');
		}
		setCreatingEditingMarker(null);
		cleanupForm();
	}

	const cleanupForm = () => {
		setFormValues(emptyFormValues);
	}

	const onConfirmClick = () => {		
		let newMarker = {
			...formValues,
			tooltip: formValues.label,
			description: formValues.description,
			popup: formValues.label,
			type: 'marker',
			icon: new Icon ({
				iconUrl: `https://img.icons8.com/?size=50&id=${formValues.icon.id}&format=png`,
				iconSize: iconSizes[formValues.iconProfile],
				iconAnchor: formValues.icon.pinpointAnchor
					? [iconAnchors[formValues.iconProfile][0], iconAnchors[formValues.iconProfile][1] * 2]
					: iconAnchors[formValues.iconProfile],
				tooltipAnchor: formValues.icon.pinpointAnchor
					? [tooltipAnchors[formValues.iconProfile][0], -tooltipAnchors[formValues.iconProfile][0]]
					: tooltipAnchors[formValues.iconProfile],
				popupAnchor: formValues.icon.pinpointAnchor
					?	[0, popupAnchors[formValues.iconProfile][1] * 2]
					: popupAnchors[formValues.iconProfile]
			}),
			pos: creatingEditingMarker.pos,
			id: isCreatingNewMarker ? nanoid() : creatingEditingMarker.id
		}
		
		onConfirmCreateEditMarker({newMarker: newMarker, idToDelete: creatingEditingMarker.id});
		cleanupForm();
	}

	const iconSizes = {
		small: [24,24],
		default: [36,36],
		large: [48,48],
	};

	const iconAnchors = {
		small: [12,12],
		default: [18,18],
		large: [24,24],
	};

	const tooltipAnchors = {
		small: [12,0],
		default: [18,0],
		large: [24,0],
	};

	const popupAnchors = {
		small: [0,-12],
		default: [0,-18],
		large: [0,-24],
	};
	
	const initialFormValues = {
		label: '',
		description: '',
		popup: '',
		iconProfile: 'default',
		icon: {
			value: 'marker',
			id: 'Sk4BAluINF9y',
			pinpointAnchor: true,
			label: (
				<div className='flex items-center'>
					<img
						src={`https://img.icons8.com/?size=50&id=Sk4BAluINF9y&format=png`}
						alt='marker'
						className='mr-2 h-6'
					/>
					<div>Default</div>
				</div>
			)
		}
	};

	const [formValues, setFormValues] = useState(initialFormValues);

	const iconOption = ({id, optionValue, label, pinpointAnchor}) => {
		return {
			value: optionValue,
			id: id,
			pinpointAnchor: pinpointAnchor,
			label: (
				<div className='flex items-center'>
					<img
						src={`https://img.icons8.com/?size=50&id=${id}&format=png`}
						alt={optionValue}
						className='mr-2 h-6'
					/>
					<div>{label}</div>
				</div>
			)
		}
	}

	const getIconIdFromIconCdnUrl = url => {
		const urlParams = new URLSearchParams(url);
		return urlParams.get('id');
	};
	
	const genericOptions = [
		iconOption({id: 'Sk4BAluINF9y', optionValue: 'marker', label: 'Default', pinpointAnchor: true}),
		iconOption({id: 'feC741oOM7xA', optionValue: 'heart', label: 'Heart'}),
		iconOption({id: 'euc8ZKJJqR5v', optionValue: 'home', label: 'Home'}),
		iconOption({id: 'AOSwDEsNcKLt', optionValue: 'info', label: 'Info'}),
		iconOption({id: 'OiLYr7ATVk7R', optionValue: 'person', label: 'Person'}),
	];
	
	const interiorOptions = [
		iconOption({id: 'kUgTl67NPdf8', optionValue: 'door', label: 'Door'}),
		iconOption({id: '42byuSCZTK8Q', optionValue: 'exit', label: 'Exit'}),
		iconOption({id: 'ul6bJMCno3Wj', optionValue: 'stairs', label: 'Stairs'}),
		iconOption({id: 'j6eik5DXroff', optionValue: 'stairsup', label: 'Stairs Up'}),
		iconOption({id: '1FBVerV5DzE9', optionValue: 'stairsdown', label: 'Stairs Down'}),
	];
	
	const rpgOptions = [
		iconOption({id: 'dKeaziq963Jl', optionValue: 'exclamation', label: 'Exclamation'}),
		iconOption({id: 'PSL3S0NVv5HJ', optionValue: 'key', label: 'Key'}),
		iconOption({id: 'oQjhDr71haP1', optionValue: 'parchment', label: 'Parchment'}),
		iconOption({id: '3QvhGTuExqvB', optionValue: 'portal', label: 'Portal'}),
		iconOption({id: 'HhJFMmnmRGE0', optionValue: 'skull', label: 'Skull'}),
		iconOption({id: 'm27n7btt2tuj', optionValue: 'sword', label: 'Sword'}),
		iconOption({id: 'K18A1WRGEfQO', optionValue: 'treasure', label: 'Treasure'}),
		iconOption({id: '6GGp079FpE32', optionValue: 'vendor', label: 'Vendor'}),
	];

	const allIconOptions = [...genericOptions, ...interiorOptions, ...rpgOptions];

	/* If editing existing marker */
	if (creatingEditingMarker && !isCreatingNewMarker && formValues?.label === '') {
		const existingIconDetails = creatingEditingMarker.icon?.options;
		const correspondingSelectOption = allIconOptions.find(iconOption => iconOption.id === getIconIdFromIconCdnUrl(existingIconDetails.iconUrl));
		const newEditFormValues = {
			label: creatingEditingMarker.label,
			description: creatingEditingMarker.description,
			popup: creatingEditingMarker.popup,
			iconProfile: creatingEditingMarker.iconProfile,
			icon: correspondingSelectOption,
		};
		
		setFormValues(newEditFormValues);
	}

	const groupedOptions = [
		{
			label: 'Generic',
			options: genericOptions,
		},
		{
			label: 'Interior',
			options: interiorOptions
		},
		{
			label: 'RPG',
			options: rpgOptions,
		},
	];
	
	const groupStyles = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	};
	
	const groupBadgeStyles = {
		backgroundColor: '#EBECF0',
		borderRadius: '2em',
		color: '#172B4D',
		display: 'inline-block',
		fontSize: 12,
		fontWeight: 'normal',
		lineHeight: '1',
		minWidth: 1,
		padding: '0.167em 0.5em',
		textAlign: 'center',
	};
	
	const formatGroupLabel = (data) => (
		<div style={groupStyles}>
			<span>{data.label}</span>
			<span style={groupBadgeStyles}>{data.options.length}</span>
		</div>
	);

	const emptyFormValues = {
		label: '',
		popup: '',
		description: '',
		icon: iconOption({id: 'Sk4BAluINF9y', optionValue: 'marker', label: 'Default', pinpointAnchor: true}),
		iconProfile: 'default'
	}

	const formIsInvalid = () => {
		return formValues && (!formValues?.label

		)
	}

	return (
    <div className='modal-wrapper'>
			<Modal isOpen={creatingEditingMarker} onClose={onClose}>
					
				<div className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
					{isCreatingNewMarker ? 'Create Marker' : 'Edit Marker'}
				</div>

				<ModalBody>
					<div className="create-marker-modal-body-content px-4 pb-3 mb-8 bg-white rounded-lg dark:bg-gray-800">
						
						<Label className='mt-4'>
							<span className='text-gray-200 required'>Label</span>
							<Input
								id='label'
								className="mt-1 placeholder-gray-500"
								placeholder="Label text"
								onChange={e => handleInputChange(e, 'label')}
								value={formValues.label}
							/>
						</Label>

						<Label className='mt-4'>
							<span className='text-gray-200'>Description</span>
							<Input
								id='description'
								className="mt-1 placeholder-gray-500"
								placeholder="Description text"
								onChange={e => handleInputChange(e, 'description')}
								value={formValues.description}
							/>
						</Label>
						
						<Label className="mt-4">
							<span className='text-gray-200'>Icon</span>
							<div className='text-black mt-1'>
								{((isCreatingNewMarker) || (creatingEditingMarker && !isCreatingNewMarker && formValues.icon.value)) &&
									<Select
										options={groupedOptions}
										onChange={o => handleIconOptionSelect(o)}
										defaultValue={
											!isCreatingNewMarker && creatingEditingMarker?.icon
												? formValues.icon
												: groupedOptions[0].options[0]
										}
										isSearchable={true}
										className="icon-select-container"
										classNamePrefix="icon-select"
										formatGroupLabel={formatGroupLabel}
									/>
								}
							</div>
						</Label>

						<IconSizeRadio
							formValues={formValues}
							handleInputChange={handleInputChange}
						/>
					</div>
				</ModalBody>

				<div className="mb-8 sm:mb-12">
					<ModalFooter>
						<div className="hidden sm:block">
							<Button layout="outline" onClick={onClose}>
								Cancel
							</Button>
						</div>
						<div className="hidden sm:block">
							<Button onClick={onConfirmClick} disabled={formIsInvalid()}>Accept</Button>
						</div>
						<div className="block w-full sm:hidden">
							<Button block size="large" layout="outline" onClick={onClose}>
								Cancel
							</Button>
						</div>
						<div className="block w-full sm:hidden">
							<Button block size="large" onClick={onConfirmClick} disabled={formIsInvalid()}>
								Accept
							</Button>
						</div>
					</ModalFooter>
				</div>

			</Modal>
		</div>
    )
}

export default CreateEditMarkerModal
