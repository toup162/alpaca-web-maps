import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input } from '@windmill/react-ui'
import './CreateMarkerModal.css';
import { nanoid } from 'nanoid';
import { Icon } from 'leaflet';
import Select from 'react-select'
import _ from 'lodash';

const options = [
	{
		value: 'marker',
		iconObject: new Icon ({
			iconUrl: 'https://img.icons8.com/?size=50&id=Sk4BAluINF9y&format=png',
			iconSize: [50,50],
			iconAnchor: [50/2,50],
			popupAnchor: [0, 0] 
		}),
		label: (
			<div className='flex items-center'>
				<img
					src='https://img.icons8.com/?size=50&id=Sk4BAluINF9y&format=png'
					alt='marker'
					className='ml-1 mr-3 h-6'
				/>
				<div>Default</div>
			</div>
		)
	},
  {
		value: 'home',
		iconObject: new Icon ({
			iconUrl: 'https://img.icons8.com/?size=50&id=euc8ZKJJqR5v&format=png',
			iconSize: [50,50],
			iconAnchor: [25,25],
			popupAnchor: [0, 0] 
		}),
		label: (
			<div className='flex items-center'>
				<img
					src='https://img.icons8.com/?size=50&id=euc8ZKJJqR5v&format=png'
					alt='home'
					className='mr-2 h-6'
				/>
				<div>Home</div>
			</div>
		)
	},
  {
		value: 'portal',
		iconObject: new Icon ({
			iconUrl: 'https://img.icons8.com/?size=50&id=3QvhGTuExqvB&format=png',
			iconSize: [50,50],
			iconAnchor: [25,25],
			popupAnchor: [0, 0] 
		}),
		label: (
			<div className='flex items-center'>
				<img
					src='https://img.icons8.com/?size=50&id=3QvhGTuExqvB&format=png'
					alt='portal'
					className='mr-2 h-6'
				/>
				<div>Portal</div>
			</div>
		)
	},
  {
		value: 'door',
		iconObject: new Icon ({
			iconUrl: 'https://img.icons8.com/?size=50&id=kUgTl67NPdf8&format=png',
			iconSize: [50,50],
			iconAnchor: [25,25],
			popupAnchor: [0, 0] 
		}),
		label: (
			<div className='flex items-center'>
				<img
					src='https://img.icons8.com/?size=50&id=kUgTl67NPdf8&format=png'
					alt='door'
					className='mr-2 h-6'
				/>
				<div>Door</div>
			</div>
		)
	},
  {
		value: 'treasure',
		iconObject: new Icon ({
			iconUrl: 'https://img.icons8.com/?size=50&id=K18A1WRGEfQO&format=png',
			iconSize: [50,50],
			iconAnchor: [25,25],
			popupAnchor: [0, 0] 
		}),
		label: (
			<div className='flex items-center'>
				<img
					src='https://img.icons8.com/?size=50&id=K18A1WRGEfQO&format=png'
					alt='treasure'
					className='mr-2 h-6'
				/>
				<div>Treasure</div>
			</div>
		)
	},
]

const CreateMarkerModal = ({ creatingMarker, setCreatingMarker, onConfirm, deletePlaceholderMarker }) => {
    
	const [formValues, setFormValues] = useState({
		tooltip: 'Test tooltip text',
		popup: 'test popup text',
		icon: options[0]
		/*
		iconObject: new Icon ({
			iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
			iconSize: [50,50],
			iconAnchor: [25,25],
			popupAnchor: [0, 0] 
		})
		*/
	});

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
	}

	const onConfirmClick = () => {
		const newMarker = {
			...formValues,
			icon: formValues.icon.iconObject,
			pos: creatingMarker.pos,
			id: nanoid(),
		};
		onConfirm(newMarker);
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
											options={options}
											onChange={o => handleIconOptionSelect(o)}
											defaultValue={options.find((o) => o.value === 'marker')}
											isSearchable={false}
											className="icon-select-container"
   										classNamePrefix="icon-select"
										/>
									</div>
								</Label>

								<Label className='mt-2'>
									<span className='text-gray-200'>Name</span>
									<Input
										id='mapName'
										className="mt-1 placeholder-gray-500"
										placeholder="Name"
										onChange={e => handleInputChange(e, 'mapName')}
										value={formValues.mapName}
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
