import { StatusDotModel } from '@components/status-dot/status-dot.model';
import { UserStatus } from '../../store/app-user/app-user.models';
import './status-dot.scss';

export interface StatusDotProps {
    model: StatusDotModel
}

const StatusDot = ({model}: StatusDotProps) => {
    const { status } = model;
    let className;
    if (status) {
        if (status === UserStatus.AfterWork) {
            className = 'fill-yellow';
        } else if (status === UserStatus.Available || status === UserStatus.Routable) {
            className = 'fill-green';
        } else if (status === UserStatus.Busy || status === UserStatus.OnCall) {
            className = 'fill-red';
        } else {
            className = 'fill-gray';
        }
    }

    return (
        <g data-name='Status indicator' transform='translate(1740 42)' stroke='#fff'
           strokeWidth='2' className={className}>
            <circle cx='7' cy='7' r='7' stroke='none'/>
            <circle cx='7' cy='7' r='6' fill='none'/>
        </g>
    );
}

export default StatusDot;
