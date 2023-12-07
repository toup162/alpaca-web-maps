import React, { useContext } from 'react'
import { Modal, ModalFooter, Button } from '@windmill/react-ui'
import './ConfirmDeleteMapModal.css';
import { UserLocalContext } from '../../../context/UserLocalContext';
import { TrashMiniIcon } from '../../../icons';
import toast from 'react-hot-toast';

const ConfirmDeleteMapModal = ({ confirmDeleteMapModalOpen, setOpen }) => {
	const { deleteMap } = useContext(UserLocalContext);
	const onClose = () => {
		setOpen(null);
	}

	const onConfirm = () => {
		if (confirmDeleteMapModalOpen?.mapId) {
			deleteMap(confirmDeleteMapModalOpen.mapId);
			toast.success(`Deleted ${confirmDeleteMapModalOpen.mapName}`, {
				duration: 2500,
				position: 'top-center',
				icon: <><TrashMiniIcon /></>,
			});
		}			
		setOpen(null);
	};

	return (
	<div className='modal-wrapper'>
		<Modal isOpen={!!confirmDeleteMapModalOpen} onClose={onClose}>
			<div className='text-gray-200'>
				<div className='text-xl mb-2'>Delete '<b>{confirmDeleteMapModalOpen?.mapName}</b>'?</div>
				<div className='mb-4'>This will <b>permanently delete</b> the map and its marker/connection information.</div>
			</div>
			<div className="mb-8 sm:mb-12">
				<ModalFooter>
					<div className="hidden sm:block">
						<Button layout="outline" onClick={onClose}>
							Cancel
						</Button>
					</div>
					<div className="hidden sm:block">
						<button
							className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-red-900 border border-transparent active:bg-red-900 hover:bg-red-700 focus:shadow-outline-red"
							type="button"
							onClick={onConfirm}
						>
							<TrashMiniIcon />
							<div className='ml-2'>Delete</div>
						</button>
					</div>
					<div className="block w-full sm:hidden">
						<Button block size="large" layout="outline" onClick={onClose}>
							Cancel
						</Button>
					</div>
					<div className="block w-full sm:hidden">
						<Button block size="large" onClick={onConfirm}>
							Delete
						</Button>
					</div>
				</ModalFooter>
			</div>
		</Modal>
		</div>
	)
}

export default ConfirmDeleteMapModal;
