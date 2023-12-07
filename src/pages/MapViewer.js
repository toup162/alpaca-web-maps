import React, { useContext } from 'react'

import { MapContainer, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { UserLocalContext } from '../context/UserLocalContext';

const MapViewer = () => {
	const { mapId } = useParams();
	const { userLocal } = useContext(UserLocalContext);
	const mapDetails = userLocal?.maps?.find(m => m.mapId === mapId);

	return (
		<div>
			{mapDetails && <>
				<MapContainer
					center={[60,-20]}
					zoom={2}
					maxZoom={6}
					minZoom={2}
					className='fullscreen-map'
				>
					<TileLayer
						attribution='test'
						url={`${mapDetails.tileRootDirectoryUrl}/{z}/{y}/{x}.png`}
						noWrap={true}
					/>
				</MapContainer>
			</>}
			
		</div>
	);
}

export default MapViewer;
