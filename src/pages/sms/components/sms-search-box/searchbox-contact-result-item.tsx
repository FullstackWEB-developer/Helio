import SvgIcon, {Icon} from '@components/svg-icon';
import utils from '@shared/utils/utils';
import classnames from 'classnames';
import {useRef, useState} from 'react';
import Tooltip from '@components/tooltip/tooltip';
import {useTranslation} from 'react-i18next';
import {ContactExtended} from '@shared/models';
import './searchbox-contact-result-item.scss';
interface SearchBoxContactResultItemProps {
    onSelect?: (patient: ContactExtended) => void;
    contact: ContactExtended;
}
const SearchBoxContactResultItem = ({contact, ...props}: SearchBoxContactResultItemProps) => {
    const addIconRef = useRef(null);
    const [isToolTipVisible, setToolTipVisible] = useState(false);
    const {t} = useTranslation();

    const onAddIconClick = () => {
        if (!!contact.mobilePhone) {
            if (props.onSelect) {
                props.onSelect(contact);
            }
        } else {
            setToolTipVisible(!isToolTipVisible);
        }
    }

    return (
        <div key={contact.id} className='flex flex-row w-full auto-cols-max body2 border-b relative cursor-pointer hover:bg-gray-100 px-7 items-center searchbox-contact-result-item-line py-2'>
            <div className='uppercase flex items-center w-2/12 pr-0.5'>
                {!!contact.lastName && !!contact.firstName &&
                    utils.stringJoin(', ', contact.lastName, contact.firstName)
                }
                {(!contact.lastName || !contact.firstName) &&
                    t('common.not_available')
                }
            </div>
            <div className='flex items-center w-2/12 uppercase lx:w-1/12'>{contact.companyName}</div>
            <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>
                {!!contact.emailAddress &&
                    <SvgIcon
                        type={Icon.CheckMark}
                        fillClass="default-toolbar-icon"
                    />}
            </div>
            <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>
                {!!contact.mobilePhone &&
                    <SvgIcon
                        type={Icon.CheckMark}
                        fillClass="default-toolbar-icon"
                    />
                }
            </div>
            <div className='flex items-center justify-center w-1/12 '>
                <div ref={addIconRef}>
                    <SvgIcon
                        fillClass={classnames({"rgba-025-fill": !contact.mobilePhone, "default-toolbar-icon": !!contact.mobilePhone})}
                        type={Icon.AddContact}
                        onClick={onAddIconClick}
                    />
                </div>
                <Tooltip targetRef={addIconRef} isVisible={isToolTipVisible} placement='bottom-end'>
                    <div className="flex p-6 body2 w-80">
                        {t('searchbox_result.tooltip_unavailable_sms_message')}
                    </div>
                </Tooltip>

            </div>
        </div>
    )
}

export default SearchBoxContactResultItem;
