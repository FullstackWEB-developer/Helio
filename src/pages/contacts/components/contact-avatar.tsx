import {ContactAvatarModel} from '../models/contact-avatar-model';
import './contact-avatar.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
export interface ContactAvatarProps {
    model: ContactAvatarModel
}

const ContactAvatar = ({model}: ContactAvatarProps) => {
    const {initials, className = 'contact-avatar-default', isCompany, iconClassName, iconFillClass, iconType} = model;
    return (
        isCompany && iconType ?
            <div className={`${className} contact-avatar-icon`}>
                <SvgIcon type={iconType} className={`${iconClassName}`} fillClass={`${iconFillClass}`} />
            </div> :
            (
                <svg xmlns='http://www.w3.org/2000/svg' className={className} viewBox='0 0 40 40'>
                    <g data-name='Avatar/40px/Letters' >
                        <circle cx='20' cy='20' r='20' fill='#9e9e9e' />
                        <text fill='#fff' textAnchor='middle' dominantBaseline="middle">
                            <tspan x='50%' y='55%' >{initials}</tspan>
                        </text>
                    </g>
                </svg>
            )
    );
}

export default ContactAvatar;