import {Icon} from '@components/svg-icon/icon';
import CwcLogo from '@shared/icons/cwc-logo';
import './svg-icon.scss';
import classNames from 'classnames';
import React from 'react';

export interface SvgIconProps {
    type: Icon,
    className?: string,
    wrapperClassName?: string,
    fillClass?: string,
    strokeClass?: string,
    opacity?: string,
    onClick?: (e: any) => void,
    isLoading?: boolean,
    disabled?: boolean
}

const SvgIcon = ({type, wrapperClassName = '', className = 'icon-medium', fillClass = 'fill-default',
    strokeClass = 'stroke-default', opacity, onClick, isLoading = false, disabled = false}: SvgIconProps) => {

    const mainClass = `${className} ${fillClass ? '' : 'fill-default'}`;

    fillClass = disabled ? 'rgba-025-fill' : fillClass;

    const getIconAdd = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={mainClass}>
            <rect fill='none' />
            <path d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z" className={fillClass} />
        </svg>
    }

    const getIconAddBlack = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill='none' />
            <path d="M12,24A12,12,0,0,1,3.514,3.515,12,12,0,0,1,20.486,20.485,11.922,11.922,0,0,1,12,24ZM5.336,10.667a1.333,1.333,0,1,0,0,2.667h5.33V19a1.333,1.333,0,1,0,2.667,0V13.334h5.331a1.333,1.333,0,1,0,0-2.667H13.333v-5a1.333,1.333,0,1,0-2.667,0v5Z"
                className={fillClass} />
        </svg>
    }

    const getIconAddContact = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect fill='none' width="24" height="24" />
            <path d="M15,12a4,4,0,1,0-4-4A4,4,0,0,0,15,12ZM6,10V7H4v3H1v2H4v3H6V12H9V10Zm9,4c-2.67,0-8,1.34-8,4v2H23V18C23,15.34,17.67,14,15,14Z"
                className={fillClass} />
        </svg>
    }

    const getIconAwsConnect = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 235" version="1.1" preserveAspectRatio="xMidYMid" className={mainClass}>
            <g>
                <path d="M246.7735,71.523 C240.8505,57.487 232.3675,44.902 221.5635,34.119 C199.5105,12.11 170.1585,0 138.8815,0 L138.6405,0 C117.7525,0.041 96.7735,6.078 77.9725,17.457 C60.2255,28.198 45.4255,43.298 36.3005,59.977 C35.5265,61.392 36.0465,63.167 37.4615,63.941 C38.8775,64.715 40.6505,64.195 41.4245,62.78 C50.0625,46.991 64.1165,32.669 80.9965,22.453 C98.8895,11.624 118.8265,5.879 138.6525,5.84 L138.8805,5.84 C168.5985,5.84 196.4885,17.346 217.4385,38.253 C238.5395,59.312 250.1595,87.404 250.1595,117.354 C250.1595,147.14 238.5605,175.143 217.4985,196.205 C196.4365,217.267 168.4335,228.867 138.6465,228.867 C118.8945,228.867 99.4885,223.635 82.5275,213.738 C66.0635,204.131 52.2375,190.375 42.5465,173.958 C41.7265,172.568 39.9355,172.108 38.5465,172.927 C37.1585,173.747 36.6975,175.538 37.5175,176.926 C47.7135,194.2 62.2605,208.674 79.5845,218.783 C97.4375,229.2 117.8605,234.707 138.6465,234.707 C169.9925,234.707 199.4625,222.5 221.6275,200.335 C243.7935,178.169 256.0005,148.7 256.0005,117.354 C256.0005,101.449 252.8965,86.03 246.7735,71.523 M13.6275,84.1368 L50.4945,84.1368 C52.1065,84.1368 53.4145,82.8288 53.4145,81.2168 C53.4145,79.6038 52.1065,78.2968 50.4945,78.2968 L13.6275,78.2968 C12.0145,78.2968 10.7075,79.6038 10.7075,81.2168 C10.7075,82.8288 12.0145,84.1368 13.6275,84.1368 M37.962,119.0567 C37.962,117.4437 36.655,116.1367 35.042,116.1367 L2.92,116.1367 C1.307,116.1367 5.68434189e-14,117.4437 5.68434189e-14,119.0567 C5.68434189e-14,120.6697 1.307,121.9767 2.92,121.9767 L35.042,121.9767 C36.655,121.9767 37.962,120.6697 37.962,119.0567 M50.3727,156.897 C50.3727,155.284 49.0657,153.977 47.4527,153.977 L8.0307,153.977 C6.4177,153.977 5.1107,155.284 5.1107,156.897 C5.1107,158.509 6.4177,159.817 8.0307,159.817 L47.4527,159.817 C49.0657,159.817 50.3727,158.509 50.3727,156.897 M76.3937,95.6573 C77.1597,95.5323 77.8437,95.1083 78.2957,94.4783 C78.7487,93.8483 78.9317,93.0643 78.8047,92.2993 C76.6437,79.2313 78.8317,67.6083 85.1347,58.6843 C90.6757,50.8393 99.2737,45.2853 109.3457,43.0473 C129.2277,38.6293 153.1327,47.6243 160.3517,73.3663 C160.5827,74.1903 161.1637,74.8713 161.9407,75.2293 C162.7177,75.5883 163.6127,75.5873 164.3887,75.2283 C172.4567,71.4993 180.6747,71.2353 187.5327,74.4863 C194.5207,77.7993 199.5977,84.3803 201.8267,93.0183 C202.1117,94.1223 203.0127,94.9593 204.1337,95.1623 C223.1647,98.6063 231.1727,113.1523 230.6667,126.0393 C230.3977,132.8963 227.7787,139.3793 223.2927,144.2923 C218.3107,149.7503 211.2267,153.0963 202.8017,153.9763 L170.6767,153.9763 C169.9387,153.9763 169.2277,154.2563 168.6867,154.7603 L119.7267,200.3473 L119.7267,156.5323 C119.7267,154.9193 118.4187,153.6123 116.8067,153.6123 L77.5227,153.6123 C69.6767,153.0183 62.9697,149.8123 58.1227,144.3363 C53.6957,139.3323 51.0847,132.7273 50.7737,125.7363 C50.4627,118.7583 52.5007,112.0293 56.5117,106.7903 C61.0287,100.8903 67.9037,97.0413 76.3937,95.6573 M44.9387,125.9963 C45.6087,141.0263 55.9917,157.9043 77.2037,159.4443 C77.2737,159.4493 77.3437,159.4523 77.4147,159.4523 L113.8857,159.4523 L113.8857,207.0563 C113.8857,208.2193 114.5757,209.2703 115.6407,209.7343 C116.0157,209.8973 116.4127,209.9773 116.8057,209.9773 C117.5307,209.9773 118.2447,209.7073 118.7957,209.1943 L171.8257,159.8173 L202.9507,159.8173 C203.0487,159.8173 203.1467,159.8123 203.2447,159.8023 C225.3967,157.5673 235.9107,141.3493 236.5027,126.2683 C236.8307,117.8973 234.2167,109.7073 229.1407,103.2053 C223.8577,96.4393 216.2237,91.8213 206.9797,89.7783 C204.0827,80.3033 198.1167,73.0403 190.0337,69.2083 C182.4727,65.6253 173.6887,65.4513 164.9987,68.6563 C160.9047,56.7533 153.1917,47.5293 142.5447,41.8593 C132.1437,36.3213 119.9037,34.7183 108.0787,37.3463 C96.5867,39.9003 86.7437,46.2823 80.3647,55.3153 C73.6227,64.8603 70.9727,76.9573 72.6367,90.4413 C52.6407,94.9793 44.2837,111.2863 44.9387,125.9963 M93.1246,110.542 C97.7536,110.542 101.5206,114.308 101.5206,118.937 C101.5206,123.566 97.7536,127.333 93.1246,127.333 C88.4956,127.333 84.7286,123.566 84.7286,118.937 C84.7286,114.308 88.4956,110.542 93.1246,110.542 M127.1686,85.465 C131.7976,85.465 135.5636,89.231 135.5636,93.86 C135.5636,98.49 131.7976,102.256 127.1686,102.256 C122.5396,102.256 118.7726,98.49 118.7726,93.86 C118.7726,89.231 122.5396,85.465 127.1686,85.465 M155.5226,134.034 C155.5226,138.664 151.7566,142.43 147.1266,142.43 C142.4976,142.43 138.7316,138.664 138.7316,134.034 C138.7316,129.405 142.4976,125.639 147.1266,125.639 C151.7566,125.639 155.5226,129.405 155.5226,134.034 M179.3466,99.833 C183.9756,99.833 187.7416,103.599 187.7416,108.228 C187.7416,112.857 183.9756,116.623 179.3466,116.623 C174.7166,116.623 170.9506,112.857 170.9506,108.228 C170.9506,103.599 174.7166,99.833 179.3466,99.833 M93.1246,133.173 C100.9746,133.173 107.3606,126.787 107.3606,118.937 C107.3606,116.937 106.9436,115.032 106.1956,113.303 L117.4256,104.226 C119.9746,106.623 123.4016,108.096 127.1686,108.096 C127.9336,108.096 128.6836,108.034 129.4166,107.917 L137.0596,123.98 C134.4856,126.557 132.8916,130.113 132.8916,134.034 C132.8916,141.884 139.2776,148.27 147.1266,148.27 C154.9766,148.27 161.3626,141.884 161.3626,134.034 C161.3626,131.646 160.7686,129.394 159.7246,127.415 L170.2926,119.206 C172.7546,121.24 175.9106,122.463 179.3466,122.463 C187.1956,122.463 193.5816,116.078 193.5816,108.228 C193.5816,100.378 187.1956,93.992 179.3466,93.992 C171.4966,93.992 165.1106,100.378 165.1106,108.228 C165.1106,110.536 165.6656,112.715 166.6446,114.645 L155.9986,122.913 C153.5636,120.967 150.4796,119.799 147.1266,119.799 C145.3176,119.799 143.5876,120.142 141.9946,120.76 L134.8836,105.815 C138.8036,103.276 141.4036,98.868 141.4036,93.86 C141.4036,86.011 135.0186,79.625 127.1686,79.625 C119.3186,79.625 112.9326,86.011 112.9326,93.86 C112.9326,95.836 113.3376,97.719 114.0686,99.43 L102.8166,108.524 C100.2736,106.155 96.8666,104.702 93.1246,104.702 C85.2746,104.702 78.8886,111.087 78.8886,118.937 C78.8886,126.787 85.2746,133.173 93.1246,133.173"
                    className={fillClass} />
            </g>
        </svg>
    }

    const getIconAlert = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <rect width="16" height="16" fill="#fff" />
            <path d="M-1371,81h4a2.006,2.006,0,0,1-2,2A2.006,2.006,0,0,1-1371,81Zm-5-1a.945.945,0,0,1-1-1,.945.945,0,0,1,1-1h.5a4.354,4.354,0,0,0,1.5-3V72a4.952,4.952,0,0,1,5-5,4.951,4.951,0,0,1,5,5v3a4.351,4.351,0,0,0,1.5,3h.5a.945.945,0,0,1,1,1,.945.945,0,0,1-1,1Z" transform="translate(1377 -67)"
                className={fillClass} />
        </svg>
    }

    const getIconArrowDown = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M7,14l1.273-1.273L2.545,7,8.273,1.273,7,0,0,7Z" transform="translate(5 16.273) rotate(-90)" className={fillClass} />
        </svg>
    }

    const getIconArrowDownward = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M20,12l-1.41-1.41L13,16.17V4H11V16.17L5.42,10.58,4,12l8,8Z" className={fillClass} />
        </svg>
    }

    const getIconArrowLeft = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" transform="translate(0 24) rotate(-90)" fill="none" />
            <path d="M7,0,8.273,1.273,2.545,7l5.727,5.727L7,14,0,7Z" transform="translate(8 5)" className={fillClass} />
        </svg>
    }

    const getIconArrowRight = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" transform="translate(0 24) rotate(-90)" fill="none" />
            <path d="M7,0,8.273,1.273,2.545,7l5.727,5.727L7,14,0,7Z" transform="translate(16.272 19) rotate(180)" className={fillClass} />
        </svg>
    }

    const getIconArrowBack = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M-1.408,10.085H-19.121l5.32,5.052a1.324,1.324,0,0,1,.419.96,1.324,1.324,0,0,1-.419.96,1.468,1.468,0,0,1-1.01.4,1.468,1.468,0,0,1-1.01-.4l-7.76-7.37a1.311,1.311,0,0,1,0-1.92L-15.822.4A1.463,1.463,0,0,1-14.811,0,1.462,1.462,0,0,1-13.8.4a1.324,1.324,0,0,1,.419.96,1.324,1.324,0,0,1-.419.96l-5.32,5.053H-1.408A1.394,1.394,0,0,1,0,8.727,1.394,1.394,0,0,1-1.408,10.085Z"
                transform="translate(24 3)" className={fillClass} />
        </svg>
    }

    const getIconArrowTrendDown = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M7,10l5,5,5-5Z" className={fillClass} />
        </svg>
    }

    const getIconArrowTrendUp = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M7,10l5,5,5-5Z" transform="translate(24 25) rotate(180)" className={fillClass} />
        </svg>
    }

    const getIconArrowUp = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M7,0,8.273,1.273,2.545,7l5.727,5.727L7,14,0,7Z" transform="translate(19 8) rotate(90)"
                className={fillClass} />
        </svg>
    }

    const getIconArrowUpward = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M20,12l-1.41-1.41L13,16.17V4H11V16.17L5.42,10.58,4,12l8,8Z"
                transform="translate(24 24) rotate(180)" className={fillClass} />
        </svg>
    }

    const getIconAthena = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24"
            viewBox="0 0 24 24" className={mainClass}>
            <defs>
                <pattern id="a" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 84 79">
                    <image width="84" height="79"
                        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABPCAQAAADfcyoSAAAACXBIWXMAABYlAAAWJQFJUiTwAAAGVGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxMDAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxMDAiIGV4aWY6VXNlckNvbW1lbnQ9IlNjcmVlbnNob3QiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTExLTIyVDEzOjQzOjQ5LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMS0yMlQyMjozMjo0MC0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMS0yMlQyMjozMjo0MC0wODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTVlMmYwZDQtYTdhMi00MWY3LTgzYjktY2EzMTAyN2U1OGI2IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6M2UzZTJmNWUtOWNhNC0zZDRiLTkxMGEtZGYzMzJiNGU2MmYxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Njg4ZTY2YTMtMWEzZi00ZmU3LWJmMzEtMDFkNGY4NTU0YmI3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Njg4ZTY2YTMtMWEzZi00ZmU3LWJmMzEtMDFkNGY4NTU0YmI3IiBzdEV2dDp3aGVuPSIyMDIwLTExLTIyVDIyOjMyOjQwLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTVlMmYwZDQtYTdhMi00MWY3LTgzYjktY2EzMTAyN2U1OGI2IiBzdEV2dDp3aGVuPSIyMDIwLTExLTIyVDIyOjMyOjQwLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz75ZLb7AAAGa0lEQVRo3u1b+09TdxRvlhCzmJBliTFLzLKYEGJizDltgYFYYFjrAyvTEI0PZDrGJIpzPjAM3AbDMFbJGME5hqmIXVzXpF7PMp3LzHR/2NkPl8v9vm65hbZeM/INtKWnt597np9zvl9CHHo9Vmgd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" />
                </pattern>
            </defs>
            <rect width="24" height="24" fill="none" />
            <rect width="24" height="23" opacity={opacity} fill="url(#a)" />
        </svg>
    }

    const getIconBot = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <path d="M0,0H24V24H0Z" fill="none" />
            <path
                d="M5.333,15a.836.836,0,0,0,.833.833H7V18.75a1.25,1.25,0,1,0,2.5,0V15.833h1.667V18.75a1.25,1.25,0,0,0,2.5,0V15.833H14.5A.836.836,0,0,0,15.333,15V6.667h-10ZM3.25,6.667A1.248,1.248,0,0,0,2,7.917V13.75a1.25,1.25,0,1,0,2.5,0V7.917A1.248,1.248,0,0,0,3.25,6.667Zm14.167,0a1.248,1.248,0,0,0-1.25,1.25V13.75a1.25,1.25,0,0,0,2.5,0V7.917A1.248,1.248,0,0,0,17.417,6.667ZM13.275,1.8,14.358.717a.413.413,0,0,0,0-.592.413.413,0,0,0-.592,0L12.533,1.358a4.866,4.866,0,0,0-2.2-.525,4.936,4.936,0,0,0-2.217.525L6.875.125a.413.413,0,0,0-.592,0,.413.413,0,0,0,0,.592L7.375,1.808A4.986,4.986,0,0,0,5.333,5.833h10A4.971,4.971,0,0,0,13.275,1.8ZM8.667,4.167H7.833V3.333h.833Zm4.167,0H12V3.333h.833Z"
                transform="translate(2 2)" className={fillClass} />
        </svg>
    }

    const getIconCalendar = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M15.625,2.5H13.75V.469A.47.47,0,0,0,13.281,0H11.719a.47.47,0,0,0-.469.469V2.5h-5V.469A.47.47,0,0,0,5.781,0H4.219A.47.47,0,0,0,3.75.469V2.5H1.875A1.875,1.875,0,0,0,0,4.375v13.75A1.875,1.875,0,0,0,1.875,20h13.75A1.875,1.875,0,0,0,17.5,18.125V4.375A1.875,1.875,0,0,0,15.625,2.5Zm-.234,15.625H2.109a.235.235,0,0,1-.234-.234V6.25h13.75V17.891A.235.235,0,0,1,15.391,18.125Z"
                transform="translate(3 2)" className={fillClass} />
        </svg>
    }

    const getIconCcp = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" opacity="0.7" />
            <g transform="translate(4 4)" fill="none">
                <path d="M20,0A20,20,0,1,1,0,20,20,20,0,0,1,20,0Z" stroke="none" />
                <path
                    d="M 20 1 C 17.43457984924316 1 14.94642066955566 1.502220153808594 12.60465049743652 2.492698669433594 C 10.34226036071777 3.449611663818359 8.310220718383789 4.819721221923828 6.564968109130859 6.564968109130859 C 4.819721221923828 8.310220718383789 3.449611663818359 10.34226036071777 2.492698669433594 12.60465049743652 C 1.502220153808594 14.94642066955566 1 17.43457984924316 1 20 C 1 22.56542015075684 1.502220153808594 25.05358123779297 2.492698669433594 27.39535140991211 C 3.449611663818359 29.65773963928223 4.819721221923828 31.68978118896484 6.564968109130859 33.43502807617188 C 8.310220718383789 35.18027877807617 10.34226036071777 36.55038833618164 12.60465049743652 37.50730133056641 C 14.94642066955566 38.49777984619141 17.43457984924316 39 20 39 C 22.56542015075684 39 25.05358123779297 38.49777984619141 27.39535140991211 37.50730133056641 C 29.65773963928223 36.55038833618164 31.68978118896484 35.18027877807617 33.43502807617188 33.43502807617188 C 35.18027877807617 31.68978118896484 36.55038833618164 29.65773963928223 37.50730133056641 27.39535140991211 C 38.49777984619141 25.05358123779297 39 22.56542015075684 39 20 C 39 17.43457984924316 38.49777984619141 14.94642066955566 37.50730133056641 12.60465049743652 C 36.55038833618164 10.34226036071777 35.18027877807617 8.310220718383789 33.43502807617188 6.564968109130859 C 31.68978118896484 4.819721221923828 29.65773963928223 3.449611663818359 27.39535140991211 2.492698669433594 C 25.05358123779297 1.502220153808594 22.56542015075684 1 20 1 M 20 0 C 31.04568862915039 0 40 8.954309463500977 40 20 C 40 31.04568862915039 31.04568862915039 40 20 40 C 8.954309463500977 40 0 31.04568862915039 0 20 C 0 8.954309463500977 8.954309463500977 0 20 0 Z"
                    stroke="none" className={fillClass} />
            </g>
            <path
                d="M12,1a9,9,0,0,0-9,9v7a3,3,0,0,0,3,3H9V12H5V10a7,7,0,0,1,14,0v2H15v8h4v1H12v2h6a3,3,0,0,0,3-3V10A9,9,0,0,0,12,1Z"
                transform="translate(12 11)" className={fillClass} />
        </svg>
    }

    const getIconChannelChat = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <g transform="translate(12 12)">
                <rect width="24" height="24" fill="none" />
                <path
                    d="M18.464,44.3a4.781,4.781,0,0,0,1.528-3.409c0-2.777-2.656-5.072-6.117-5.482A7.5,7.5,0,0,0,7.215,32C3.226,32-.007,34.486-.007,37.555a4.793,4.793,0,0,0,1.528,3.409A9.09,9.09,0,0,1,.212,42.87.8.8,0,0,0,.8,44.224a7.98,7.98,0,0,0,4.347-1.347,9.894,9.894,0,0,0,.986.17,7.481,7.481,0,0,0,6.642,3.4,9.19,9.19,0,0,0,2.076-.236,8,8,0,0,0,4.347,1.347.8.8,0,0,0,.583-1.354A8.848,8.848,0,0,1,18.464,44.3Zm-13.637-3.2-.594.385a7.064,7.064,0,0,1-1.5.743c.094-.163.187-.337.278-.514l.538-1.08-.861-.851A3.183,3.183,0,0,1,1.66,37.555c0-2.107,2.545-3.888,5.555-3.888s5.555,1.781,5.555,3.888-2.545,3.888-5.555,3.888a7.565,7.565,0,0,1-1.7-.194l-.687-.156ZM17.294,43.11l-.858.847.538,1.08c.09.177.184.351.278.514a7.065,7.065,0,0,1-1.5-.743l-.594-.385-.691.16a7.565,7.565,0,0,1-1.7.194,6.46,6.46,0,0,1-4.558-1.725c3.517-.375,6.225-2.687,6.225-5.5,0-.118-.014-.233-.024-.347,2.236.5,3.913,1.972,3.913,3.68A3.183,3.183,0,0,1,17.294,43.11Z"
                    transform="translate(2.007 -28)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconChannelEmail = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <g transform="translate(12.334 12)">
                <rect width="24" height="24" transform="translate(-0.334)" fill="none" />
                <path
                    d="M18.125,64H1.875A1.875,1.875,0,0,0,0,65.875v11.25A1.875,1.875,0,0,0,1.875,79h16.25A1.875,1.875,0,0,0,20,77.125V65.875A1.875,1.875,0,0,0,18.125,64Zm0,1.875v1.594c-.876.713-2.272,1.822-5.257,4.16-.658.517-1.961,1.761-2.868,1.746-.907.015-2.21-1.229-2.868-1.746-2.985-2.337-4.381-3.446-5.257-4.16V65.875ZM1.875,77.125v-7.25c.9.713,2.164,1.713,4.1,3.228.854.672,2.349,2.156,4.026,2.147,1.669.009,3.145-1.453,4.026-2.146,1.935-1.515,3.2-2.516,4.1-3.229v7.25Z"
                    transform="translate(2 -59)" className={fillClass} />
            </g>
        </svg>
    }
    const getIconChannelPhone = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <path
                d="M17.978.886,14.187.011a.881.881,0,0,0-1,.507L11.434,4.6a.873.873,0,0,0,.252,1.021l2.209,1.808a13.512,13.512,0,0,1-6.46,6.46L5.626,11.682a.874.874,0,0,0-1.021-.252L.522,13.18a.885.885,0,0,0-.51,1.006l.875,3.792a.875.875,0,0,0,.853.678A16.914,16.914,0,0,0,18.656,1.74.874.874,0,0,0,17.978.886Z"
                transform="translate(14.677 14.677)" className={fillClass} />
        </svg>
    }

    const getIconChannelSms = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <g transform="translate(12.08 12)">
                <rect width="24" height="24" transform="translate(-0.08)" fill="none" />
                <path
                    d="M10.625,0H1.875A1.875,1.875,0,0,0,0,1.875v16.25A1.875,1.875,0,0,0,1.875,20h8.75A1.875,1.875,0,0,0,12.5,18.125V1.875A1.875,1.875,0,0,0,10.625,0ZM6.25,18.75A1.25,1.25,0,1,1,7.5,17.5,1.249,1.249,0,0,1,6.25,18.75Zm4.375-4.219a.47.47,0,0,1-.469.469H2.344a.47.47,0,0,1-.469-.469V2.344a.47.47,0,0,1,.469-.469h7.812a.47.47,0,0,1,.469.469Z"
                    transform="translate(6 2)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconChannelWeb = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <g transform="translate(12.334 12)">
                <rect width="24" height="24" transform="translate(-0.334)" fill="none" />
                <path
                    d="M10,12.516C9.567,9.863,8.551,8,7.369,8s-2.2,1.863-2.63,4.516ZM4.516,15.369a18.623,18.623,0,0,0,.1,1.9H10.12a18.623,18.623,0,0,0,.1-1.9,18.623,18.623,0,0,0-.1-1.9H4.614A18.623,18.623,0,0,0,4.516,15.369Zm9.648-2.852A7.384,7.384,0,0,0,9.469,8.309a10.028,10.028,0,0,1,1.486,4.207Zm-8.9-4.207A7.379,7.379,0,0,0,.573,12.516H3.782A9.987,9.987,0,0,1,5.265,8.309Zm9.217,5.158H11.074c.062.624.1,1.263.1,1.9s-.036,1.278-.1,1.9h3.405a7.305,7.305,0,0,0,.256-1.9,7.433,7.433,0,0,0-.253-1.9Zm-10.916,1.9c0-.639.036-1.278.1-1.9H.256a7.2,7.2,0,0,0,0,3.8H3.661C3.6,16.646,3.565,16.007,3.565,15.369Zm1.174,2.852c.431,2.653,1.447,4.516,2.63,4.516s2.2-1.863,2.63-4.516Zm4.733,4.207a7.391,7.391,0,0,0,4.695-4.207H10.958A10.028,10.028,0,0,1,9.472,22.428Zm-8.9-4.207a7.384,7.384,0,0,0,4.695,4.207,10.028,10.028,0,0,1-1.486-4.207H.573Z"
                    transform="translate(4.666 -3)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconChat = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M18.464,44.3a4.781,4.781,0,0,0,1.528-3.409c0-2.777-2.656-5.072-6.117-5.482A7.5,7.5,0,0,0,7.215,32C3.226,32-.007,34.486-.007,37.555a4.793,4.793,0,0,0,1.528,3.409A9.09,9.09,0,0,1,.212,42.87.8.8,0,0,0,.8,44.224a7.98,7.98,0,0,0,4.347-1.347,9.894,9.894,0,0,0,.986.17,7.481,7.481,0,0,0,6.642,3.4,9.19,9.19,0,0,0,2.076-.236,8,8,0,0,0,4.347,1.347.8.8,0,0,0,.583-1.354A8.848,8.848,0,0,1,18.464,44.3Zm-13.637-3.2-.594.385a7.064,7.064,0,0,1-1.5.743c.094-.163.187-.337.278-.514l.538-1.08-.861-.851A3.183,3.183,0,0,1,1.66,37.555c0-2.107,2.545-3.888,5.555-3.888s5.555,1.781,5.555,3.888-2.545,3.888-5.555,3.888a7.565,7.565,0,0,1-1.7-.194l-.687-.156ZM17.294,43.11l-.858.847.538,1.08c.09.177.184.351.278.514a7.065,7.065,0,0,1-1.5-.743l-.594-.385-.691.16a7.565,7.565,0,0,1-1.7.194,6.46,6.46,0,0,1-4.558-1.725c3.517-.375,6.225-2.687,6.225-5.5,0-.118-.014-.233-.024-.347,2.236.5,3.913,1.972,3.913,3.68A3.183,3.183,0,0,1,17.294,43.11Z"
                transform="translate(2.007 -28)" className={fillClass} />
        </svg>
    }

    const getIconCheckmarkOutline = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M3.525,20.475a11.985,11.985,0,1,1,16.95-16.95,11.985,11.985,0,1,1-16.95,16.95ZM4.585,4.585A10.487,10.487,0,1,0,19.416,19.416,10.487,10.487,0,1,0,4.585,4.585ZM6,13.116l1.091-1.157,2.571,2.728L16.909,7,18,8.157,9.662,17Z"
                className={fillClass} />
        </svg>
    }

    const getIconClear = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(-889 -16)">
                <rect width="24" height="24" transform="translate(889 16)" fill="none" />
                <path
                    d="M12,2A10,10,0,1,0,22,12,9.991,9.991,0,0,0,12,2Zm5,13.59L15.59,17,12,13.41,8.41,17,7,15.59,10.59,12,7,8.41,8.41,7,12,10.59,15.59,7,17,8.41,13.41,12Z"
                    transform="translate(889 16)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconClose = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M16,1.409,14.591,0,8,6.566,1.409,0,0,1.409,6.566,8,0,14.591,1.409,16,8,9.434,14.591,16,16,14.591,9.434,8Z" transform="translate(4 4)"
                className={fillClass} />
        </svg>
    }

    const getIconCompany = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M12,7V3H2V21H22V7ZM6,19H4V17H6Zm0-4H4V13H6Zm0-4H4V9H6ZM6,7H4V5H6Zm4,12H8V17h2Zm0-4H8V13h2Zm0-4H8V9h2Zm0-4H8V5h2ZM20,19H12V17h2V15H12V13h2V11H12V9h8Zm-2-8H16v2h2Zm0,4H16v2h2Z"
                className={fillClass} />
        </svg>
    }

    const getIconContacts = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M17.028,6.249A.47.47,0,0,0,17.5,5.78V4.218a.47.47,0,0,0-.469-.469h-.781V1.875A1.875,1.875,0,0,0,14.372,0H1.875A1.875,1.875,0,0,0,0,1.875V18.121A1.875,1.875,0,0,0,1.875,20h12.5a1.875,1.875,0,0,0,1.875-1.875V16.247h.781a.47.47,0,0,0,.469-.469V14.216a.47.47,0,0,0-.469-.469h-.781v-2.5h.781a.47.47,0,0,0,.469-.469V9.217a.47.47,0,0,0-.469-.469h-.781v-2.5ZM14.372,18.121H1.875V1.875h12.5ZM8.123,10a2.5,2.5,0,1,0-2.5-2.5A2.5,2.5,0,0,0,8.123,10Zm-3.5,5h7a.819.819,0,0,0,.875-.75V13.5a2.459,2.459,0,0,0-2.624-2.25,9.429,9.429,0,0,1-1.75.312,9.292,9.292,0,0,1-1.75-.312A2.459,2.459,0,0,0,3.749,13.5v.75A.819.819,0,0,0,4.624,15Z"
                transform="translate(3 2)" className={fillClass} />
        </svg>
    }

    const getIconDashboard = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" opacity="0.7" />
            <g transform="translate(4 4)">
                <path
                    d="M13,16a.945.945,0,0,1-1-1V6a.945.945,0,0,1,1-1h2a.945.945,0,0,1,1,1v9a.945.945,0,0,1-1,1ZM7,16a.944.944,0,0,1-1-1V1A.945.945,0,0,1,7,0H9a.945.945,0,0,1,1,1V15a.944.944,0,0,1-1,1ZM1,16a.945.945,0,0,1-1-1V11a.945.945,0,0,1,1-1H3a.946.946,0,0,1,1,1v4a.945.945,0,0,1-1,1Z"
                    transform="translate(0 0)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconDownload = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M19,9H15V3H9V9H5l7,7ZM5,18v2H19V18Z" transform="translate(0 1)" className={fillClass} />
        </svg>
    }

    const getIconDelete = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(-1749 -527)">
                <rect width="24" height="24" transform="translate(1749 527)" fill="none" opacity="0.24" />
                <path d="M6,19a2.006,2.006,0,0,0,2,2h8a2.006,2.006,0,0,0,2-2V7H6ZM19,4H15.5l-1-1h-5l-1,1H5V6H19Z"
                    transform="translate(1749 527)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconDeleteCircled = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <g transform="translate(12.08 12)">
                <rect width="24" height="24" transform="translate(-0.08)" fill="none" />
                <path
                    d="M6,19a2.006,2.006,0,0,0,2,2h8a2.006,2.006,0,0,0,2-2V7H6ZM19,4H15.5l-1-1h-5l-1,1H5V6H19Z"
                    className={fillClass} />
            </g>
        </svg>
    }

    const getIconEdit = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <path d="M0,0H24V24H0Z" fill="none" />
            <path
                d="M3,15.665V19H6.333l9.83-9.83L12.83,5.835ZM18.74,6.59a.885.885,0,0,0,0-1.253l-2.08-2.08a.885.885,0,0,0-1.253,0L13.781,4.884l3.333,3.333L18.74,6.59Z"
                transform="translate(1 1)" className={fillClass} />
        </svg>
    }

    const getIconEditCircled = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <g transform="translate(12.08 12)">
                <rect width="24" height="24" transform="translate(-0.08)" fill="none" />
                <path
                    d="M3,15.665V19H6.333l9.83-9.83L12.83,5.835ZM18.74,6.59a.885.885,0,0,0,0-1.253l-2.08-2.08a.885.885,0,0,0-1.253,0L13.781,4.884l3.333,3.333L18.74,6.59Z"
                    transform="translate(1 1)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconEmail = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" opacity="0.7" />
            <path
                d="M18.125,64H1.875A1.875,1.875,0,0,0,0,65.875v11.25A1.875,1.875,0,0,0,1.875,79h16.25A1.875,1.875,0,0,0,20,77.125V65.875A1.875,1.875,0,0,0,18.125,64Zm0,1.875v1.594c-.876.713-2.272,1.822-5.257,4.16-.658.517-1.961,1.761-2.868,1.746-.907.015-2.21-1.229-2.868-1.746-2.985-2.337-4.381-3.446-5.257-4.16V65.875ZM1.875,77.125v-7.25c.9.713,2.164,1.713,4.1,3.228.854.672,2.349,2.156,4.026,2.147,1.669.009,3.145-1.453,4.026-2.146,1.935-1.515,3.2-2.516,4.1-3.229v7.25Z"
                transform="translate(2 -59)" className={fillClass} />
        </svg>
    }

    const getIconError = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M11,15h2v2H11Zm0-8h2v6H11Zm.99-5A10,10,0,1,0,22,12,10,10,0,0,0,11.99,2ZM12,20a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                className={fillClass} />
        </svg>
    }

    const getIconFilter = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M17.156,0H.845a.844.844,0,0,0-.6,1.44l6.5,6.5v7.244a.844.844,0,0,0,.36.691l2.813,1.968a.844.844,0,0,0,1.328-.691V7.943l6.5-6.5A.844.844,0,0,0,17.156,0Z"
                transform="translate(3 3)" className={fillClass} />
        </svg>
    }

    const getIconFilterList = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M10,18h4V16H10ZM3,6V8H21V6Zm3,7H18V11H6Z" className={fillClass} />
        </svg>
    }

    const getIconInfo = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M10,20A10,10,0,0,1,2.928,2.929,10,10,0,0,1,17.072,17.071,9.935,9.935,0,0,1,10,20ZM9.988,7.778a1.028,1.028,0,0,0-1.1,1.142v5.473a1.163,1.163,0,0,0,.305.862,1.085,1.085,0,0,0,.793.3,1.145,1.145,0,0,0,.806-.295,1.131,1.131,0,0,0,.317-.868V8.863a1.029,1.029,0,0,0-.317-.8A1.164,1.164,0,0,0,9.988,7.778Zm.025-3.333a1.144,1.144,0,0,0-.786.305,1,1,0,0,0-.337.777,1.012,1.012,0,0,0,.329.806,1.179,1.179,0,0,0,.794.285,1.132,1.132,0,0,0,.773-.29,1.02,1.02,0,0,0,.326-.8.992.992,0,0,0-.334-.806A1.171,1.171,0,0,0,10.012,4.444Z"
                transform="translate(2 2)" className={fillClass} />
        </svg>
    }

    const getIconLocation = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" opacity="0.7" />
            <g transform="translate(7.875 8.015)">
                <path
                    d="M28.3,12.068c.23,6.906-7.135,16.979-12.083,20.14C11.272,29.047,3.791,19.319,4.136,12.068a12.083,12.083,0,1,1,24.167,0Z"
                    fill="#3f3b3b" className={fillClass} />
                <path d="M22.517,11.065a6.042,6.042,0,1,1-6.043-6.041A6.042,6.042,0,0,1,22.517,11.065Z"
                    transform="translate(0.032 0.025)" fill="#fff" className={fillClass} />
            </g>
        </svg>
    }

    const getIconMenu = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M604-1400h18v-2H604Zm0-5h18v-2H604Zm0-7v2h18v-2Z" transform="translate(-601 1418)"
                className={fillClass} />
        </svg>
    }

    const getIconMoreVert = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(-416 -52)">
                <rect width="24" height="24" transform="translate(416 52)" fill="none" />
                <path
                    d="M12,8a2,2,0,1,0-2-2A2.006,2.006,0,0,0,12,8Zm0,2a2,2,0,1,0,2,2A2.006,2.006,0,0,0,12,10Zm0,6a2,2,0,1,0,2,2A2.006,2.006,0,0,0,12,16Z"
                    transform="translate(416 52)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconMyProfile = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <g transform="translate(0 -8)">
                <path d="M0,0H16V16H0Z" transform="translate(0 8)" fill="none" />
                <g transform="translate(-2 6.283)">
                    <g transform="translate(2 4)">
                        <circle cx="3.5" cy="3.5" r="3.5" transform="translate(4 -1.283)" />
                        <path
                            d="M9,13.016C8.818,13.008,8.64,13,8.455,13a10.389,10.389,0,0,0-5.333,1.468A2.358,2.358,0,0,0,2,16.51v2.138H9.472a5.618,5.618,0,0,1-1.017-3.227A5.706,5.706,0,0,1,9,13.016Z"
                            transform="translate(-2 -5.738)" className={fillClass} />
                        <path
                            d="M19.093,15.034a3.5,3.5,0,0,0-.048-.508l.92-.815-.807-1.4-1.17.4a2.942,2.942,0,0,0-.871-.508L16.874,11H15.26l-.242,1.2a2.942,2.942,0,0,0-.871.508l-1.17-.4-.807,1.4.92.815a3.5,3.5,0,0,0-.048.508,3.5,3.5,0,0,0,.048.508l-.92.815.807,1.4,1.17-.4a2.942,2.942,0,0,0,.871.508l.242,1.2h1.614l.242-1.2a2.942,2.942,0,0,0,.871-.508l1.17.4.807-1.4-.92-.815A3.5,3.5,0,0,0,19.093,15.034Zm-3.026,1.614a1.614,1.614,0,1,1,1.614-1.614A1.618,1.618,0,0,1,16.067,16.648Z"
                            transform="translate(-3.964 -5.352)" className={fillClass} />
                    </g>
                </g>
            </g>
        </svg>
    }

    const getIconMyStats = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <g transform="translate(-55 -30)">
                <path d="M0,0H16V16H0Z" transform="translate(55 30)" fill="none" />
                <path
                    d="M15.444,3H4.556A1.56,1.56,0,0,0,3,4.556V15.444A1.56,1.56,0,0,0,4.556,17H15.444A1.56,1.56,0,0,0,17,15.444V4.556A1.56,1.56,0,0,0,15.444,3ZM7.667,13.889H6.111V10H7.667Zm3.111,0H9.222V11.556h1.556Zm0-3.889H9.222V8.444h1.556Zm3.111,3.889H12.333V6.111h1.556Z"
                    transform="translate(53 28)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconNote = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <path d="M0,0H24V24H0Z" fill="none" />
            <path
                d="M13.979,2.985l3.132,3.132a.34.34,0,0,1,0,.479L9.528,14.18l-3.222.358a.675.675,0,0,1-.747-.747l.358-3.222L13.5,2.985a.339.339,0,0,1,.479,0Zm5.625-.8L17.91.5a1.358,1.358,0,0,0-1.917,0L14.764,1.725a.34.34,0,0,0,0,.479L17.9,5.336a.339.339,0,0,0,.479,0L19.6,4.107a1.358,1.358,0,0,0,0-1.917Zm-6.271,9.927v3.535H2.222V4.541H10.2a.427.427,0,0,0,.3-.122l1.389-1.389a.417.417,0,0,0-.3-.712H1.667A1.667,1.667,0,0,0,0,3.985V16.208a1.667,1.667,0,0,0,1.667,1.667H13.889a1.667,1.667,0,0,0,1.667-1.667V10.728a.417.417,0,0,0-.712-.3l-1.389,1.389A.427.427,0,0,0,13.333,12.117Z"
                transform="translate(2 2.9)" className={fillClass} />
        </svg>
    }

    const getIconOffice365 = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24"
            viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <image id="MSLogo" width="22" height="22" transform="translate(1 1)" opacity={opacity}
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTItMDlUMDg6NDk6MTQtMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTEyLTA5VDA4OjU4OjIzLTA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEyLTA5VDA4OjU4OjIzLTA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozYmNmN2VjOC01ZDU5LTQzYTctYmZjNy1hYzlhNzZjMjJiYzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowN2FmZmYxYy0xOTRlLTY4NDMtYWQ4My1jMDhiNjBmMzYzNzciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowM2QwOTBlOC0wODk4LTQzNTAtOWFlMi0wMTQzYjQ4Njc1MjgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAzZDA5MGU4LTA4OTgtNDM1MC05YWUyLTAxNDNiNDg2NzUyOCIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0wOVQwODo0OToxNC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiY2Y3ZWM4LTVkNTktNDNhNy1iZmM3LWFjOWE3NmMyMmJjNCIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0wOVQwODo1ODoyMy0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wp5iowAADC9JREFUeNrdm2lsHOUZx3/vzO76jB17nQQQhyBUJpRQAiQ9qFpQqNoK1IiKS2oRiEqImkJTKtRCW6DlaFU+9UPpl0pIDZSEEI6UJoASEshBgIISJ4QATYKDkzgmjuP1eu95n37Ya2Z2Zj279obQkdY7np3def7P83/OdyYkfLG3EP+vAC5AcxozSCIIGgEMsgiaEBE0mmzhuCDkEASFYAIZkgj6G3Kp7iUU/2/n9vveuDg9wDiKVjQxQmgUHYyRIYwmxwyyTGCi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" />
        </svg>
    }

    const getIconPatientChart = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path id="Path_2039" data-name="Path 2039" d="M13.17,4,18,8.83V20H6V4h7.17M14,2H6A2.006,2.006,0,0,0,4,4V20a2.006,2.006,0,0,0,2,2H18a2.006,2.006,0,0,0,2-2V8L14,2ZM12,14a2,2,0,1,0-2-2A2.006,2.006,0,0,0,12,14Zm4,3.43a2.011,2.011,0,0,0-1.22-1.85,6.952,6.952,0,0,0-5.56,0A2.011,2.011,0,0,0,8,17.43V18h8Z"
                className={fillClass} />
        </svg>
    }

    const getIconPatients = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <g transform="translate(0 -4)">
                <rect width="16" height="16" transform="translate(0 4)" fill="none" />
                <g transform="translate(-2 2.861)">
                    <circle cx="3.5" cy="3.5" r="3.5" transform="translate(5.559 2.139)" />
                    <path d="M8.078,14.009C6.091,13.936,2,14.926,2,16.913v1.456H8.944A4.331,4.331,0,0,1,8.078,14.009Z"
                        transform="translate(1 -2.686)" className={fillClass} />
                    <path
                        d="M17.409,16.382a2.813,2.813,0,0,0,.415-1.47,2.912,2.912,0,1,0-2.912,2.912,2.882,2.882,0,0,0,1.47-.415l1.871,1.871,1.026-1.026Zm-2.5-.015a1.456,1.456,0,1,1,1.456-1.456A1.46,1.46,0,0,1,14.912,16.368Z"
                        transform="translate(-1.721 -2.141)" className={fillClass} />
                </g>
            </g>
        </svg>
    }

    const getIconPlaceholder = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <rect width="16" height="16" fill="#eaeaea" className={fillClass} />
        </svg>
    }

    const getIconPlay = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM10,16.5v-9L16,12Z" className={fillClass} />
        </svg>
    }

    const getIconPrint = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className={mainClass}>
            <rect width="32" height="32" fill="none" />
            <path d="M26.667,12.667H8a4,4,0,0,0-4,4v8H9.333V30h16V24.667h5.333v-8A4,4,0,0,0,26.667,12.667Zm-4,14.667H12V20.667H22.667Zm4-9.333A1.333,1.333,0,1,1,28,16.667,1.329,1.329,0,0,1,26.667,18ZM25.333,6h-16v5.333h16Z" transform="translate(-1.333 -2)" className={fillClass} />
        </svg>
    }

    const getIconPhone = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M17.336.854,13.68.011A.849.849,0,0,0,12.713.5L11.025,4.437a.842.842,0,0,0,.243.984L13.4,7.165a13.029,13.029,0,0,1-6.23,6.23l-1.744-2.13a.843.843,0,0,0-.984-.243L.5,12.709a.854.854,0,0,0-.492.97l.844,3.656a.843.843,0,0,0,.823.654A16.31,16.31,0,0,0,17.99,1.677.843.843,0,0,0,17.336.854Z"
                transform="translate(3.011 3.011)" className={fillClass} />
        </svg>
    }

    const getIconRatingDissatisfied = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <circle cx="1.5" cy="1.5" r="1.5" transform="translate(14 8)" className={fillClass} />
            <circle cx="1.5" cy="1.5" r="1.5" transform="translate(7 8)" className={fillClass} />
            <path
                d="M12,2A10,10,0,1,0,22,12,10.029,10.029,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.024,8.024,0,0,1,12,20Zm0-6a5.426,5.426,0,0,0-5.1,3.5H8.6a3.994,3.994,0,0,1,3.4-2,3.871,3.871,0,0,1,3.4,2h1.7A5.426,5.426,0,0,0,12,14Z"
                className={fillClass} />
        </svg>
    }

    const getIconRatingSatisfied = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <circle cx="1.5" cy="1.5" r="1.5" transform="translate(14 8)" className={fillClass} />
            <circle cx="1.5" cy="1.5" r="1.5" transform="translate(7 8)" className={fillClass} />
            <path
                d="M11.99,2A10,10,0,1,0,22,12,10,10,0,0,0,11.99,2ZM12,20a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm0-4a3.8,3.8,0,0,1-1.96-.52c-.12.14-.86.98-1.01,1.15a5.5,5.5,0,0,0,5.95-.01c-.97-1.09-.01-.02-1.01-1.15A3.775,3.775,0,0,1,12,16Z"
                className={fillClass} />
        </svg>
    }

    const getIconRatingVerySatisfied = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <circle cx="1.5" cy="1.5" r="1.5" transform="translate(14 8)" className={fillClass} />
            <circle cx="1.5" cy="1.5" r="1.5" transform="translate(7 8)" className={fillClass} />
            <path
                d="M11.99,2A10,10,0,1,0,22,12,10,10,0,0,0,11.99,2ZM12,20a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM7,14a5.458,5.458,0,0,0,5,4,5.458,5.458,0,0,0,5-4Z"
                className={fillClass} />
        </svg>
    }

    const getIconRefresh = () => {
        return <svg id="Icon_Refresh_24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            className={mainClass}>
            <rect id="Rectangle" width="24" height="24" fill="none" />
            <path id="ic_refresh_24px"
                d="M17.65,6.35A8,8,0,1,0,19.73,14H17.65A6,6,0,1,1,12,6a5.915,5.915,0,0,1,4.22,1.78L13,11h7V4Z"
                transform="translate(-0.01)" className={fillClass} />
        </svg>
    }

    const getIconSave = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(-971 -295)">
                <path d="M0,0H24V24H0Z" transform="translate(971 295)" fill="none" />
                <path
                    d="M17,3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V7ZM12,19a3,3,0,1,1,3-3A3,3,0,0,1,12,19ZM15,9H5V5H15Z"
                    transform="translate(971 295)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconScripts = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <path d="M0,0H24V24H0Z" fill="none" />
            <path
                d="M14.446,3.727,11.17.451A1.875,1.875,0,0,0,9.846-.1H1.875A1.881,1.881,0,0,0,0,1.779V18.025A1.875,1.875,0,0,0,1.875,19.9H13.122A1.875,1.875,0,0,0,15,18.025V5.055a1.884,1.884,0,0,0-.551-1.328ZM12.97,4.9H10V1.931ZM1.875,18.025V1.779H8.123V5.84a.935.935,0,0,0,.937.937h4.062V18.025Z"
                transform="translate(5 2.1)" className={fillClass} />
        </svg>
    }

    const getIconSearch = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <rect width="16" height="16" fill="none" />
            <path
                d="M12.7,11.23a6.777,6.777,0,0,0,1.4-4.174A7.02,7.02,0,0,0,7.1,0,7.105,7.105,0,0,0,0,7.056a7.105,7.105,0,0,0,7.1,7.056,6.667,6.667,0,0,0,4.2-1.391l3,2.981a.971.971,0,0,0,1.4,0,.957.957,0,0,0,0-1.391Zm-5.6.8A5.022,5.022,0,0,1,2,7.056a5.1,5.1,0,0,1,10.2,0A5.022,5.022,0,0,1,7.1,12.025Z"
                className={fillClass} />
        </svg>
    }

    const getIconSend = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M23.883.117a.4.4,0,0,0-.419-.093l-23.2,8.4a.4.4,0,0,0-.037.737l8.354,4.01,7.546-5.578a.2.2,0,0,1,.28.28L10.83,15.419l4.01,8.354A.4.4,0,0,0,15.2,24h.02a.4.4,0,0,0,.356-.263l8.4-23.2A.4.4,0,0,0,23.883.117Z"
                className={fillClass} />
        </svg>
    }

    const getIconSignOut = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <g transform="translate(-70 -35)">
                <path d="M0,0H16V16H0Z" transform="translate(70 35)" fill="none" />
                <path
                    d="M12.5,5.8l-.987.987L13.319,8.6H6.2V10h7.119l-1.806,1.806.987.994L16,9.3ZM3.4,4.4H9V3H3.4A1.4,1.4,0,0,0,2,4.4v9.8a1.4,1.4,0,0,0,1.4,1.4H9V14.2H3.4Z"
                    transform="translate(69 34)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconSms = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" opacity="0.7" />
            <path
                d="M10.625,0H1.875A1.875,1.875,0,0,0,0,1.875v16.25A1.875,1.875,0,0,0,1.875,20h8.75A1.875,1.875,0,0,0,12.5,18.125V1.875A1.875,1.875,0,0,0,10.625,0ZM6.25,18.75A1.25,1.25,0,1,1,7.5,17.5,1.249,1.249,0,0,1,6.25,18.75Zm4.375-4.219a.47.47,0,0,1-.469.469H2.344a.47.47,0,0,1-.469-.469V2.344a.47.47,0,0,1,.469-.469h7.813a.47.47,0,0,1,.469.469Z"
                transform="translate(6 2)" className={fillClass} />
        </svg>
    }

    const getIconStar = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(-941 -212)">
                <rect width="24" height="24" transform="translate(941 212)" fill="none" />
                <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z"
                    transform="translate(941 213)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconStarOutlined = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(-993 -212)">
                <rect width="24" height="24" transform="translate(993 212)" fill="none" />
                <path
                    d="M22,9.24l-7.19-.62L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21,12,17.27,18.18,21l-1.63-7.03ZM12,15.4,8.24,17.67l1-4.28L5.92,10.51l4.38-.38L12,6.1l1.71,4.04,4.38.38L14.77,13.4l1,4.28Z"
                    transform="translate(993 213)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconTemplates = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path data-name="icon templates"
                d="M20,2H4A2,2,0,0,0,2.01,4L2,22l4-4H20a2.006,2.006,0,0,0,2-2V4A2.006,2.006,0,0,0,20,2ZM8,14H6V12H8Zm0-3H6V9H8ZM8,8H6V6H8Zm7,6H10V12h5Zm3-3H10V9h8Zm0-3H10V6h8Z"
                className={fillClass} />
        </svg>
    }

    const getIconTickets = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M15.561,7.061,8.939.439A1.5,1.5,0,0,0,7.879,0H1.5A1.5,1.5,0,0,0,0,1.5V7.879A1.5,1.5,0,0,0,.439,8.939l6.621,6.621a1.5,1.5,0,0,0,2.121,0l6.379-6.379a1.5,1.5,0,0,0,0-2.121ZM3.5,5A1.5,1.5,0,1,1,5,3.5,1.5,1.5,0,0,1,3.5,5ZM19.561,9.182l-6.379,6.379a1.5,1.5,0,0,1-2.121,0l-.011-.011,5.439-5.439a2.813,2.813,0,0,0,0-3.978L10.356,0h1.523a1.5,1.5,0,0,1,1.061.439l6.621,6.621a1.5,1.5,0,0,1,0,2.121Z"
                transform="translate(2 4)" className={fillClass} />
        </svg>
    }

    const getIconView = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(-1555 -621)">
                <rect width="24" height="24" transform="translate(1555 621)" fill="none" />
                <path
                    d="M12,4.5A11.827,11.827,0,0,0,1,12a11.817,11.817,0,0,0,22,0A11.827,11.827,0,0,0,12,4.5ZM12,17a5,5,0,1,1,5-5A5,5,0,0,1,12,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,9Z"
                    transform="translate(1555 620.5)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconWarning = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M1,19.273H21L11,2Zm10.909-2.727H10.091V14.727h1.818Zm0-3.636H10.091V9.273h1.818Z"
                transform="translate(1 1)" className={fillClass} />
        </svg>
    }

    const getIconWeb = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(0.334)">
                <rect width="24" height="24" transform="translate(-0.334)" fill="none" />
                <path
                    d="M10,12.516C9.567,9.863,8.551,8,7.369,8s-2.2,1.863-2.63,4.516ZM4.516,15.369a18.623,18.623,0,0,0,.1,1.9H10.12a18.623,18.623,0,0,0,.1-1.9,18.623,18.623,0,0,0-.1-1.9H4.614A18.623,18.623,0,0,0,4.516,15.369Zm9.648-2.852A7.384,7.384,0,0,0,9.469,8.309a10.028,10.028,0,0,1,1.486,4.207Zm-8.9-4.207A7.379,7.379,0,0,0,.573,12.516H3.782A9.987,9.987,0,0,1,5.265,8.309Zm9.217,5.158H11.074c.062.624.1,1.263.1,1.9s-.036,1.278-.1,1.9h3.405a7.305,7.305,0,0,0,.256-1.9,7.433,7.433,0,0,0-.253-1.9Zm-10.916,1.9c0-.639.036-1.278.1-1.9H.256a7.2,7.2,0,0,0,0,3.8H3.661C3.6,16.646,3.565,16.007,3.565,15.369Zm1.174,2.852c.431,2.653,1.447,4.516,2.63,4.516s2.2-1.863,2.63-4.516Zm4.733,4.207a7.391,7.391,0,0,0,4.695-4.207H10.958A10.028,10.028,0,0,1,9.472,22.428Zm-8.9-4.207a7.384,7.384,0,0,0,4.695,4.207,10.028,10.028,0,0,1-1.486-4.207H.573Z"
                    transform="translate(4.666 -3)" className={fillClass} />
            </g>
        </svg>
    }

    const getIconSpinner = (overriddenMainClass = mainClass) => {
        return <svg className={`spinner ${overriddenMainClass}`} viewBox="0 0 40 40">
            <circle className="path" cx="20" cy="20" r="16" fill="none" strokeWidth="4" />
        </svg>;
    }

    const getIconLightCheckBoxOff = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M16,18H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0H16a2,2,0,0,1,2,2V16A2,2,0,0,1,16,18ZM2,2V16H16V2Z"
                transform="translate(3 3)" className={fillClass} />
        </svg>
    }

    const getIconLightCheckBoxOn = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M16,18H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0H16a2,2,0,0,1,2,2V16A2,2,0,0,1,16,18ZM3.41,7.59h0L2,9l5,5,9-9L14.59,3.58,7,11.17,3.41,7.59Z"
                className={fillClass} />
        </svg>
    }

    const getIconLightRadioOff = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,2a8,8,0,1,0,8,8A8.01,8.01,0,0,0,10,2Z"
                transform="translate(2 2)" className={fillClass} />
        </svg>
    }

    const getIconLightRadioOn = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill='none' />
            <path
                d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,2a8,8,0,1,0,8,8A8.009,8.009,0,0,0,10,2Zm0,13a5,5,0,1,1,5-5A5.006,5.006,0,0,1,10,15Z"
                transform="translate(2 2)" className={fillClass} />
        </svg>
    }

    const getIconComment = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M20,2H4A2,2,0,0,0,2.01,4L2,22l4-4H20a2.006,2.006,0,0,0,2-2V4A2.006,2.006,0,0,0,20,2ZM6,9H18v2H6Zm8,5H6V12h8Zm4-6H6V6H18Z"
                className={fillClass} />
        </svg>
    }
    const getCwcLogo = () => <CwcLogo className={mainClass} />

    const getIconFormat = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M5,17v2H19V17Zm4.5-4.2h5l.9,2.2h2.1L12.75,4h-1.5L6.5,15H8.6ZM12,5.98,13.87,11H10.13Z" transform="translate(0 1)"
                className={fillClass}
            />
        </svg>
    );

    const getIconSentimentSatisfied = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <g>
                <circle cx="1.5" cy="1.5" r="1.5" transform="translate(14 8)" className={fillClass} />
                <circle cx="1.5" cy="1.5" r="1.5" transform="translate(7 8)" className={fillClass} />
                <path
                    d="M11.99,2A10,10,0,1,0,22,12,10,10,0,0,0,11.99,2ZM12,20a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm0-4a4,4,0,0,1-3.45-2H6.88a5.495,5.495,0,0,0,10.24,0H15.45A4,4,0,0,1,12,16Z"
                    className={fillClass}
                />
            </g>
        </svg>
    );

    const getIconCheckMark = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path
                d="M9,16.17,4.83,12,3.41,13.41,9,19,21,7,19.59,5.59Z"
                transform="translate(-0.41 -0.59)"
                className={fillClass}
            />
        </svg>
    );

    const getHelioLogo = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="216" height="75.538" viewBox="0 0 216 75.538" className={mainClass}>
                <g transform="translate(-15 -21.875)">
                    <path
                        d="M0,37.051V74.346H12.279V44.562C3.443,42.993.137,37.28,0,37.051ZM83.929,24.376a25.579,25.579,0,1,0,22.715,37.493H93.1a14.366,14.366,0,0,1-9.141,3.047,13.711,13.711,0,0,1-13.574-9.628h38.544a25.9,25.9,0,0,0,.564-5.347A25.579,25.579,0,0,0,83.929,24.376ZM70.218,45.065a13.711,13.711,0,0,1,13.711-10.1,13.711,13.711,0,0,1,13.711,10.1Zm73.92,29.281h12.279V25.671H144.137Zm46.3-49.97a25.61,25.61,0,1,0,.005,0Zm0,40.555c-7.937,0-14.367-5.683-14.367-14.976s6.353-14.915,14.367-14.915,14.382,5.683,14.382,14.991S198.3,64.992,190.436,64.992ZM150.277,5.317a7.176,7.176,0,1,0,7.16,7.16A7.176,7.176,0,0,0,150.277,5.317ZM118.954,74.346h12.279V0H118.954ZM29.921,24.97l-9.339-1.158a9.491,9.491,0,0,1-8.3-9.4V0H0V16.164a19.805,19.805,0,0,0,17.4,19.7l10.3,1.28A10.268,10.268,0,0,1,36.716,47.35v27H49V46.573a21.771,21.771,0,0,0-19.074-21.6Z"
                        transform="translate(15 21.875)"
                        className={fillClass}
                    />
                </g>
            </svg>
        );
    }

    const getErrorFilled = () => {
        return (
            <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" version="1.1" viewBox="0 0 16 16" className={mainClass}>
                <g transform="translate(-16.988 -15.519)">
                    <circle cx="24.988" cy="23.519" r="8" className={fillClass} />
                    <rect x="23.988" y="19.519" width="2" height="5" fill="#fff" />
                    <rect x="23.988" y="25.519" width="2" height="2" fill="#fff" />
                </g>
            </svg>

        )
    }

    const getIconUsers = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <g transform="translate(6 9)"><rect width="24" height="24" transform="translate(-6 -9)" fill="none" />
                    <path d="M16.5,12A2.5,2.5,0,1,0,14,9.5,2.492,2.492,0,0,0,16.5,12ZM9,11A3,3,0,1,0,6,8,2.987,2.987,0,0,0,9,11Zm7.5,3c-1.83,0-5.5.92-5.5,2.75V19H22V16.75C22,14.92,18.33,14,16.5,14ZM9,13c-2.33,0-7,1.17-7,3.5V19H9V16.75a3.941,3.941,0,0,1,2.37-3.47A12.283,12.283,0,0,0,9,13Z"
                        transform="translate(-6 -9)"
                        className={fillClass} />
                </g>
            </svg>
        );
    }

    const getIconBulkUsers = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="translate(6 1)">
                <rect width="24" height="24" transform="translate(-6 -1)" fill="none" opacity="0.7" />
                <path d="M20,6H12L10,4H4A2,2,0,0,0,2.01,6L2,18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V8A2.006,2.006,0,0,0,20,6ZM15,9a2,2,0,1,1-2,2A2.006,2.006,0,0,1,15,9Zm4,8H11V16c0-1.33,2.67-2,4-2s4,.67,4,2Z"
                    transform="translate(-6 -1)"
                    className={fillClass} />
            </g>
            </svg>
        );
    }

    const icons = {
        [Icon.Add]: getIconAdd,
        [Icon.AddBlack]: getIconAddBlack,
        [Icon.AddContact]: getIconAddContact,
        [Icon.Alert]: getIconAlert,
        [Icon.ArrowDown]: getIconArrowDown,
        [Icon.ArrowDownward]: getIconArrowDownward,
        [Icon.ArrowLeft]: getIconArrowLeft,
        [Icon.ArrowRight]: getIconArrowRight,
        [Icon.ArrowBack]: getIconArrowBack,
        [Icon.ArrowTrendDown]: getIconArrowTrendDown,
        [Icon.ArrowTrendUp]: getIconArrowTrendUp,
        [Icon.ArrowUp]: getIconArrowUp,
        [Icon.ArrowUpward]: getIconArrowUpward,
        [Icon.Athena]: getIconAthena,
        [Icon.Bot]: getIconBot,
        [Icon.Calendar]: getIconCalendar,
        [Icon.Ccp]: getIconCcp,
        [Icon.ChannelChat]: getIconChannelChat,
        [Icon.ChannelEmail]: getIconChannelEmail,
        [Icon.ChannelPhone]: getIconChannelPhone,
        [Icon.ChannelSms]: getIconChannelSms,
        [Icon.ChannelWeb]: getIconChannelWeb,
        [Icon.Chat]: getIconChat,
        [Icon.CheckmarkOutline]: getIconCheckmarkOutline,
        [Icon.Clear]: getIconClear,
        [Icon.Close]: getIconClose,
        [Icon.Company]: getIconCompany,
        [Icon.Contacts]: getIconContacts,
        [Icon.Dashboard]: getIconDashboard,
        [Icon.Download]: getIconDownload,
        [Icon.Delete]: getIconDelete,
        [Icon.DeleteCircled]: getIconDeleteCircled,
        [Icon.Edit]: getIconEdit,
        [Icon.EditCircled]: getIconEditCircled,
        [Icon.Email]: getIconEmail,
        [Icon.Error]: getIconError,
        [Icon.Filter]: getIconFilter,
        [Icon.FilterList]: getIconFilterList,
        [Icon.Info]: getIconInfo,
        [Icon.Location]: getIconLocation,
        [Icon.Menu]: getIconMenu,
        [Icon.MoreVert]: getIconMoreVert,
        [Icon.MyProfile]: getIconMyProfile,
        [Icon.MyStats]: getIconMyStats,
        [Icon.Note]: getIconNote,
        [Icon.Office365]: getIconOffice365,
        [Icon.PatientChart]: getIconPatientChart,
        [Icon.Patients]: getIconPatients,
        [Icon.Placeholder]: getIconPlaceholder,
        [Icon.Play]: getIconPlay,
        [Icon.Print]: getIconPrint,
        [Icon.Phone]: getIconPhone,
        [Icon.RatingDissatisfied]: getIconRatingDissatisfied,
        [Icon.RatingSatisfied]: getIconRatingSatisfied,
        [Icon.RatingVerySatisfied]: getIconRatingVerySatisfied,
        [Icon.SentimentSatisfied]: getIconSentimentSatisfied,
        [Icon.Refresh]: getIconRefresh,
        [Icon.Save]: getIconSave,
        [Icon.Scripts]: getIconScripts,
        [Icon.Search]: getIconSearch,
        [Icon.Send]: getIconSend,
        [Icon.SignOut]: getIconSignOut,
        [Icon.Sms]: getIconSms,
        [Icon.Star]: getIconStar,
        [Icon.StarOutlined]: getIconStarOutlined,
        [Icon.Tickets]: getIconTickets,
        [Icon.View]: getIconView,
        [Icon.Warning]: getIconWarning,
        [Icon.Web]: getIconWeb,
        [Icon.LightCheckBoxOff]: getIconLightCheckBoxOff,
        [Icon.LightCheckBoxOn]: getIconLightCheckBoxOn,
        [Icon.LightRadioOff]: getIconLightRadioOff,
        [Icon.LightRadioOn]: getIconLightRadioOn,
        [Icon.Comment]: getIconComment,
        [Icon.CwcLogo]: getCwcLogo,
        [Icon.Spinner]: getIconSpinner,
        [Icon.Format]: getIconFormat,
        [Icon.CheckMark]: getIconCheckMark,
        [Icon.HelioLogo]: getHelioLogo,
        [Icon.CheckMark]: getIconCheckMark,
        [Icon.Templates]: getIconTemplates,
        [Icon.ErrorFilled]: getErrorFilled,
        [Icon.AwsConnect]: getIconAwsConnect,
        [Icon.Users]: getIconUsers,
        [Icon.BulkUsers]: getIconBulkUsers
    }

    const iconClicked = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }
        if (onClick) {
            onClick(e);
        }
    }

    if (!isLoading) {
        return <div className={wrapperClassName} onClick={iconClicked}>
            {icons[type]()}
        </div>
    }

    const overriddenMainClass = classNames('flex items-center justify-center', {
        'icon-large-40': className === 'icon-medium' || className === 'icon-large' || className === 'icon-medium-18' || className === 'icon-x-large',
        'icon-medium': className === 'icon-large-40' || className === 'icon-small'
    });

    return <div className={`${wrapperClassName} relative`} onClick={iconClicked}>
        <div className={`absolute`} onClick={iconClicked}>{getIconSpinner(overriddenMainClass)}</div>
        <div className={overriddenMainClass} onClick={iconClicked}>
            <SvgIcon type={type} fillClass='fill-loading' />
        </div>
    </div>
}

export default SvgIcon;
