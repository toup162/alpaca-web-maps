import React from 'react'

import { MapContainer, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom/cjs/react-router-dom';

const MapViewer = () => {
	const { mapId } = useParams();
	console.log("\n\n\n\n");
	console.log(mapId);
	console.log("\n\n\n\n");
	return (
		<div>
			<MapContainer
				center={[60,-20]}
				zoom={2}
				maxZoom={6}
				minZoom={2}
				className='fullscreen-map'
			>
				<TileLayer
					attribution='test'
					url='https://raw.githubusercontent.com/toup162/alpaca-web-maps/master/public/placeholder_map/{z}/{y}/{x}.png'
					noWrap={true}
				/>
			</MapContainer>
		</div>
	);
}

export default MapViewer;
