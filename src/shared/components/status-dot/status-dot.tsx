import {UserStatus} from '../../store/app-user/app-user.models';
import './status-dot.scss';

export interface StatusDotProps {
    status: UserStatus,
    isBorderAround?: boolean,
    enlargedDot?: boolean;
}

const StatusDot = ({status, isBorderAround = false, enlargedDot = false}: StatusDotProps) => {
    let className;
    const size = enlargedDot ? "14" : "10";
    if (status) {
        if (status === UserStatus.AfterWork) {
            className = 'fill-yellow';
        } else if (status === UserStatus.Available || status === UserStatus.Routable) {
            className = 'fill-green';
        } else if (status === UserStatus.Busy || status === UserStatus.OnCall) {
            className = 'fill-red';
        } else if (status === UserStatus.Unread) {
            className = 'fill-blue';
        }
        else {
            className = 'fill-gray';
        }
    }

    if (status === UserStatus.Unread) {
        return (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g data-name='Status indicator with border' stroke='#fff' strokeWidth='2' className={className}>
                    <circle cx="8" cy="8" r="8" stroke='none' />
                    <circle cx="8" cy="8" r="7" fill='none' />
                </g>
            </svg>
        )
    }

    return (isBorderAround ?
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g data-name='Status indicator with border' stroke='#fff' strokeWidth='2' className={className}>
                <circle cx="8" cy="8" r="8" stroke='none' />
                <circle cx="8" cy="8" r="7" fill='none' />
            </g>
        </svg> :
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g data-name='Status indicator' className={className}>
                <circle cx="5" cy="5" r="4" stroke='none' />
            </g>
        </svg>
    );
}

export default StatusDot;