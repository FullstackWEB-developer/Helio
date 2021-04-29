import {AvatarModel} from './avatar.models';
import StatusDot from '@components/status-dot/status-dot';
import './avatar.scss';
export interface AvatarProps {
    model: AvatarModel
}

const Avatar = ({model}: AvatarProps) => {
    const {initials, status, className = 'avatar-default'} = model;
    return (
        <svg xmlns='http://www.w3.org/2000/svg' className={className} viewBox='0 0 40 40'>
            <g data-name='Avatar/40px/Letters' >
                <circle cx='20' cy='20' r='20' fill='#9e9e9e' />
                <text fill='#fff' textAnchor='middle' dominantBaseline="middle">
                    <tspan x='50%' y='55%' >{initials}</tspan>
                </text>
                {status &&
                    <svg>
                        <g transform='translate(30, 30)'>
                            <StatusDot status={status} isBorderAround={true} />
                        </g>
                    </svg>
                }
            </g>
        </svg>
    );
}

export default Avatar;
