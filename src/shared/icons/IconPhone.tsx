import {IconProps} from '@icons/icon.models';

export const IconPhone = ({pathClass, rectClass}: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" className={rectClass}/>
            <path d="M17.336.854,13.68.011A.849.849,0,0,0,12.713.5L11.025,4.437a.842.842,0,0,0,.243.984L13.4,7.165a13.029,13.029,0,0,1-6.23,6.23l-1.744-2.13a.843.843,0,0,0-.984-.243L.5,12.709a.854.854,0,0,0-.492.97l.844,3.656a.843.843,0,0,0,.823.654A16.31,16.31,0,0,0,17.99,1.677.843.843,0,0,0,17.336.854Z" transform="translate(3.011 3.011)"  className={pathClass}/>
        </svg>
    );
}
