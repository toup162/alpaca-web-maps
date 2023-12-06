import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from '@windmill/react-ui'
import './CreateMarkerModal.css';

const CreateMarkerModal = ({ isOpen, setOpen }) => {
    const onClose = () => {
        setOpen(false);
    }

    const onAccept = () => {
    

        window.localStorage.setItem('ALPACA_MAPPER_DATA', JSON.stringify({test: '123'}));
        
    };

    return (
    <div className='modal-wrapper'>
        <Modal isOpen={isOpen} onClose={onClose}>
            
            <ModalHeader>Create Marker</ModalHeader>

            <ModalBody>
                <div className="create-marker-modal-body-content px-4 py-3 mb-8 bg-white rounded-lg dark:bg-gray-800">
                    <Label className="mt-4">
                        <div className="mb-1">Subway Line</div>
                    </Label>
                </div>
            </ModalBody>
            <div className="mb-8 sm:mb-12">
                <ModalFooter>
                    <div className="hidden sm:block">
                        <Button layout="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                    <div className="hidden sm:block">
                        <Button onClick={onAccept}>Accept</Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" layout="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" onClick={onAccept}>
                            Accept
                        </Button>
                    </div>
                </ModalFooter>
            </div>
        </Modal>
        </div>
    )
}

export default CreateMarkerModal
