import {IconProps} from '@icons/icon.models';

export const IconChat = ({pathClass, rectClass}: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g id="Icon_Chat" data-name="Icon/Chat" transform="translate(-1178 -24)">
                <rect id="Bound" width="24" height="24" transform="translate(1178 24)" className={rectClass}/>
                <path id="Chat"
                      d="M18.464,44.3a4.781,4.781,0,0,0,1.528-3.409c0-2.777-2.656-5.072-6.117-5.482A7.5,7.5,0,0,0,7.215,32C3.226,32-.007,34.486-.007,37.555a4.793,4.793,0,0,0,1.528,3.409A9.09,9.09,0,0,1,.212,42.87.8.8,0,0,0,.8,44.224a7.98,7.98,0,0,0,4.347-1.347,9.894,9.894,0,0,0,.986.17,7.481,7.481,0,0,0,6.642,3.4,9.19,9.19,0,0,0,2.076-.236,8,8,0,0,0,4.347,1.347.8.8,0,0,0,.583-1.354A8.848,8.848,0,0,1,18.464,44.3Zm-13.637-3.2-.594.385a7.064,7.064,0,0,1-1.5.743c.094-.163.187-.337.278-.514l.538-1.08-.861-.851A3.183,3.183,0,0,1,1.66,37.555c0-2.107,2.545-3.888,5.555-3.888s5.555,1.781,5.555,3.888-2.545,3.888-5.555,3.888a7.565,7.565,0,0,1-1.7-.194l-.687-.156ZM17.294,43.11l-.858.847.538,1.08c.09.177.184.351.278.514a7.065,7.065,0,0,1-1.5-.743l-.594-.385-.691.16a7.565,7.565,0,0,1-1.7.194,6.46,6.46,0,0,1-4.558-1.725c3.517-.375,6.225-2.687,6.225-5.5,0-.118-.014-.233-.024-.347,2.236.5,3.913,1.972,3.913,3.68A3.183,3.183,0,0,1,17.294,43.11Z"
                      transform="translate(1180.007 -4)" className={pathClass}/>
            </g>
        </svg>
    );
}
