import {Icon} from '@components/svg-icon/icon';
import Avatar from '@shared/components/avatar';
import utils from '@shared/utils/utils';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next';

interface AvatarLabelProps {
    firstName: string;
    lastName: string;
    picture?: string;
    avatarClassName?: string;
    avatarPlaceholderClassName?: string
    labelClassName?: string;
    icon?: Icon;
}
const AvatarLabel = ({
    firstName,
    lastName,
    picture,
    avatarClassName,
    avatarPlaceholderClassName,
    labelClassName,
    icon
}: AvatarLabelProps) => {
    const {t} = useTranslation();

    const fullName = utils.stringJoin(' ', t(firstName), t(lastName));
    return (
        <div className='flex flex-row items-center'>
            <Avatar
                userFullName={fullName}
                userPicture={picture}
                className={avatarClassName}
                labelClassName={avatarPlaceholderClassName}
                icon={icon}
            />
            <span className={classnames('ml-4', labelClassName)}>{fullName}</span>
        </div>
    );
}

export default AvatarLabel;
