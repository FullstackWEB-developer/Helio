import StatusDot from '@components/status-dot/status-dot';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import utils from '@shared/utils/utils';
import {useState} from 'react';
import classnames from 'classnames';
import './avatar.scss';

export interface AvatarProps {
    userFullName: string;
    className?: string;
    userPhoto?: string;
    status?: UserStatus;
}

const Avatar = ({userFullName, userPhoto, status, className = 'h-10 w-10'}: AvatarProps) => {

    const [isErrorPhoto, setErrorPhoto] = useState(false);

    return (<div className={classnames('avatar rounded-full flex items-center justify-center relative', className)}>
        {(!userPhoto || isErrorPhoto) &&
            <div className='avatar-initial'>{utils.getInitialsFromFullName(userFullName)}</div>
        }

        {userPhoto && !isErrorPhoto &&
            <img src={userPhoto} className='rounded-full h-full w-full' alt='user' onError={() => setErrorPhoto(true)} />
        }

        {status &&
            <div className='absolute bottom-0 right-0'>
                <StatusDot status={status} isBorderAround={true} />
            </div>
        }
    </div>);
}
export default Avatar;
