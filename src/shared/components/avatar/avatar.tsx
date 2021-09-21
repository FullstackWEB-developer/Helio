import StatusDot from '@components/status-dot/status-dot';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import utils from '@shared/utils/utils';
import {useState} from 'react';
import classnames from 'classnames';
import './avatar.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
import {useTranslation} from 'react-i18next';

export interface AvatarProps {
    userFullName: string;
    className?: string;
    labelClassName?: string;
    userPicture?: string;
    icon?: Icon;
    status?: UserStatus;
}

const Avatar = ({userFullName, labelClassName, userPicture, status, icon, className = 'w-10 h-10'}: AvatarProps) => {
    const {t} = useTranslation();

    const [isErrorPhoto, setErrorPhoto] = useState(false);

    return (<div className={classnames('avatar rounded-full flex items-center justify-center relative', className)}>
        {(!userPicture || isErrorPhoto) && !icon &&
            <div className={classnames('avatar-initial', labelClassName)}>
            {!!userFullName ? utils.getInitialsFromFullName(userFullName): t('common.default_avatar')}
            </div>
        }

        {userPicture && !isErrorPhoto &&
            <img src={userPicture} className='w-full h-full rounded-full' alt='user' onError={() => setErrorPhoto(true)} />
        }

        {!!icon && (!userPicture || isErrorPhoto) &&
            <SvgIcon type={icon} fillClass='white-icon'/>
        }

        {status &&
            <div className='absolute bottom-0 right-0'>
                <StatusDot status={status} isBorderAround={true} />
            </div>
        }
    </div>);
}
export default Avatar;
