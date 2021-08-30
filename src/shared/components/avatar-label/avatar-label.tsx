import Avatar from '@shared/components/avatar';
import utils from '@shared/utils/utils';
import classnames from 'classnames';

interface AvatarLabelProps {
    firstName: string;
    lastName: string;
    picture?: string;
    avatarClassName?: string;
    avatarPlaceholderClassName?: string
    labelClassName?: string;
}
const AvatarLabel = ({
    firstName,
    lastName,
    picture,
    avatarClassName,
    avatarPlaceholderClassName,
    labelClassName
}: AvatarLabelProps) => {
    const fullName = utils.stringJoin(' ', firstName, lastName);
    return (
        <div className='flex flex-row items-center'>
            <Avatar
                userFullName={fullName}
                userPicture={picture}
                className={avatarClassName}
                labelClassName={avatarPlaceholderClassName}
            />
            <span className={classnames('ml-4', labelClassName)}>{fullName}</span>
        </div>
    );
}

export default AvatarLabel;
