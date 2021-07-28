import {UserStatus} from '../../store/app-user/app-user.models';
import StatusDot from '../status-dot/status-dot';
import classnames from 'classnames';

interface StatusDotLabelProps {
    label?: string;
    status: UserStatus;
    isBorderAround?: boolean;
    className?: string;
}
const StatusDotLabel = ({label, status, isBorderAround, className}: StatusDotLabelProps) => {
    return (
        <div className={classnames('flex flex-row items-center', className)}>
            <StatusDot status={status} isBorderAround={isBorderAround} />
            <span className='body2 ml-1.5'>{label}</span>
        </div>
    );
}

export default StatusDotLabel;
