import React, { useContext } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { UserLocalContext } from '../context/UserLocalContext'
import PageTitle from '../components/Typography/PageTitle';
import HeroTitle from '../components/Typography/HeroTitle';
import HeroCopyText from '../components/Typography/HeroCopyText';
import { Button } from '@windmill/react-ui';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const Dashboard = () => {
	const { userLocal } = useContext(UserLocalContext);
	console.log(userLocal);
	return (
		/* No maps to show - instead show a welcome section */
		<>
		{!userLocal?.maps?.length && 
			<div className="welcome-container pr-6 pl-20 mt-5">
				<HeroTitle>Create and share rich, interactive maps</HeroTitle>
				<HeroCopyText>
					... for your favorite old-school RPG<br />
					... for your D&D campaign<br />
					... for a pop-up food court
				</HeroCopyText>
				<div className="flex items-center mt-8">
					<Button className="text-lg" tag={Link} to='/app/create-map' size="larger">Get Started</Button>
					<Link className="text-lg ml-6 text-gray-300 hover:text-gray-500" size="larger" layout='link'>Learn more</Link>
				</div>
			</div>
		}

		{userLocal?.maps?.length ?
			<div>
				{JSON.stringify(userLocal.maps)}
			</div> : <div />
		}
		</>
	);
}

export default Dashboard;
