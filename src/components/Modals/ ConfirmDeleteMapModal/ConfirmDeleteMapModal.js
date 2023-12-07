	import React, { useContext } from 'react'
	import { Modal, ModalFooter, Button } from '@windmill/react-ui'
	import './ConfirmDeleteMapModal.css';
	import { UserLocalContext } from '../../../context/UserLocalContext';

	const ConfirmDeleteMapModal = ({ confirmDeleteMapModalOpen, setOpen }) => {
	const { deleteMap } = useContext(UserLocalContext);


		const onClose = () => {
				setOpen(false);
		}

		const onConfirm = () => {
				confirmDeleteMapModalOpen?.mapId && deleteMap(confirmDeleteMapModalOpen.mapId)
				setOpen(false);
		};

		return (
		<div className='modal-wrapper'>
			<Modal isOpen={!!confirmDeleteMapModalOpen} onClose={onClose}>
				<div className='text-gray-200'>
					<div className='text-xl mb-2'>Delete <i>{confirmDeleteMapModalOpen?.mapName}</i>?</div>
					<div className='mb-4'>This will permanently delete the map and all of its marker and connection data.</div>
				</div>
				<div className="mb-8 sm:mb-12">
					<ModalFooter>
						<div className="hidden sm:block">
							<Button layout="outline" onClick={onClose}>
								Cancel
							</Button>
						</div>
						<div className="hidden sm:block">
							<Button onClick={onConfirm}>Delete</Button>
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
