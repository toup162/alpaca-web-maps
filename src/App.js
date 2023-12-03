import './App.css';
import { MapContainer, TileLayer } from 'react-leaflet';

function App() {
	return (
		<div className="App">
			<MapContainer
				center={[20,-20]}
				zoom={3}
				maxZoom={6}
				minZoom={2}
			>
				<TileLayer
					attribution='test'
					url='../rift/{z}/{y}/{x}.jpg'
				/>
			</MapContainer>
		</div>
	);
}

export default App;
