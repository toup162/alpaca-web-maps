import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const Dashboard = () => {

    return (
			<div className="App">
				<MapContainer
					center={[60,-20]}
					zoom={2}
					maxZoom={6}
					minZoom={2}
					zoomControl={false}
				>
					<TileLayer
						attribution='test'
						url='https://raw.githubusercontent.com/toup162/alpaca-web-maps/master/public/placeholder_map/{z}/{y}/{x}.png'
						noWrap={true}
					/>
				</MapContainer>
			</div>
    )
}

export default Dashboard;
