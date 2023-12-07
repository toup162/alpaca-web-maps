import React, { useContext, useState } from 'react';
import { UserLocalContext } from '../context/UserLocalContext'
import PageTitle from '../components/Typography/PageTitle';
import HeroTitle from '../components/Typography/HeroTitle';
import HeroCopyText from '../components/Typography/HeroCopyText';
import { Button, Card } from '@windmill/react-ui';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import SectionTitle from '../components/Typography/SectionTitle';
import { PlusIcon } from '../icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import MapCard from '../components/MapCard';
import ConfirmDeleteMapModal from '../components/Modals/ ConfirmDeleteMapModal/ConfirmDeleteMapModal';

const Dashboard = () => {
	const { userLocal } = useContext(UserLocalContext);
	const [confirmDeleteMapModalOpen, setConfirmDeleteMapModalOpen] = useState(null);
	const history = useHistory();

	let dashboardContent = <div />;

	if (!userLocal || userLocal.maps === null) {
		dashboardContent = (
			<div className="welcome-container px-4 md:pl-20 mt-5">
				<HeroTitle>Create and share rich, interactive maps</HeroTitle>
				<HeroCopyText>
					... for your favorite old-school RPG<br />
					... for your D&D campaign<br />
					... for an office floor plan
				</HeroCopyText>
				<div className="flex items-center mt-8">
					<Button className="text-lg hidden sm:block" tag={Link} to='/app/create-map' size="larger">Get Started</Button>
					<Link className="text-lg ml-6 hidden sm:block text-gray-300 hover:text-gray-500" to='/app/about' size="larger" layout='link'>Learn more</Link>
					<div className='block w-full sm:hidden'>
						<Button className="text-lg block w-full" tag={Link} to='/app/create-map' size="larger">Get Started</Button>
						<Button className="text-lg block w-full mt-4" layout='link' tag={Link} to='/app/about' size="larger">Learn more</Button>
					</div>
				</div>
			</div>
		);
	} else if (userLocal?.maps?.length || userLocal?.maps?.length === 0) {
		dashboardContent = (
			<div className="px-6 md:px-20 xs:mt-5">
				<PageTitle>Dashboard</PageTitle>
				<SectionTitle>Maps</SectionTitle>
				<div className="mb-8 mb-10 flex flex-wrap">
					{userLocal.maps.length > 0 ? userLocal.maps.map(mapDetails => {
						return <MapCard
							key={mapDetails.mapId}
							mapDetails={mapDetails}
							setConfirmDeleteMapModalOpen={setConfirmDeleteMapModalOpen}
						/>
					}) : <div />}
					<Card className='map-card mr-6 hover:outline'>
						<div
							className='h-full flex justify-center cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-colors ease-in-out duration-150 text-gray-300 hover:text-white'
							onClick={() => history.push('/app/create-map')}
						>
							<div className='flex items-center '>
								<div>
									<div className='flex justify-center h-12'>
										<PlusIcon />
									</div>
									<div className='ml-1'>Create a Map</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
				
				<SectionTitle>Connections</SectionTitle>
				<div className="grid gap-6 mb-8 md:grid-cols-2 mb-10">
					<div>
						None
					</div>
				</div>
				<ConfirmDeleteMapModal
					confirmDeleteMapModalOpen={confirmDeleteMapModalOpen}
					setOpen={setConfirmDeleteMapModalOpen}
				/>
			</div>
		);
	}

	return dashboardContent;
}

export default Dashboard;
