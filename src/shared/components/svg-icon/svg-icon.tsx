import { Icon } from '@components/svg-icon/icon';
import './svg-icon.scss';
import classNames from 'classnames';
import React from 'react';

export interface SvgIconProps {
    type: Icon,
    className?: string,
    wrapperClassName?: string,
    fillClass?: string,
    fillClass2?: string,
    strokeClass?: string,
    opacity?: string,
    onClick?: (e: any) => void,
    isLoading?: boolean,
    disabled?: boolean
}

const SvgIcon = ({ type, wrapperClassName = '', className = 'icon-medium', fillClass = 'fill-default', fillClass2 = 'fill-default',
    strokeClass = 'stroke-default', opacity, onClick, isLoading = false, disabled = false }: SvgIconProps) => {

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
        return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g transform="translate(12)"><rect width="24" height="24" transform="translate(-12)" fill="none" />
                <g transform="translate(-10 3)">
                    <path d="M10.669,9.344a.877.877,0,1,0,.876.876.877.877,0,0,0-.876-.876" />
                    <path d="M14.032,6.65a.876.876,0,1,0,.876.876.877.877,0,0,0-.876-.876" />
                    <path d="M5.033,7.768a.876.876,0,1,0,.876.876.877.877,0,0,0-.876-.876" />
                    <path d="M8.586,5.151a.877.877,0,1,0,.876.876.877.877,0,0,0-.876-.876" />
                    <path className={fillClass} d="M19.229,7a3.948,3.948,0,0,0-2.313-1.4,3.4,3.4,0,0,0-1.769-2.147A3.329,3.329,0,0,0,12.535,3.4,4.89,4.89,0,0,0,10.191.6a5.233,5.233,0,0,0-3.6-.471A4.774,4.774,0,0,0,3.7,2,5.14,5.14,0,0,0,2.895,5.67,3.563,3.563,0,0,0,0,9.381a3.572,3.572,0,0,0,3.367,3.491H7.2v4.968a.3.3,0,0,0,.305.305.3.3,0,0,0,.207-.082l5.535-5.153H16.5l.03,0A3.663,3.663,0,0,0,19.229,7M12.155,10.22A1.486,1.486,0,1,1,9.619,9.171l-.8-1.677a1.521,1.521,0,0,1-.235.019,1.481,1.481,0,0,1-1.017-.4L6.4,8.056a1.49,1.49,0,1,1-.352-.5l1.174-.95a1.486,1.486,0,1,1,2.172.667l.743,1.56a1.463,1.463,0,0,1,.535-.1,1.479,1.479,0,0,1,.926.325L12.706,8.2a1.488,1.488,0,1,1,.381.476l-1.1.857a1.479,1.479,0,0,1,.171.691" />
                </g>
            </g>
        </svg>);
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

    const getIconAttachment = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect width="24" height="24" fill="none" />
            <path d="M2,12.5A5.5,5.5,0,0,1,7.5,7H18a4,4,0,0,1,0,8H9.5a2.5,2.5,0,0,1,0-5H17v2H9.41c-.55,0-.55,1,0,1H18a2,2,0,0,0,0-4H7.5a3.5,3.5,0,0,0,0,7H17v2H7.5A5.5,5.5,0,0,1,2,12.5Z" className={fillClass} />
        </svg>
    }
    const getIconOutgoingEmail = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={fillClass}>
            <g transform="translate(-960 -728)">
                <rect width="16" height="16" transform="translate(960 728)" fill="none" />
                <path d="M9.222,8.556V5L3,11.222l6.222,6.222V13.8c4.444,0,7.556,1.422,9.778,4.533C18.111,13.889,15.444,9.444,9.222,8.556Z" transform="translate(957 724)" />
            </g>
        </svg>
    }
    const getIconIncomingEmail = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={fillClass}>
            <g transform="translate(-2 -2)"><rect width="16" height="16" transform="translate(2 2)" fill="none" />
                <path d="M18,8.893,10,2,2,8.893l8,5.6ZM8.766,8.059V4.286h2.467V8.062h1.347L10,10.9,7.419,8.062H8.766Z" />
                <path d="M50.436,39.018a.971.971,0,0,0,.1-.423V31.15L45.85,34.433Z" transform="translate(-32.534 -21.627)" />
                <path d="M11.217,47.051,8.332,45.03,3.64,49.719a1.025,1.025,0,0,0,.609.206H18.185a1.008,1.008,0,0,0,.609-.206L14.1,45.03Z" transform="translate(-1.217 -31.925)" />
                <path d="M2,31.15V38.6a.971.971,0,0,0,.1.423L6.686,34.43Z" transform="translate(0 -21.627)" />
            </g>
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
        return (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" opacity="0.7" />
            <path d="M20,0A20,20,0,1,1,0,20,20,20,0,0,1,20,0Z" transform="translate(4 4)" className={fillClass} />
            <path d="M12,1a9,9,0,0,0-9,9v7a3,3,0,0,0,3,3H9V12H5V10a7,7,0,0,1,14,0v2H15v8h4v1H12v2h6a3,3,0,0,0,3-3V10A9,9,0,0,0,12,1Z" transform="translate(12 11)" className={fillClass2} />
        </svg>);
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

    const getIconChannelUser = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <g transform="translate(4 4)" fill="none" className={strokeClass}>
                <circle cx="20" cy="20" r="20" stroke="none" />
                <circle cx="20" cy="20" r="19.5" fill="none" />
            </g>
            <g transform="translate(-660 -955)">
                <path d="M17,14a5,5,0,1,0-5-5A5,5,0,0,0,17,14Zm0,2.5c-3.337,0-10,1.675-10,5V24H27V21.5C27,18.175,20.337,16.5,17,16.5Z" transform="translate(667 965)" className={fillClass} />
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

    const getIconEmergency = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className={mainClass}>
            <rect width="48" height="48" fill="none" />
            <path d="M38,6H10a3.982,3.982,0,0,0-3.98,4L6,38a4,4,0,0,0,4,4H38a4,4,0,0,0,4-4V10A4,4,0,0,0,38,6ZM36,28H28v8H20V28H12V20h8V12h8v8h8Z" className={fillClass} />
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

    const getIconExtension = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <g id="Icon_Extension_24px" data-name="Icon/Extension/24px" transform="translate(-144 -632)">
                <rect id="Bound" width="24" height="24" transform="translate(144 632)" fill="none" />
                <path id="ic_contact_phone_24px" d="M22,3H2A2.006,2.006,0,0,0,0,5V19a2.006,2.006,0,0,0,2,2H22a2,2,0,0,0,1.99-2L24,5A2.006,2.006,0,0,0,22,3ZM8,6A3,3,0,1,1,5,9,3,3,0,0,1,8,6Zm6,12H2V17c0-2,4-3.1,6-3.1S14,15,14,17Zm3.85-4h1.64L21,16l-1.99,1.99A7.512,7.512,0,0,1,16.28,14a7.283,7.283,0,0,1,0-4,7.474,7.474,0,0,1,2.73-3.99L21,8l-1.51,2H17.85a5.889,5.889,0,0,0,0,4Z" transform="translate(144 632)" className={fillClass} />
            </g>
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

    const getIconHelp = () => {
        return <svg id="Icon_Help_Outline_24px" data-name="Icon/Help/Outline/24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect id="Container" width="24" height="24" fill="none" />
            <path id="ic_help_outline_24px" d="M11,18h2V16H11ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.011,8.011,0,0,1,12,20ZM12,6a4,4,0,0,0-4,4h2a2,2,0,0,1,4,0c0,2-3,1.75-3,5h2c0-2.25,3-2.5,3-5A4,4,0,0,0,12,6Z" />
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

    const getIconInfoOutline = () => {
        return <svg id="Icon_Info_Outline_24px" data-name="Icon/Info/Outline/24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
            <rect id="Container" width="24" height="24" fill="none" />
            <path id="ic_info_outline_24px" d="M11,17h2V11H11ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.011,8.011,0,0,1,12,20ZM11,9h2V7H11Z" className={fillClass} />
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

    const getIconPatientChartV2 = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={mainClass}>
            <rect width="16" height="16" fill="none" />
            <g transform="translate(-2 -2)"><path d="M7.2,2V3.6H4V18H16.8V3.6H13.6V2ZM8.8,3.6H12V5.2H8.8Zm6.4,1.6V16.4H5.6V5.2H7.2V6.8h6.4V5.2Z" className={fillClass} />
                <path d="M12.2,11H10.6v1.6H9v1.6h1.6v1.6h1.6V14.2h1.6V12.6H12.2Z" transform="translate(-1 -1.8)" className={fillClass} />
            </g>
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

    const getIconSpam = () => {
        return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className={mainClass}>
            <rect width="32" height="32" fill="none" opacity="0.7" />
            <path
                d="M-6737.563-2711h0a19.144,19.144,0,0,1-8.629-7.17,21.184,21.184,0,0,1-3.29-7.508,23.863,23.863,0,0,1,.051-10.1l.333-.017c2.621-.133,8.759-.443,11.535-3.2,2.781,2.761,8.918,3.072,11.539,3.2l.16.009.173.009a23.831,23.831,0,0,1,.05,10.1,21.2,21.2,0,0,1-3.289,7.508,19.14,19.14,0,0,1-8.631,7.17Zm.162-12.419h0l4.021,4.018,1.579-1.578-4.021-4.021,4.021-4.021-1.579-1.58-4.021,4.021-4.019-4.021-1.58,1.58,4.021,4.021-4.021,4.021,1.58,1.578,4.018-4.018Z"
                transform="translate(6753.999 2741)" className={fillClass} />
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

    const getIconBlacklist = () => {
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

    const getIconConfigurations = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <rect width="24" height="24" fill="none" />
                <path d="M19.43,12.98A7.793,7.793,0,0,0,19.5,12a7.793,7.793,0,0,0-.07-.98l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.61-.22l-2.49,1a7.306,7.306,0,0,0-1.69-.98l-.38-2.65A.488.488,0,0,0,14,2H10a.488.488,0,0,0-.49.42L9.13,5.07a7.683,7.683,0,0,0-1.69.98l-2.49-1a.488.488,0,0,0-.61.22l-2,3.46a.493.493,0,0,0,.12.64l2.11,1.65A7.931,7.931,0,0,0,4.5,12a7.931,7.931,0,0,0,.07.98L2.46,14.63a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.61.22l2.49-1a7.306,7.306,0,0,0,1.69.98l.38,2.65A.488.488,0,0,0,10,22h4a.488.488,0,0,0,.49-.42l.38-2.65a7.683,7.683,0,0,0,1.69-.98l2.49,1a.488.488,0,0,0,.61-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
                    transform="translate(-0.271)"
                    className={fillClass} />
            </svg>
        );
    }

    const getIconPause = () => {
        return (
            <svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM11,16H9V8h2Zm4,0H13V8h2Z" className={fillClass} />
            </svg>
        );
    }

    const getIconCallOutbound = () => {
        return (
            <svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <path d="M9,5V7h6.59L4,18.59,5.41,20,17,8.41V15h2V5Z" transform="translate(1)" className={fillClass} />
            </svg>
        )
    }

    const getIconCallInbound = () => {
        return (
            <svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <path d="M20,5.41,18.59,4,7,15.59V9H5V19H15V17H8.41Z" transform="translate(0 1)" className={fillClass} />
            </svg>
        );
    }

    const getIconCallMissedOutgoing = () => {
        return (
            <svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <path d="M3,8.41l9,9,7-7V15h2V7H13V9h4.59L12,14.59,4.41,7Z" className={fillClass} />
            </svg>
        );
    }

    const getIconUserUnknown = () => {
        return (
            <svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <g transform="translate(-0.164 -0.535)">
                    <path
                        d="M16.857,11.722a5.307,5.307,0,1,0,5.308,5.307A5.307,5.307,0,0,0,16.857,11.722Zm.575,8.684h-1.1V19.261h1.1Zm1.375-4.077a5.851,5.851,0,0,1-.8.882,2.4,2.4,0,0,0-.533.654,1.982,1.982,0,0,0-.119.786v.117h-1.01v-.117A2.957,2.957,0,0,1,16.5,17.6a2.747,2.747,0,0,1,.7-.922l.357-.346a1.374,1.374,0,0,0,.234-.287.975.975,0,0,0,.164-.531,1.009,1.009,0,0,0-.234-.671.964.964,0,0,0-.776-.273.946.946,0,0,0-.935.481,1.963,1.963,0,0,0-.171.823l0,.1h-1.01v-.116a2.253,2.253,0,0,1,.58-1.6,2.055,2.055,0,0,1,1.571-.612,2.077,2.077,0,0,1,1.47.512,1.77,1.77,0,0,1,.564,1.344A1.471,1.471,0,0,1,18.807,16.329Z"
                        className={fillClass}
                    />
                    <circle cx="4.222" cy="4.222" r="4.222" transform="translate(6.99 3.535)" className={fillClass} />
                    <path
                        d="M10.608,13.861c-.22-.01-.434-.019-.658-.019a12.537,12.537,0,0,0-6.432,1.77,2.845,2.845,0,0,0-1.353,2.463v2.579h9.012A6.783,6.783,0,0,1,9.95,16.762,6.9,6.9,0,0,1,10.608,13.861Z"
                        className={fillClass}
                    />
                </g>
            </svg>
        )
    }

    const getIconFallbackMime = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Attachment_generic_48px">
                        <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                        <polygon className={`attachment-2 ${fillClass}`} points="26.99 5 10.17 5 10.17 26.96 10.17 43.48 38.27 43.48 38.27 26.96 38.27 16.51 26.99 5" />
                        <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    </g>
                </g>
            </svg>
        );
    }

    const getIconJpg = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Attachment_jpg_48px">
                        <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                        <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                        <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                        <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                        <rect className={`attachment-3-jpg ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                        <path className={`attachment-4 ${fillClass}`} d="M19,30.54h1.37v3.82a1.7,1.7,0,0,1-1.85,1.85,1.8,1.8,0,0,1-2-1.93H18c0,.48.21.71.56.71s.52-.21.52-.63Z" />
                        <path className={`attachment-4 ${fillClass}`} d="M23.85,34.14H23v2H21.64V30.54h2.21c1.38,0,2.06.78,2.06,1.81A1.8,1.8,0,0,1,23.85,34.14Zm-.1-1.09c.54,0,.77-.27.77-.7s-.23-.7-.77-.7H23v1.4Z" />
                        <path className={`attachment-4 ${fillClass}`} d="M32,32.32H30.47a1.16,1.16,0,0,0-1.1-.58,1.44,1.44,0,0,0-1.46,1.6A1.48,1.48,0,0,0,29.48,35a1.35,1.35,0,0,0,1.36-1H29.11V33h3v1.27a2.86,2.86,0,1,1-2.71-3.78A2.49,2.49,0,0,1,32,32.32Z" />
                    </g>
                </g>
            </svg>
        )
    }

    const getIconPdf = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_pdf_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-pdf ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M19.11,34.14h-.85v2H16.89V30.54h2.22c1.37,0,2.06.78,2.06,1.81A1.8,1.8,0,0,1,19.11,34.14ZM19,33.05c.55,0,.78-.27.78-.7s-.23-.7-.78-.7h-.74v1.4Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M27.05,33.35a2.72,2.72,0,0,1-2.94,2.81H22V30.54h2.11A2.71,2.71,0,0,1,27.05,33.35ZM24,35a1.63,1.63,0,1,0,0-3.26h-.65V35Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M27.94,30.54h3.65v1.1H29.31v1.18H31v1.06H29.31v2.28H27.94Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconTxt = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_txt_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-txt ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M16.59,30.54h4.34v1.1H19.44v4.52H18.08V31.64H16.59Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M24,34.44l-1,1.72H21.48l1.8-2.86-1.84-2.76H23l1.13,1.7,1-1.7H26.7l-1.78,2.83,1.85,2.79H25.18Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M27.28,30.54h4.34v1.1H30.13v4.52H28.76V31.64H27.28Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconDoc = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_doc_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-doc ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M20.94,33.35a2.72,2.72,0,0,1-3,2.81h-2.1V30.54H18A2.72,2.72,0,0,1,20.94,33.35Zm-3,1.62a1.63,1.63,0,1,0,0-3.26h-.65V35Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M24.48,36.21a2.88,2.88,0,1,1,2.87-2.88A2.82,2.82,0,0,1,24.48,36.21Zm0-1.25A1.46,1.46,0,0,0,26,33.33a1.49,1.49,0,1,0-3,0A1.46,1.46,0,0,0,24.48,35Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M30.83,30.48a2.61,2.61,0,0,1,2.66,2H32a1.25,1.25,0,0,0-1.18-.72,1.43,1.43,0,0,0-1.42,1.61A1.44,1.44,0,0,0,30.81,35,1.25,1.25,0,0,0,32,34.24h1.5a2.61,2.61,0,0,1-2.66,2,2.86,2.86,0,0,1,0-5.72Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconDocX = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_docx_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-docx ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M17.93,33.35A2.72,2.72,0,0,1,15,36.16h-2.1V30.54H15A2.71,2.71,0,0,1,17.93,33.35ZM14.9,35a1.63,1.63,0,1,0,0-3.26h-.64V35Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M21.48,36.21a2.88,2.88,0,1,1,2.87-2.88A2.83,2.83,0,0,1,21.48,36.21Zm0-1.25A1.46,1.46,0,0,0,23,33.33a1.49,1.49,0,1,0-3,0A1.46,1.46,0,0,0,21.48,35Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M27.82,30.48a2.61,2.61,0,0,1,2.67,2H29a1.23,1.23,0,0,0-1.17-.72,1.43,1.43,0,0,0-1.42,1.61A1.44,1.44,0,0,0,27.81,35,1.23,1.23,0,0,0,29,34.24h1.51a2.61,2.61,0,0,1-2.67,2,2.86,2.86,0,0,1,0-5.72Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M33.74,34.44l-1,1.72H31.18L33,33.3l-1.84-2.76h1.6l1.12,1.7,1-1.7h1.55l-1.79,2.83,1.86,2.79H34.89Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconXls = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Attachment_xls_48px">
                        <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                        <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                        <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                        <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                        <rect className={`attachment-3-xls ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                        <path className={`attachment-4 ${fillClass}`} d="M20.19,34.44l-1,1.72H17.63l1.8-2.86-1.84-2.76h1.59l1.13,1.7,1-1.7h1.55l-1.78,2.83,1.85,2.79H21.33Z" />
                        <path className={`attachment-4 ${fillClass}`} d="M25.1,30.54V35.1h1.79v1.06H23.73V30.54Z" />
                        <path className={`attachment-4 ${fillClass}`} d="M29.7,36.21c-1.21,0-2.15-.6-2.19-1.73H29a.65.65,0,0,0,.7.64c.4,0,.66-.2.66-.53,0-1-2.81-.48-2.79-2.47,0-1.07.87-1.66,2-1.66s2.05.61,2.11,1.68H30.2a.61.61,0,0,0-.65-.58.5.5,0,0,0-.58.51c0,1,2.78.54,2.78,2.41A1.81,1.81,0,0,1,29.7,36.21Z" />
                    </g>
                </g>
            </svg>
        )
    }

    const getIconXlsX = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_xlsx_48px">
                    <rect className={`attachment-1 ${fillClass}`} height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-xlsx ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M17.19,34.44l-1,1.72H14.63l1.8-2.86-1.84-2.76h1.59l1.13,1.7,1-1.7h1.55l-1.79,2.83,1.86,2.79H18.33Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M22.1,30.54V35.1h1.79v1.06H20.73V30.54Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M26.7,36.21c-1.21,0-2.15-.6-2.19-1.73H26a.65.65,0,0,0,.7.64c.4,0,.65-.2.65-.53,0-1-2.8-.48-2.79-2.47,0-1.07.88-1.66,2.05-1.66s2.05.61,2.1,1.68H27.19a.6.6,0,0,0-.64-.58.5.5,0,0,0-.58.51c0,1,2.78.54,2.78,2.41A1.81,1.81,0,0,1,26.7,36.21Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M32,34.44l-1,1.72H29.44l1.8-2.86L29.4,30.54H31l1.13,1.7,1-1.7h1.55l-1.78,2.83,1.86,2.79h-1.6Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconPng = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_png_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-png ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M19.11,34.14h-.85v2H16.89V30.54h2.22c1.37,0,2.06.78,2.06,1.81A1.8,1.8,0,0,1,19.11,34.14ZM19,33.05c.55,0,.78-.27.78-.7s-.23-.7-.78-.7h-.74v1.4Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M27,30.54v5.62H25.66l-2.29-3.47v3.47H22V30.54h1.37L25.66,34V30.54Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M33.38,32.32H31.87a1.19,1.19,0,0,0-1.11-.58,1.44,1.44,0,0,0-1.46,1.6A1.48,1.48,0,0,0,30.88,35a1.34,1.34,0,0,0,1.35-1H30.5V33h3v1.27a2.86,2.86,0,1,1-2.71-3.78A2.5,2.5,0,0,1,33.38,32.32Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconRar = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_rar_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-rar ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M19.19,30.54c1.37,0,2.06.79,2.06,1.77A1.62,1.62,0,0,1,20,33.93l1.3,2.23H19.75L18.59,34h-.33v2.12H16.89V30.54Zm-.08,1.14h-.85v1.39h.85a.65.65,0,0,0,.75-.7C19.86,32,19.62,31.68,19.11,31.68Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M25.72,35.16H23.63l-.34,1H21.86l2-5.62h1.58l2,5.62H26.06Zm-1-3.11L24,34.11h1.38Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M30.54,30.54c1.37,0,2.06.79,2.06,1.77a1.62,1.62,0,0,1-1.25,1.62l1.3,2.23H31.11L29.94,34h-.33v2.12H28.24V30.54Zm-.08,1.14h-.85v1.39h.85a.65.65,0,0,0,.75-.7C31.21,32,31,31.68,30.46,31.68Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconZip = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_zip_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-zip ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M22.76,31.58,20.35,35h2.41v1.12h-4v-1l2.4-3.46H18.8V30.54h4Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M23.78,30.54h1.37v5.62H23.78Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M28.48,34.14h-.85v2H26.26V30.54h2.22c1.37,0,2.06.78,2.06,1.81A1.8,1.8,0,0,1,28.48,34.14Zm-.11-1.09c.55,0,.78-.27.78-.7s-.23-.7-.78-.7h-.74v1.4Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconTiff = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={mainClass}>
                <g id="Layer_2" data-name="Layer 2"><g id="Attachment_tiff_48px">
                    <rect className={`attachment-1 ${fillClass}`} width="48" height="48" />
                    <path className={`attachment-2 ${fillClass}`} d="M38.26,27V16.51L27,5H10.17V27" />
                    <path className={`attachment-2 ${fillClass}`} d="M10.17,39.24v4.24H38.26V39.24" />
                    <path className={`attachment-2 ${fillClass}`} d="M27,5V16.28H38.26" />
                    <rect className={`attachment-3-tiff ${fillClass}`} x="7" y="26.96" width="34.44" height="12.28" />
                    <path className={`attachment-4 ${fillClass}`} d="M16.78,30.54h4.34v1.1H19.64v4.52H18.27V31.64H16.78Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M21.93,30.54H23.3v5.62H21.93Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M24.41,30.54h3.66v1.1H25.78v1.18h1.71v1.06H25.78v2.28H24.41Z" />
                    <path className={`attachment-4 ${fillClass}`} d="M28.91,30.54h3.65v1.1H30.28v1.18H32v1.06H30.28v2.28H28.91Z" />
                </g>
                </g>
            </svg>
        )
    }

    const getIconRatingDissatisfiedComment = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <g transform="translate(-0.005 0.031)">
                    <path d="M12.005,2a10.011,10.011,0,0,0-10,10,9.907,9.907,0,0,0,1.223,4.783L.089,23.969l7.1-3.213A9.9,9.9,0,0,0,12.005,22a10,10,0,0,0,0-20Zm0,18A7.956,7.956,0,0,1,7.34,18.49L4.005,20l1.476-3.38A8,8,0,1,1,12.005,20Z" className={fillClass} />
                    <circle cx="1.5" cy="1.5" r="1.5" transform="translate(14 8)" className={fillClass} />
                    <circle cx="1.5" cy="1.5" r="1.5" transform="translate(7 8)" className={fillClass} />
                    <path d="M12,14a5.426,5.426,0,0,0-5.1,3.5H8.6a3.994,3.994,0,0,1,3.4-2,3.871,3.871,0,0,1,3.4,2h1.7A5.426,5.426,0,0,0,12,14Z" transform="translate(0.1 -0.031)" className={fillClass} />
                </g>
            </svg>
        );
    }

    const getIconRatingSatisfiedComment = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <g transform="translate(-0.005 0.031)">
                    <path className={fillClass} d="M12.005,2a10.011,10.011,0,0,0-10,10,9.907,9.907,0,0,0,1.223,4.783L.089,23.969l7.1-3.213A9.9,9.9,0,0,0,12.005,22a10,10,0,0,0,0-20Zm0,18A7.956,7.956,0,0,1,7.34,18.49L4.005,20l1.476-3.38A8,8,0,1,1,12.005,20Z" />
                    <circle className={fillClass} cx="1.5" cy="1.5" r="1.5" transform="translate(14 8)" />
                    <circle className={fillClass} cx="1.5" cy="1.5" r="1.5" transform="translate(7 8)" />
                    <path className={fillClass} d="M12,16a3.8,3.8,0,0,1-1.96-.52c-.12.14-.86.98-1.01,1.15a5.5,5.5,0,0,0,5.95-.01c-.97-1.09-.01-.02-1.01-1.15A3.772,3.772,0,0,1,12,16Z" />
                </g>
            </svg>
        )
    }

    const getIconRatingVerySatisfiedComment = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={mainClass}>
                <rect width="24" height="24" fill="none" />
                <g transform="translate(-0.005 0.031)">
                    <path className={fillClass} d="M12.005,2a10.011,10.011,0,0,0-10,10,9.907,9.907,0,0,0,1.223,4.783L.089,23.969l7.1-3.213A9.9,9.9,0,0,0,12.005,22a10,10,0,0,0,0-20Zm0,18A7.956,7.956,0,0,1,7.34,18.49L4.005,20l1.476-3.38A8,8,0,1,1,12.005,20Z" />
                    <circle className={fillClass} cx="1.5" cy="1.5" r="1.5" transform="translate(14 8)" />
                    <circle className={fillClass} cx="1.5" cy="1.5" r="1.5" transform="translate(7 8)" />
                    <path className={fillClass} d="M7,14a5.458,5.458,0,0,0,5,4,5.458,5.458,0,0,0,5-4Z" transform="translate(0.005 -0.031)" />
                </g>
            </svg>
        )
    }

    const getIndicator = () => {
        return (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g className={fillClass}>
                    <circle cx="4" cy="4" r="4" stroke='none' />
                </g>
            </svg>
        )
    }

    const getAddPhoneIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <rect width="24" height="24" fill="none" opacity="0.7" />
                <g transform="translate(0.5)" className={fillClass}>
                    <path className={fillClass} d="M16.5,11.5a5,5,0,1,0,5,5A5,5,0,0,0,16.5,11.5Zm3,5.75H17.25V19.5h-1.5V17.25H13.5v-1.5h2.25V13.5h1.5v2.25H19.5Z" />
                    <path className={fillClass} d="M10.025,17H3.844a.47.47,0,0,1-.469-.469V4.344a.47.47,0,0,1,.469-.469h7.813a.47.47,0,0,1,.469.469V11.7A6.5,6.5,0,0,1,14,10.5V3.875A1.874,1.874,0,0,0,12.125,2H3.375A1.874,1.874,0,0,0,1.5,3.875v16.25A1.874,1.874,0,0,0,3.375,22h8.75a1.862,1.862,0,0,0,.7-.139A6.489,6.489,0,0,1,10.025,17ZM7.752,20.75h0A1.25,1.25,0,1,1,9,19.5,1.25,1.25,0,0,1,7.75,20.75Z" />
                </g>
            </svg>
        )
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
        [Icon.Attachment]: getIconAttachment,
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
        [Icon.Extension]: getIconExtension,
        [Icon.Filter]: getIconFilter,
        [Icon.FilterList]: getIconFilterList,
        [Icon.Help]: getIconHelp,
        [Icon.Info]: getIconInfo,
        [Icon.InfoOutline]: getIconInfoOutline,
        [Icon.Location]: getIconLocation,
        [Icon.Menu]: getIconMenu,
        [Icon.MoreVert]: getIconMoreVert,
        [Icon.MyProfile]: getIconMyProfile,
        [Icon.MyStats]: getIconMyStats,
        [Icon.Note]: getIconNote,
        [Icon.Office365]: getIconOffice365,
        [Icon.PatientChart]: getIconPatientChart,
        [Icon.PatientChartV2]: getIconPatientChartV2,
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
        [Icon.Spam]: getIconSpam,
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
        [Icon.Spinner]: getIconSpinner,
        [Icon.Format]: getIconFormat,
        [Icon.CheckMark]: getIconCheckMark,
        [Icon.HelioLogo]: getHelioLogo,
        [Icon.CheckMark]: getIconCheckMark,
        [Icon.Templates]: getIconTemplates,
        [Icon.ErrorFilled]: getErrorFilled,
        [Icon.AwsConnect]: getIconAwsConnect,
        [Icon.Users]: getIconUsers,
        [Icon.ChannelUser]: getIconChannelUser,
        [Icon.Pause]: getIconPause,
        [Icon.Blacklist]: getIconBlacklist,
        [Icon.Configurations]: getIconConfigurations,
        [Icon.CallOutbound]: getIconCallOutbound,
        [Icon.CallInbound]: getIconCallInbound,
        [Icon.CallMissedOutgoing]: getIconCallMissedOutgoing,
        [Icon.Emergency]: getIconEmergency,
        [Icon.UserUnknown]: getIconUserUnknown,
        [Icon.FallbackMime]: getIconFallbackMime,
        [Icon.JpgMime]: getIconJpg,
        [Icon.PdfMime]: getIconPdf,
        [Icon.TxtMime]: getIconTxt,
        [Icon.DocMime]: getIconDoc,
        [Icon.DocXMime]: getIconDocX,
        [Icon.XlsMime]: getIconXls,
        [Icon.XlsXMime]: getIconXlsX,
        [Icon.PngMime]: getIconPng,
        [Icon.RarMime]: getIconRar,
        [Icon.ZipMime]: getIconZip,
        [Icon.TiffMime]: getIconTiff,
        [Icon.RatingDissatisfiedComment]: getIconRatingDissatisfiedComment,
        [Icon.RatingSatisfiedComment]: getIconRatingSatisfiedComment,
        [Icon.RatingVerySatisfiedComment]: getIconRatingVerySatisfiedComment,
        [Icon.Indicator]: getIndicator,
        [Icon.AddPhone]: getAddPhoneIcon,
        [Icon.IncomingEmail]: getIconIncomingEmail,
        [Icon.OutgoingEmail]: getIconOutgoingEmail,
    }

    const iconClicked = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || isLoading) {
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
