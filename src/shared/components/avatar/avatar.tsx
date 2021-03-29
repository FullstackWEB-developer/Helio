import { AvatarModel } from './avatar.models';
import StatusDot from '@components/status-dot/status-dot';

export interface AvatarProps {
    model: AvatarModel
}

const Avatar = ({model}: AvatarProps) => {
    const { initials, status } = model;

    return (
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
            <g data-name='Avatar/40px/Letters' transform='translate(-1714 -16)'>
                <circle cx='20' cy='20' r='20' transform='translate(1714 16)' fill='#9e9e9e'/>
                <text transform='translate(1734 40)' fill='#fff'>
                    <tspan x='-9.5' y='3'>{initials}</tspan>
                </text>
                <rect width='14' height='14' transform='translate(1740 42)' fill='none'/>
                {status ?
                    <StatusDot  model={{status: status}}/>
                    : <></>}
            </g>
        </svg>
    );
}

export default Avatar;
