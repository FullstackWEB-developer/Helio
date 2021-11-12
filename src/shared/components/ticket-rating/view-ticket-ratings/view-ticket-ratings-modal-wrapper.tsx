import Modal from '@components/modal/modal';
import React from 'react';
export interface ViewTicketRatingsModalWrapperProps {
    children: React.ReactNode;
    closeModal: () => void;
    isOpen: boolean;
}
const ViewTicketRatingsModalWrapper = React.forwardRef<HTMLDivElement, ViewTicketRatingsModalWrapperProps>(({children, closeModal, isOpen}:ViewTicketRatingsModalWrapperProps, ref) => {

    return <Modal isDraggable={true}
    isOpen={isOpen}
    closeableOnEscapeKeyPress={true}
    title='ticket_log.manager_ratings_reviews'
    isClosable={true} onClose={() => closeModal()}>
    <div ref={ref} className='view_ticket_ratings_wrapper flex flex-col pb-6'>
        {children}
    </div>
</Modal>
})

export  default ViewTicketRatingsModalWrapper;
