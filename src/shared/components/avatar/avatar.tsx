import StatusDot from '@components/status-dot/status-dot';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import utils from '@shared/utils/utils';
import {useState} from 'react';
import classnames from 'classnames';
import './avatar.scss';

export interface AvatarProps {
    userFullName: string;
    className?: string;
    labelClassName?: string;
    userPicture?: string;
    status?: UserStatus;
}

const Avatar = ({userFullName, labelClassName, userPicture, status, className = 'w-10 h-10'}: AvatarProps) => {

    const [isErrorPhoto, setErrorPhoto] = useState(false);

    return (<div className={classnames('avatar rounded-full flex items-center justify-center relative', className)}>
        {(!userPicture || isErrorPhoto) &&
            <div className={classnames('avatar-initial', labelClassName)}>{utils.getInitialsFromFullName(userFullName)}</div>
        }

        {userPicture && !isErrorPhoto &&
            <img src={userPicture} className='w-full h-full rounded-full' alt='user' onError={() => setErrorPhoto(true)} />
        }

        {status &&
            <div className='absolute bottom-0 right-0'>
                <StatusDot status={status} isBorderAround={true} />
            </div>
        }
    </div>);
}
export default Avatar;
