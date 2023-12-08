import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import { Input, Button, Label } from '@windmill/react-ui'
import { AdjustmentsHorizontalIcon, DropdownIcon, EyeIcon, XIcon } from '../icons'
import _ from 'lodash';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom'
import { UserLocalContext } from '../context/UserLocalContext'
import { useHistory, useLocation, useParams } from 'react-router-dom/cjs/react-router-dom';
import { nanoid } from 'nanoid';
import moment from 'moment';
import toast from 'react-hot-toast';

const DEFAULT_CENTER_X_COORD = '60';
const DEFAULT_CENTER_Y_COORD = '-20';
const DEFAULT_INITIAL_ZOOM = '2';
const DEFAULT_MIN_ZOOM = '2';
const DEFAULT_MAX_ZOOM = '6';
const DEFAULT_TILES_DIRECTORY_SCHEMA = '/{z}/{x}/{y}.png';

const CreateEditMap = () => {
	const location = useLocation();
	const { mapId } = useParams();
	const editingExistingMap = !!location?.pathname?.includes('/edit-map') && mapId;
	const { addMap, updateMap, userLocal } = useContext(UserLocalContext);
	let existingMap;
	if (userLocal?.maps && editingExistingMap) {
		existingMap = userLocal.maps?.find(_map => _map.mapId === mapId)
	}
	const [formValues, setFormValues] = useState((editingExistingMap && existingMap)
		? existingMap
		: {
			mapName: '',
			tileRootDirectoryUrl: '',
			mapAttribution: '',
			centerXCoord: '60',
			centerYCoord: '-20',
			initialZoom: '2',
			minZoom: '2',
			maxZoom: '6',
			tileDirectorySchema: '/{z}/{x}/{y}.png'
		}
	);
	const [showPreview, setShowPreview] = useState(false);

	/* Returns true if the map being edited has 'advanced options' that are different than the default. */
	const isAdvancedConfiguration = () => {
		return (existingMap && (
			existingMap.centerXCoord !== DEFAULT_CENTER_X_COORD
			|| existingMap.centerYCoord !== DEFAULT_CENTER_Y_COORD
			|| existingMap.initialZoom !== DEFAULT_INITIAL_ZOOM
			|| existingMap.minZoom !== DEFAULT_MIN_ZOOM
			|| existingMap.maxZoom !== DEFAULT_MAX_ZOOM
			|| existingMap.tileDirectorySchema !== DEFAULT_TILES_DIRECTORY_SCHEMA
		))
	}
	
	const [showAdvancedOptions, setShowAdvancedOptions] = useState(isAdvancedConfiguration());

	let history = useHistory();

	useEffect(() => setShowPreview(false), [formValues]);

	const handleInputChange = (e, inputId) => {
		let newFormValues = _.cloneDeep(formValues);
		newFormValues[inputId] = e.target?.value;
		setFormValues(newFormValues);
	}

	const handleCreate = () => {
		const newMap = {
			...formValues,
			createdTs: moment(),
			modifiedTs: moment(), 
			mapId: nanoid()
		};
		addMap(newMap);
		toast.success(`Created '${newMap.mapName}'`);
		history.push('/app/dashboard');
	}

	const handleSaveEdit = () => {
		const newMap = {
			...formValues,
			modifiedTs: moment(), 
		};
		updateMap(newMap);
		toast.success(`Updated '${newMap.mapName}'`);
		history.push('/app/dashboard');
	}

	const formIsInvalid = () => {
		return formValues && (!formValues?.mapName
			|| !formValues.tileRootDirectoryUrl
			|| !formValues.centerXCoord
			|| !formValues.centerYCoord
			|| !formValues.initialZoom
			|| !formValues.minZoom
			|| !formValues.maxZoom
			|| !formValues.tileDirectorySchema
		)
	}
	
	return (
		<div className="create-map-container px-6 mx-auto">
			<PageTitle>
				{existingMap
					? <>Edit <i>{existingMap.mapName}</i></>
					: <>Create a Map</>
				}
			</PageTitle>

			<div className="mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
				<div className='px-4 py-3 pb-4'>
					<Label>
						<span className='text-gray-200'>Name</span>
						<Input
							id='mapName'
							className="mt-1 placeholder-gray-500"
							placeholder="Name"
							onChange={e => handleInputChange(e, 'mapName')}
							value={formValues.mapName}
						/>
					</Label>
					
					<div className="mt-4">
						<Label>
							<span className='text-gray-200'>Tiles Root Directory URL</span>
							<div className="relative">
								<Input
									id='tileRootDirectoryUrl'
									className="block w-full placeholder-gray-500 pl-25 mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
									placeholder="URL"
									onChange={e => handleInputChange(e, 'tileRootDirectoryUrl')}
									value={formValues.tileRootDirectoryUrl}
								/>
								<Button
									style={{background: '#43485b'}}
									onClick={() => setShowPreview(true)}
									icon={EyeIcon}
									disabled={!formValues.tileRootDirectoryUrl}
									className="absolute inset-y-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-l-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
								>
									Preview
								</Button>
							</div>
						</Label>
						<span className="text-xs text-gray-400">e.g. <i>https://myhost.cc/map_tiles</i></span>
					</div>

					<div className="mt-4">
						<Label>
							<span className='text-gray-200'>Legal Attribution</span>
							<Input
								id='mapAttribution'
								className="mt-1 placeholder-gray-500"
								placeholder="Attribution"
								onChange={e => handleInputChange(e, 'mapAttribution')}
								value={formValues.mapAttribution}
							/>
						</Label>
						<span className="text-xs text-gray-400">e.g. <i>© Microdeal, Inc. All rights reserved. 'Goldrunner II' is a trademark of Microdeal, Inc. </i></span>
					</div>

					{ /* Advanced Options */ }
					<div className='flex mt-4'>
						<div className='flex-1'>
							<hr className='border-gray-600 mt-4'/>
						</div>
						<div className='flex-0'>
							<Button layout="link" className='whitespace-nowrap mx-2' onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
								<AdjustmentsHorizontalIcon className='h-6 w-6 mr-1' />
								<span className='mr-1'>Advanced Options</span>
								<DropdownIcon className={`h-5 w-5 ${showAdvancedOptions ? 'transform -rotate-180 pl-1' : 'pl-0'}`} />
							</Button>
						</div>
						<div className='flex-1'>
							<hr className='border-gray-600 mt-4'/>
						</div>
					</div>

					{showAdvancedOptions && (
						<div className='pb-6'>

							<div className="mt-4">
								<Label>
									<span className='text-gray-200'>Tiles Directory Schema</span>
									<Input
										id='tileDirectorySchema'
										className="mt-1 placeholder-gray-500"
										placeholder=""
										onChange={e => handleInputChange(e, 'tileDirectorySchema')}
										value={formValues.tileDirectorySchema}
									/>
								</Label>
								<span className="text-xs text-gray-400">e.g. <i>{'/{z}/{y}/{x}.png'}</i></span>
							</div>

							<div className="mt-2 flex flex-wrap">
								<div className='pr-2 mt-2'>
									<Label>
										<span className='text-gray-200'>Initial Zoom</span>
										<Input
											id='initialZoom'
											className="mt-1 placeholder-gray-500"
											placeholder="Zoom level"
											onChange={e => handleInputChange(e, 'initialZoom')}
											value={formValues.initialZoom}
											type='number'
										/>
									</Label>
								</div>

								<div className='pr-2 mt-2'>
									<Label>
										<span className='text-gray-200'>Minimum Zoom</span>
										<Input
											id='minZoom'
											className="mt-1 placeholder-gray-500"
											placeholder="Zoom level"
											onChange={e => handleInputChange(e, 'minZoom')}
											value={formValues.minZoom}
											type='number'
										/>
									</Label>
								</div>

								<div className='mt-2'>
									<Label>
										<span className='text-gray-200'>Maximum Zoom</span>
										<Input
											id='maxZoom'
											className="mt-1 placeholder-gray-500"
											placeholder="Zoom level"
											onChange={e => handleInputChange(e, 'maxZoom')}
											value={formValues.maxZoom}
											type='number'
										/>
									</Label>
								</div>
							</div>
						
							<div className="mt-4 lg:max-w-xs">
								<Label>
									<span className='text-gray-200'>Center Coordinates</span>
								</Label>
								<div className='flex'>
									<div className='flex items-center mr-2 text-gray-400'>x: </div>
									<Input
										id='centerXCoord'
										className="mt-1 placeholder-gray-500 mr-4"
										placeholder=""
										onChange={e => handleInputChange(e, 'centerXCoord')}
										value={formValues.centerXCoord}
										type='number'
									/>

									<div className='flex items-center mr-2 text-gray-400'>y: </div>
									<Input
										id='centerYCoord'
										className="mt-1 placeholder-gray-500"
										placeholder=""
										onChange={e => handleInputChange(e, 'centerYCoord')}
										value={formValues.centerYCoord}
										type='number'
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='px-4 py-3 bg-gray-900 rounded-b'>
					{ /* Save/Cancel */ }
					<div className='flex justify-end mt-4 mb-3'>
						<div className='flex'>
							<Button
								disabled={formIsInvalid()}
								onClick={existingMap ? handleSaveEdit : handleCreate}
							>
								{existingMap ? 'Save' : 'Create'}
							</Button>
							<Button className='ml-2' layout='link' tag={Link} to='/app/dashboard'>Cancel</Button>
						</div>
					</div>
				</div>
			</div>
			
			{showPreview && (
				<div className='mb-20'>
					<div className='flex justify-between'>
						<SectionTitle>Preview</SectionTitle>
						<Button
							icon={XIcon}
							className='ml-2'
							layout='link'
							onClick={() => setShowPreview(false)}
						>
							Dismiss</Button>
					</div>
				
				<MapContainer
					center={[60,-20]}
					zoom={3}
					maxZoom={6}
					minZoom={2}
					className='preview-map'
				>
					<TileLayer
						attribution='test'
						url={`${formValues.tileRootDirectoryUrl}/{z}/{y}/{x}.png`}
						noWrap={true}
					/>
				</MapContainer>
				</div>
			)}
		</div>
	)
}

export default CreateEditMap;
