import {IconProps} from '@icons/icon.models';

export const IconSms = ({pathClass}: IconProps) => {
    return (<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <g data-name='Icon/SMS' transform='translate(6 1)'>
                <rect width='24' height='24' transform='translate(-6 -1)' fill='none' opacity='0.7'/>
                <path
                    d='M10.625,0H1.875A1.875,1.875,0,0,0,0,1.875v16.25A1.875,1.875,0,0,0,1.875,20h8.75A1.875,1.875,0,0,0,12.5,18.125V1.875A1.875,1.875,0,0,0,10.625,0ZM6.25,18.75A1.25,1.25,0,1,1,7.5,17.5,1.249,1.249,0,0,1,6.25,18.75Zm4.375-4.219a.47.47,0,0,1-.469.469H2.344a.47.47,0,0,1-.469-.469V2.344a.47.47,0,0,1,.469-.469h7.813a.47.47,0,0,1,.469.469Z'
                    transform='translate(0 1)' className={pathClass}/>
            </g>
        </svg>
    );
}
