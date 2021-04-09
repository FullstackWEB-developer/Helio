import {IconProps} from '@icons/icon.models';

export const IconTicket = ({pathClass}: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" opacity="0.7"/>
            <path d="M15.561,7.061,8.939.439A1.5,1.5,0,0,0,7.879,0H1.5A1.5,1.5,0,0,0,0,1.5V7.879A1.5,1.5,0,0,0,.439,8.939l6.621,6.621a1.5,1.5,0,0,0,2.121,0l6.379-6.379a1.5,1.5,0,0,0,0-2.121ZM3.5,5A1.5,1.5,0,1,1,5,3.5,1.5,1.5,0,0,1,3.5,5ZM19.561,9.182l-6.379,6.379a1.5,1.5,0,0,1-2.121,0l-.011-.011,5.439-5.439a2.813,2.813,0,0,0,0-3.978L10.356,0h1.523a1.5,1.5,0,0,1,1.061.439l6.621,6.621a1.5,1.5,0,0,1,0,2.121Z" transform="translate(2 4)" className={pathClass}/>
        </svg>
    );
}
