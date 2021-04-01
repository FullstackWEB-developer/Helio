import {IconProps} from '@icons/icon.models';

export const IconPhone = ({pathClass, rectClass}: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g id="Icon_Phone" data-name="Icon/Phone" transform="translate(-1122 -24)">
                <rect id="Bound" width="24" height="24" transform="translate(1122 24)" className={rectClass}/>
                <path id="Phone"
                      d="M13.481.662,10.637.006a.66.66,0,0,0-.752.38L8.573,3.448a.655.655,0,0,0,.189.766L10.419,5.57a10.134,10.134,0,0,1-4.845,4.845L4.217,8.758a.656.656,0,0,0-.766-.189L.389,9.882a.664.664,0,0,0-.383.755l.656,2.844a.656.656,0,0,0,.64.509A12.686,12.686,0,0,0,13.99,1.3.655.655,0,0,0,13.481.662Z"
                      transform="translate(1127.01 29.011)" className={pathClass}/>
            </g>
        </svg>

    );
}