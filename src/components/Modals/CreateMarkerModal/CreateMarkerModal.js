import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input } from '@windmill/react-ui'
import './CreateMarkerModal.css';
import { nanoid } from 'nanoid';
import { Icon } from 'leaflet';
import Select from 'react-select'
import _ from 'lodash';

const CreateMarkerModal = ({ creatingMarker, setCreatingMarker, onConfirm, deletePlaceholderMarker }) => {
  
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
		deletePlaceholderMarker();
		setCreatingMarker(null);
		cleanupForm();
	}

	const cleanupForm = () => {
		setFormValues(defaultFormValues);
	}

	const onConfirmClick = () => {
		const newMarker = {
			...formValues,
			icon: new Icon ({
				iconUrl: `https://img.icons8.com/?size=50&id=${formValues.icon.id}&format=png`,
				iconSize: iconSizes[formValues.iconProfile],
				iconAnchor: formValues.icon.pinpointAnchor
					? [iconAnchors[formValues.iconProfile][0], iconAnchors[formValues.iconProfile][1] * 2]
					: iconAnchors[formValues.iconProfile],
				tooltipAnchor: formValues.icon.pinpointAnchor
					? [0,0]
					: tooltipAnchors[formValues.iconProfile]
			}),
			pos: creatingMarker.pos,
			id: nanoid(),
		};
		onConfirm(newMarker);
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

	const [formValues, setFormValues] = useState({
		tooltip: '',
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
	});

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

	const defaultFormValues = {
		tooltip: '',
		popup: '',
		icon: iconOption({id: 'Sk4BAluINF9y', optionValue: 'marker', label: 'Default', pinpointAnchor: true}),
		iconProfile: 'default'
	}

	return (
    <div className='modal-wrapper'>
			<Modal isOpen={creatingMarker} onClose={onClose}>
					
				<ModalHeader>Create Marker</ModalHeader>

				<ModalBody>
						<div className="create-marker-modal-body-content px-4 py-3 mb-8 bg-white rounded-lg dark:bg-gray-800">
								<Label className="mt-4">
									<span className='text-gray-200 '>Icon</span>
								
									<div className='text-black mt-1'>
										<Select
											options={groupedOptions}
											onChange={o => handleIconOptionSelect(o)}
											defaultValue={groupedOptions[0].options[0]}
											isSearchable={true}
											className="icon-select-container"
   										classNamePrefix="icon-select"
											formatGroupLabel={formatGroupLabel}
										/>
									</div>
								</Label>

								<Label className="mt-4">
									<span className='text-gray-200 '>Icon Size</span>
								</Label>
								<div className="grid grid-cols-3 gap-2 rounded bg-gray-700 p-2 mt-1">
									<div>
										<input
											type="radio"
											name="iconProfile"
											id="profile-small"
											value="small"
											className="peer hidden"
											checked={formValues.iconProfile === 'small'}
											onChange={e => handleInputChange(e, 'iconProfile')}
										/>
										<label htmlFor="profile-small" className="h-full flex items-center block cursor-pointer select-none p-2 text-left peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
											<div className='flex items-center'>
												<img
													src={`https://img.icons8.com/?size=50&id=${formValues?.icon?.id}&format=png`}
													alt='icon size small'
													className='mr-2'
													style={{height: '24px'}}
												/>
												<div>
													<div>Small</div>
													<div>24x24 px</div>
												</div>
											</div>
										</label>
									</div>
									<div>
										<input
											type="radio"
											name="iconProfile"
											id="profile-default"
											value="default"
											className="peer hidden"
											checked={formValues.iconProfile === 'default'}
											onChange={e => handleInputChange(e, 'iconProfile')}
										/>
										<label htmlFor="profile-default" className="h-full flex items-center block cursor-pointer select-none p-2 text-left peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
											<div className='flex items-center'>
												<img
													src={`https://img.icons8.com/?size=50&id=${formValues?.icon?.id}&format=png`}
													alt='icon size default'
													className='mr-2'
													style={{height: '36px'}}
												/>
												<div>
													<div>Medium</div>
													<div>36x36 px</div>
												</div>
											</div>
										</label>
									</div>
									<div>
										<input
											type="radio"
											name="iconProfile"
											id="profile-large"
											value="large"
											className="peer hidden"
											checked={formValues.iconProfile === 'large'}
											onChange={e => handleInputChange(e, 'iconProfile')}
										/>
										<label htmlFor="profile-large" className="h-full flex items-center block cursor-pointer select-none p-2 text-left peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
											<div className='flex items-center'>
												<img
													src={`https://img.icons8.com/?size=50&id=${formValues?.icon?.id}&format=png`}
													alt='icon size large'
													className='mr-2'
													style={{height: '48px'}}
												/>
												<div>
													<div>Chonk</div>
													<div>48x48 px</div>
												</div>
											</div>
										</label>
									</div>
									
							</div>

								<Label className='mt-4'>
									<span className='text-gray-200'>Tooltip</span>
									<Input
										id='tooltip'
										className="mt-1 placeholder-gray-500"
										placeholder="Tooltip text"
										onChange={e => handleInputChange(e, 'tooltip')}
										value={formValues.tooltip}
									/>
								</Label>
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
							<Button onClick={onConfirmClick}>Accept</Button>
						</div>
						<div className="block w-full sm:hidden">
							<Button block size="large" layout="outline" onClick={onClose}>
								Cancel
							</Button>
						</div>
						<div className="block w-full sm:hidden">
							<Button block size="large" onClick={onConfirmClick}>
								Accept
							</Button>
						</div>
					</ModalFooter>
				</div>
				
			</Modal>
		</div>
    )
}

export default CreateMarkerModal
