import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, Button, Label, Input } from '@windmill/react-ui'
import './CreateEditLabelModal.css';
import { nanoid } from 'nanoid';
import L from 'leaflet';
import _ from 'lodash';
import { CirclePicker } from 'react-color';

const CreateEditLabelModal = ({ creatingEditingLabel, setCreatingEditingLabel, onConfirmCreateEditLabel, deleteLabel }) => {
  
	const isCreatingNewLabel = (!creatingEditingLabel || creatingEditingLabel?.id === 'TEMP_ID');

	const handleInputChange = (e, inputId) => {
		let newFormValues = _.cloneDeep(formValues);
		if (inputId === 'labelText') {
			newFormValues.labelText = e.target?.value;
		} else if (inputId === 'color') {
			newFormValues.color = e.hex;
		}
		
		setFormValues(newFormValues);
	}
	
	const onClose = () => {
		if (isCreatingNewLabel) {
			deleteLabel('TEMP_ID');
		}
		setCreatingEditingLabel(null);
		cleanupForm();
	}

	const cleanupForm = () => {
		setFormValues(emptyFormValues);
	}

	const onConfirmClick = () => {
		
		const newDiv = document.createElement("div");
		newDiv.className = 'map-label-content bg-white text-black whitespace-nowrap text-xs'
		newDiv.id = 'placeholder-width-benchmark'
		const newContent = document.createTextNode(formValues.labelText);
		newDiv.appendChild(newContent);
		const parentContainer = document.getElementsByClassName('leaflet-marker-pane')[0];
		parentContainer.appendChild(newDiv);
		const iconWidth = newDiv.clientWidth;
		document.getElementById("placeholder-width-benchmark").remove();

		let newMarker = {
			pos: creatingEditingLabel.pos,
			id: isCreatingNewLabel ? nanoid() : creatingEditingLabel.id,
			labelText: formValues.labelText?.trim(),
			color: formValues.color,
			type: 'label',
			popup: 'true',
			icon: new L.divIcon({
				className: '',
				iconAnchor: [(iconWidth / 2) + 5, 13],
				labelAnchor: [0, 0],
				popupAnchor: [0,-12],
				iconSize: [iconWidth + 15, 28],
				html: `<div style="background:${formValues.color}!important;color:${formValues.color === '#ffffff' ? '#000' : "#FFF"}" class="leaflet-tooltip map-label">
					<span class="map-label-content whitespace-nowrap">${formValues.labelText}</span>
				</div>`
			})
		}
		
		onConfirmCreateEditLabel({newMarker: newMarker, idToDelete: creatingEditingLabel.id});
		cleanupForm();
	}
	
	const initialFormValues = {
		labelText: '',
		color: '#ffffff'
	};

	const [formValues, setFormValues] = useState(initialFormValues);


	/* If editing existing marker */
	if (creatingEditingLabel && !isCreatingNewLabel && formValues?.labelText === '') {
		const newEditFormValues = {
			labelText: creatingEditingLabel.labelText,
			color: creatingEditingLabel.color,
		};
		setFormValues(newEditFormValues);
	}
		
	const emptyFormValues = {
		labelText: '',
		color: '#ffffff'
	}

	const formIsInvalid = () => {
		return formValues && (!formValues?.labelText);
	}

	return (
    <div className='modal-wrapper'>
			<Modal isOpen={creatingEditingLabel} onClose={onClose}>
					
				<div className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
					{isCreatingNewLabel ? 'Create Label' : 'Edit Label'}
				</div>

				<ModalBody>
					<div className="create-label-modal-body-content px-4 pb-3 mb-8 bg-white rounded-lg dark:bg-gray-800">
						
						<Label className='mt-4'>
							<span className='text-gray-200 required'>Label</span>
							<Input
								id='labelText'
								className="mt-1 placeholder-gray-500"
								placeholder="Label text"
								onChange={e => handleInputChange(e, 'labelText')}
								value={formValues.labelText}
								maxLength={50}
							/>
						</Label>

						<div className='flex'>
							<div>
								<Label className='mt-4 mb-2'>
									<span className='text-gray-200 required'>Color</span>
								</Label>
								<CirclePicker
									onChangeComplete={(color, event) => handleInputChange(color, 'color')}
									colors={['#ffffff', '#B80000', '#DB3E00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']}
									color={formValues.color}
									width='205px'
								/>
							</div>

							{formValues?.labelText?.length > 0 && formValues.labelText.trim().length > 0 &&
								<div className='pl-4 flex-1 overflow-hidden'>
									<Label className='mt-4 mb-2'>
										<span className='text-gray-200'>Preview</span>
									</Label>
									<div className='flex'>
										<div
											style={{
												background: `${formValues.color}`,
												color: formValues.color === '#ffffff' ? '#000' : "#FFF",
											}}
											className="map-label-preview flex"
										>
												<div className='text-ellipsis'>{formValues.labelText}</div>
										</div>
									</div>
								</div>
							}	
						</div>

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

export default CreateEditLabelModal
