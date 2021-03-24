import { AvatarModel } from './avatar.models';
import { UserStatus } from '../../store/app-user/app-user.models';
import './avatar.scss';

export interface AvatarProps {
    model: AvatarModel
}

const Avatar = ({model}: AvatarProps) => {
    const { initials, status } = model;
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
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
            <g data-name='Avatar/40px/Letters' transform='translate(-1714 -16)'>
                <circle cx='20' cy='20' r='20' transform='translate(1714 16)' fill='#9e9e9e'/>
                <text transform='translate(1734 40)' fill='#fff'>
                    <tspan x='-9.5' y='3'>{initials}</tspan>
                </text>
                <rect width='14' height='14' transform='translate(1740 42)' fill='none'/>
                {status ?
                    <g data-name='Status indicator' transform='translate(1740 42)' stroke='#fff'
                       strokeWidth='2' className={className}>
                        <circle cx='7' cy='7' r='7' stroke='none'/>
                        <circle cx='7' cy='7' r='6' fill='none'/>
                    </g>
                    : <></>}
            </g>
        </svg>
    );
}

export default Avatar;
