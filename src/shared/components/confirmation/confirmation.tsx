import Modal from '@components/modal/modal';
import Button from '@components/button/button';
import {useTranslation} from 'react-i18next';

export interface ConfirmationProps {
    title: string;
    onOk: () => void;
    onCancel?: () => void;
    displayCancel?: boolean;
    onClose?: () => void;
    message?: string;
    isOpen: boolean;
    okButtonLabel?: string;
    cancelButtonLabel?: string;
    closeableOnEscapeKeyPress?: boolean;
    hasOverlay?: boolean;
}

const Confirmation = ({title, onOk, onCancel, onClose, message = '', okButtonLabel = 'common.ok', cancelButtonLabel = 'common.cancel',
    displayCancel = true, isOpen, closeableOnEscapeKeyPress, hasOverlay = false}: ConfirmationProps) => {
    const {t} = useTranslation();
    const close = () => {
        if (onClose) {
            onClose();
        }
    }

    const cancel = () => {
        if (onCancel) {
            onCancel();
        }
    }

    return <div className='flex items-center justify-center justify-self-center m-auto'>
        <Modal hasOverlay={hasOverlay} isOpen={isOpen} title={t(title)} onClose={() => close()} isClosable={true} closeableOnEscapeKeyPress={closeableOnEscapeKeyPress}>
            <div className='w-full h-32 h-full py-4'>
                {message && <div className='pb-6'>{t(message)}</div>}
                <div className='flex items-end justify-end w-full'>
                    <div className='flex flex-col md:flex-row space-y-6 md:space-y-0 space-x-0 md:space-x-6 justify-end w-full px-2'>
                        {displayCancel &&
                            <Button buttonType='secondary' label={t(cancelButtonLabel)} onClick={() => cancel()} />}
                        <Button label={t(okButtonLabel)} onClick={() => onOk()} />
                    </div>
                </div>
            </div>
        </Modal>
    </div>
}

export default Confirmation;
