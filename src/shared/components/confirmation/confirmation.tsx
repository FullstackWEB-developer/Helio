import Modal from '@components/modal/modal';
import Button from '@components/button/button';
import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
export interface ConfirmationProps {
    title: string;
    onOk: () => void;
    isLoading?: boolean;
    onCancel?: () => void;
    displayCancel?: boolean;
    onClose?: () => void;
    message?: string;
    isOpen: boolean;
    okButtonLabel?: string;
    cancelButtonLabel?: string;
    closeableOnEscapeKeyPress?: boolean;
    hasOverlay?: boolean;
    className?: string;
    messageClassName?: string;
    isCloseButtonDisabled?: boolean;
    isDraggable?: boolean;
    displayAssistiveButton?: boolean;
    assistiveButtonLabel?: string;
    onAssistive?: () => void;
}

const Confirmation = ({title, onOk, onCancel, onClose, message = '', className, messageClassName, okButtonLabel = 'common.ok', cancelButtonLabel = 'common.cancel',
    displayCancel = true, isOpen, closeableOnEscapeKeyPress, hasOverlay = false, isLoading = false, isCloseButtonDisabled = false, isDraggable = false, displayAssistiveButton = false, assistiveButtonLabel = 'common.cancel', onAssistive}: ConfirmationProps) => {
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

    return <div className='flex items-center justify-center m-auto justify-self-center'>
        <Modal
            title={t(title)}
            className={className}
            hasOverlay={hasOverlay}
            isDraggable={isDraggable}
            isOpen={isOpen}
            isClosable={!isCloseButtonDisabled}
            closeableOnEscapeKeyPress={closeableOnEscapeKeyPress}
            onClose={() => close()}
			titleClassName='text-lg m-5'
        >
            <div className='w-full h-32 h-full py-4'>
                {message && <div className={classnames('pb-6', messageClassName)}>{t(message)}</div>}
                <div className='flex items-end justify-end w-full'>
                    <div className='flex flex-col justify-end w-full px-2 space-x-0 space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                        {displayCancel &&
                            <Button className='h-8' data-testid='cancel' buttonType='secondary' label={t(cancelButtonLabel)} onClick={() => cancel()} />}
                        <Button className='h-8' data-testid='ok' buttonType='small' label={t(okButtonLabel)} onClick={() => onOk()} isLoading={isLoading} />
                        {displayAssistiveButton &&
                            <Button className='h-8' buttonType='small' data-testid='assistive' isLoading={isLoading} label={t(assistiveButtonLabel)} onClick={() => onAssistive && onAssistive()} />}
                    </div>
                </div>
            </div>
        </Modal>
    </div>
}

export default Confirmation;
