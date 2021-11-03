import {PagedList} from '@shared/models';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import {InfiniteData} from 'react-query';
import {RelativeTime} from './types';
import {Option} from '@components/option/option';
import {TicketOptionsBase} from '@pages/tickets/models/ticket-options-base.model';
import store from '@app/store';
import {getMsalInstance} from '@pages/login/auth-config';
import {AppParameter} from '@shared/models/app-parameter.model';
import {logOut} from '@shared/store/app-user/appuser.slice';
import duration from 'dayjs/plugin/duration';
import {showCcp} from '@shared/layout/store/layout.slice';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Logger from '@shared/services/logger';
import i18n from 'i18next';

const getWindowCenter = () => {
    const {width, height} = getWindowDimensions();
    return {x: width / 2, y: height / 2};
}

const getWindowDimensions = () => {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

const formatPhone = (phone: string) => {
    if (!phone) {
        return '';
    }
    phone = phone.replaceAll('-', '');
    if (phone && phone.startsWith('+1')) {
        phone = phone.substring(2);
    }
    if (phone && phone.length >= 10) {

        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, phone.length)}`;
    } else {
        return phone;
    }
};

const clearFormatPhone = (phone: string) => {
    if (!phone) {
        return '';
    }
    return phone.replace(/[^\d]/g, '')
}

const initiateACall = (phoneToDial?: string) => {
    store.dispatch(showCcp());
    if (window.CCP.agent && phoneToDial) {
        phoneToDial = phoneToDial.replaceAll('-','');
        if (!phoneToDial.startsWith("+1")) {
            phoneToDial = `+1${phoneToDial}`
        }
        const endpoint = connect.Endpoint.byPhoneNumber(phoneToDial);
        window.CCP.agent.connect(endpoint, {
            failure: (e: any) => {
                store.dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: 'contacts.contact_details.error_dialing_phone'
                }));

                Logger.getInstance().error(i18n.t('contacts.contact_details.error_dialing_phone'), e);
            }
        })
    }
}

const formatDate = (datetime?: string) => {
    if (!datetime) {
        return '';
    }
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US');
}


const formatUtcDate = (date?: Date, format: string = 'ddd, MMM DD, YYYY h:mm A') => {
    dayjs.extend(utc);
    if (!date) {
        return '';
    }
    return dayjs.utc(date).local().format(format);
}

const formatDateShortMonth = (date: string) => {
    return dayjs(date).format('MMM DD, YYYY');
}

const getInitialsFromFullName = (username: string): string => {
    if(username.startsWith('+') || /\d/.test(username)){
        return '#';
    }
    const names = username.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
}

const getDateTime = (dueDate?: Date, dueTime?: string) => {
    let dateTime;
    if (dueDate && dueTime) {
        const time = dayjs(dueTime, "hh:mm A").format('HH:mm');
        const hours = parseInt(time.split(':')[0]);
        const minutes = parseInt(time.split(':')[1]);
        dateTime = dayjs.utc(dueDate).local().hour(hours).minute(minutes);
    } else if (dueDate) {
        dateTime = dayjs.utc(dueDate).local();
    } else if (dueTime) {
        const time = dayjs(dueTime, "hh:mm A").format('HH:mm');
        const hours = parseInt(time.split(':')[0]);
        const minutes = parseInt(time.split(':')[1]);
        dateTime = dayjs.utc().local().hour(hours).minute(minutes);
    }
    return dateTime;
}



const formatRelativeTime = (days?: number, hours?: number, minutes?: number, abs = false, minutesFormat = 'm'): string => {
    const getTimePart = (timePart: number) => abs ? Math.abs(timePart) : timePart;

    if (days && days !== 0) {
        return `${getTimePart(days)} d ${getTimePart(hours ?? 0)} h`;
    }

    if (hours && hours !== 0) {
        return `${getTimePart(hours)} h ${getTimePart(minutes ?? 0)} ${minutesFormat}`;
    }

    if (minutes) {
        return `${getTimePart(minutes)} ${minutesFormat}`;
    }

    return '';
}

const getRelativeTime = (date?: Date): RelativeTime => {
    if (!date) {
        return [];
    }

    let totalMinutes = dayjs.utc(date).diff(dayjs(), 'minute');
    const isNegative = totalMinutes < 0;
    const totalDays = Math.floor(Math.abs(totalMinutes) / (24 * 60));
    totalMinutes = totalMinutes - ((isNegative ? (-1 * totalDays) : totalDays) * (24 * 60));

    const totalHours = Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes - (totalHours * 60);

    return [totalDays, totalHours, totalMinutes]
}

const getAppParameter = (key: string): any => {
    if (store?.getState()?.appState?.appParameters) {
        const keyValue = store.getState().appState.appParameters.find((a: AppParameter) => a.Key === key);
        if (keyValue) {
            return keyValue.Value;
        }
    }
}

const isString = (obj: any) => {
    return typeof obj === 'string' || obj instanceof String;
}

const toShortISOLocalString = (date?: Date) => {
    if (!date) {
        return '';
    }
    dayjs.extend(utc);
    const dateDayJs = dayjs(date).utc().local();
    return `${dateDayJs.format('YYYY').padStart(4, '0')}-${dateDayJs.format('MM-DD')}`;
}


const toISOLocalString = (date?: Date) => {
    if (!date) {
        return '';
    }
    dayjs.extend(utc);
    const dateDayJs = dayjs(date).utc().local();
    return `${dateDayJs.format('YYYY').padStart(4, '0')}-${dateDayJs.format('MM-DDTHH:mm:ss.SSS[Z]')}`;
}

const stringJoin = (separator: string, ...params: Array<string | undefined>) => params.join(separator);

const checkIfDateIsntMinValue = (date: string | Date) => {
    return new Date(date).getFullYear() !== 1;
}

const getBrowserDatePattern = () => {
    const formatter = new Intl.DateTimeFormat().formatToParts();
    return formatter.map((part) => {
        switch (part.type) {
            case 'month':
                return 'MM';
            case 'day':
                return 'DD';
            case 'year':
                return 'YYYY';
            default:
                return part.value;
        }
    }).join('');
}

const groupBy = <TKey extends unknown, TValue extends unknown>(array: TValue[], keyExpression: (item: TValue) => TKey) => {
    const map = new Map<TKey, TValue[]>();
    array.forEach(item => {
        const key = keyExpression(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

export const getElementPosition = (element: HTMLElement | Element, scrolledElement?: Element) => {
    const rect = element.getBoundingClientRect();
    let scrollLeft;
    let scrollTop;

    if (!scrolledElement) {
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    } else {
        scrollLeft = scrolledElement.scrollLeft;
        scrollTop = scrolledElement.scrollTop;
    }
    return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}

const accumulateInfiniteData = <T extends unknown>(infiniteData: InfiniteData<PagedList<T>> | undefined): T[] => {
    if (infiniteData && infiniteData.pages) {
        return infiniteData.pages.reduce((acc: T[], val) => acc.concat(val.results), []);
    }
    return [];
}

const isLoggedIn = (): boolean => {
    const accounts = getMsalInstance()?.getAllAccounts();
    return !!(accounts && accounts[0]);
}

const logout = () => {
    getMsalInstance()?.logoutRedirect({
        postLogoutRedirectUri: '/login'
    }).then().finally(() => store.dispatch(logOut()));
}

const isSessionExpired = (): boolean => {
    const auth = store.getState()?.appUserState?.auth;
    if (auth) {
        return auth.expiresOn && dayjs(auth.expiresOn).isBefore(dayjs());
    }
    return false;
}

const parseOptions = <T extends any>(data: T[],
    labelExpression: (item: T) => string,
    valueExpression: (item: T) => string,
    assistiveTextExpression?: (item: T) => string,
    objectExpression?: (item: T) => any): Option[] => {
    if (!data) {
        return [];
    }

    return data.map(item => ({
        label: labelExpression(item),
        value: valueExpression(item),
        assistiveText: assistiveTextExpression ? assistiveTextExpression(item) : undefined,
        object: objectExpression ? objectExpression(item) : undefined
    }));
}


const openWebSite = (url: string) => {
    if (!url.match(/^https?:\/\//i)) {
        url = 'http://' + url;
    }
    return window.open(url);
}

const serialize = (obj: any) => {
    const str: string[] = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (Array.isArray(obj[p])) {
                obj[p].forEach((a: any) => {
                    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(a)}`);
                })
            } else {
                if (obj[p] instanceof Date) {
                    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p].toISOString())}`);
                } else {
                    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
                }

            }
        }
    }
    return str.join("&");
}

const convertStringArrayToOptions = (array: string[]): TicketOptionsBase[] => {
    if (array && array.length > 0) {
        return array.map((dept, index) => {
            return {
                key: String(index + 1),
                value: dept
            }
        })
    }

    return [];
}

const formatTime = (sec: number): string => {
    if (sec < 0) {
        return '--:--:--'
    }

    const seconds = (Math.floor(sec % 60) || '00').toString().padStart(2, '0');
    const minutes = (Math.floor(sec / 60) || '00').toString().padStart(2, '0');
    const hours = (Math.floor(sec / 120) || '00').toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`
}

const applyPhoneMask = (phone: string) => {
    if (!phone) {
        return phone;
    }
    return phone.replace(/^(\+\d{1,2})?(\d{3})(\d{3})(\d{4}).*/, "($2) $3-$4");
}

const maskPhone = (phone: string) => {
    if (!phone) {
        return '';
    }
    return `(XXX) XXX-${phone.slice(6, 10)}`
}

const isMinor = (date: Date) => {
    return dayjs().diff(date, 'year') < 12;
}

const isValidDobByAthenaMaxAgeConstraint = (date: Date) => {
    return dayjs().diff(date, 'year') > 125;
}

const convertBlobToBase64 = (file: Blob) => {
    return new Promise<string | ArrayBuffer | null>(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function () {resolve(reader.result);};
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const getTimeDiffInFormattedSeconds = (endDate?: string, startDate?: string): string => {
    dayjs.extend(duration);

    if (!endDate || !startDate) {
        return '';
    }
    const diff = dayjs(endDate).diff(dayjs(startDate), 'second');
    return dayjs.duration(diff, 'seconds').format('HH:mm:ss');
}

const sortBy = <T extends any, TV extends number>(data: T[], property: (item: T) => TV): T[] => {
    return data.sort((a, b) => property(a) - property(b));
}

const isGuid = (value: string) : boolean => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(value);
}

const isScrollable = (element: HTMLElement) => {
    return (element === document.scrollingElement && element.scrollHeight > element.clientHeight) ||
        (element.scrollHeight > element.clientHeight && ["scroll", "auto"].indexOf(getComputedStyle(element).overflowY) >= 0);

}

const getScrollParent = (node: Node & ParentNode | null): Node & ParentNode | null => {
    if (node == null) {
        return null;
    }
    const htmlElement = node as HTMLElement;

    if (isScrollable(htmlElement)) {
        return node;
    } else {
        return getScrollParent(node.parentNode);
    }
}

const isInBounds = (top: number, left: number, bottom: number, right: number, mode: 'vertically' | 'horizontally' | 'both' = 'both'): boolean => {
    const vertically = top >= 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight);
    const horizontally = left >= 0 && right <= (window.innerWidth || document.documentElement.clientWidth);

    switch (mode) {
        case 'horizontally':
            return horizontally;
        case 'vertically':
            return vertically;
        default:
            return vertically && horizontally;
    }
}

const downloadFileFromData = (data: any, fileName: string, dataType: string) => {
    const blob = new Blob([data], {type: dataType});
    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
}
const hasPermission = (permission: string) => {
    const appUserDetails = store.getState().appUserState.appUserDetails;
    return appUserDetails?.permissions?.includes(permission);
}


const utils = {
    getWindowCenter,
    maskPhone,
    formatUtcDate,
    getWindowDimensions,
    formatDate,
    formatDateShortMonth,
    getInitialsFromFullName,
    getDateTime,
    getRelativeTime,
    formatRelativeTime,
    formatPhone,
    clearFormatPhone,
    isString,
    toShortISOLocalString,
    toISOLocalString,
    stringJoin,
    checkIfDateIsntMinValue,
    getBrowserDatePattern,
    groupBy,
    getElementPosition,
    isLoggedIn,
    accumulateInfiniteData,
    parseOptions,
    openWebSite,
    serialize,
    convertStringArrayToOptions,
    formatTime,
    applyPhoneMask,
    getAppParameter,
    isMinor,
    isValidDobByAthenaMaxAgeConstraint,
    convertBlobToBase64,
    getTimeDiffInFormattedSeconds,
    logout,
    isSessionExpired,
    sortBy,
    isGuid,
    isScrollable,
    getScrollParent,
    isInBounds,
    downloadFileFromData,
    initiateACall,
    hasPermission
};

export default utils;
