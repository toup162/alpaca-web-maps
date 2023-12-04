import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const Dashboard = () => {

    return (
			<div className="App">
				zzz
				<MapContainer
					center={[20,-20]}
					zoom={3}
					maxZoom={6}
					minZoom={3}
					zoomControl={false}
				>
					<TileLayer
						attribution='test'
						url='https://raw.githubusercontent.com/toup162/alpaca-web-maps/master/public/placeholder_map/{z}/{y}/{x}.jpg'
						noWrap={true}

					/>
				</MapContainer>
			</div>
    )
}

export default Dashboard;
