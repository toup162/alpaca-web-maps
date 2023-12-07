import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import { Input, Button, Label } from '@windmill/react-ui'
import { EyeIcon, XIcon } from '../icons'
import _ from 'lodash';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom'
import { UserLocalContext } from '../context/UserLocalContext'
import { useHistory, useLocation, useParams } from 'react-router-dom/cjs/react-router-dom';
import { nanoid } from 'nanoid';
import moment from 'moment';
import toast from 'react-hot-toast';

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
		}
	);
	const [showPreview, setShowPreview] = useState(false);
	
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

	return (
		<div className="create-map-container px-6 mx-auto">
			<PageTitle>
				{existingMap
					? <>Edit <i>{existingMap.mapName}</i></>
					: <>Create a Map</>
				}
			</PageTitle>
			<div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
				<Label>
					<span className='text-gray-200'>Map Name</span>
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
						<span className='text-gray-200'>Map Attribution</span>
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
				<hr className='border-gray-700 mt-4'/>
				<div className='flex justify-end mt-4 mb-3'>
					<div className='flex'>
						<Button
							disabled={!formValues?.mapName || !formValues?.tileRootDirectoryUrl}
							onClick={existingMap ? handleSaveEdit : handleCreate}
						>
							{existingMap ? 'Save' : 'Create'}
						</Button>
						<Button className='ml-2' layout='link' tag={Link} to='/app/dashboard'>Cancel</Button>
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
