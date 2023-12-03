import './App.css';
import { MapContainer, TileLayer } from 'react-leaflet';

function App() {
	return (
		<div className="App">
			<MapContainer center={[0,0]} zoom={3}>
        <TileLayer
          attribution='test'
          url='../rift/{z}/{y}/{x}.jpg'
        />
      </MapContainer>
		</div>
	);
}

export default App;
