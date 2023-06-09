import { AgentState, PagedList } from '@shared/models';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { InfiniteData } from 'react-query';
import { RelativeTime } from './types';
import { Option } from '@components/option/option';
import { TicketOptionsBase } from '@pages/tickets/models/ticket-options-base.model';
import store from '@app/store';
import { getMsalInstance } from '@pages/login/auth-config';
import { AppParameter } from '@shared/models/app-parameter.model';
import { logOut, updateUserStatus } from '@shared/store/app-user/appuser.slice';
import duration from 'dayjs/plugin/duration';
import { showCcp } from '@shared/layout/store/layout.slice';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import Logger from '@shared/services/logger';
import i18n from 'i18next';
import { MimeTypes } from '@shared/models/mime-types.enum';
import { Icon } from '@components/svg-icon/icon';
import axios from 'axios';
import { clearAppParameters } from '@shared/store/app/app.slice';
import { SortDirection } from '@shared/models/sort-direction';
import { ForwardingEnabledStatus } from '@shared/layout/components/profile-dropdown';
import { UserStatus } from '@shared/store/app-user/app-user.models';

const getWindowCenter = () => {
  const { width, height } = getWindowDimensions();
  return { x: width / 2, y: height / 2 };
};

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const formatPhone = (phone: string | undefined) => {
  if (!phone) {
    return '';
  }
  const hasCharacterTest = /.*[a-zA-Z].*/;
  if (hasCharacterTest.test(phone)) {
    return phone;
  }
  phone = phone.replaceAll('-', '');
  phone = phone.replaceAll('(', '').replace(')', '');
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
  return phone.replace(/[^\d]/g, '');
};

const initiateACall = (phoneToDial?: string) => {
  store.dispatch(showCcp());
  if (window.CCP.agent && phoneToDial) {
    phoneToDial = phoneToDial.replaceAll('-', '');
    if (!phoneToDial.startsWith('+1')) {
      phoneToDial = `+1${phoneToDial}`;
    }
    const endpoint = connect.Endpoint.byPhoneNumber(phoneToDial);
    window.CCP.agent.connect(endpoint, {
      failure: (e: any) => {
        const error = JSON.parse(e);

        store.dispatch(
          addSnackbarMessage({
            type: SnackbarType.Error,
            message: !!error
              ? i18n.t('contacts.contact_details.error_dialing_phone_with_message', { message: error.message })
              : 'contacts.contact_details.error_dialing_phone',
          }),
        );

        Logger.getInstance().error(i18n.t('contacts.contact_details.error_dialing_phone'), e);
      },
    });
  }
};

const formatDate = (datetime?: string | Date) => {
  if (!datetime) {
    return '';
  }
  const date = new Date(datetime);
  return date.toLocaleDateString('en-US');
};

const formatUtcDate = (date?: Date, format: string = 'ddd, MMM DD, YYYY h:mm A') => {
  dayjs.extend(utc);
  if (!date) {
    return '';
  }
  return dayjs.utc(date).local().format(format);
};

const formatDateShortMonth = (date: string) => {
  return dayjs(date).format('MMM DD, YYYY');
};

const formatPhoneWithoutBrackets = (phone: string) => {
  phone = clearFormatPhone(phone);

  if (phone && phone.startsWith('+1')) {
    phone = phone.substring(2);
  }
  if (phone && phone.length >= 10) {
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, phone.length)}`;
  } else {
    return phone;
  }
};

const getInitialsFromFullName = (username: string): string => {
  if (username.startsWith('+') || /\d/.test(username)) {
    return '#';
  }
  const names = username.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const getDateTime = (dueDate?: Date, dueTime?: string) => {
  let dateTime;
  if (dueDate && dueTime) {
    const time = dayjs(dueTime, 'hh:mm A').format('HH:mm');
    const hours = parseInt(time.split(':')[0]);
    const minutes = parseInt(time.split(':')[1]);
    dateTime = dayjs.utc(dueDate).local().hour(hours).minute(minutes);
  } else if (dueDate) {
    dateTime = dayjs.utc(dueDate).local();
  } else if (dueTime) {
    const time = dayjs(dueTime, 'hh:mm A').format('HH:mm');
    const hours = parseInt(time.split(':')[0]);
    const minutes = parseInt(time.split(':')[1]);
    dateTime = dayjs.utc().local().hour(hours).minute(minutes);
  }
  return dateTime;
};

const formatRelativeTime = (days?: number, hours?: number, minutes?: number, abs = false, minutesFormat = 'm'): string => {
  const getTimePart = (timePart: number) => (abs ? Math.abs(timePart) : timePart);

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
};

const capitalizeFirstLetters = (sentence: string): string => {
  if (!sentence || sentence.length === 0) {
    return '';
  }
  return sentence
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getRelativeTime = (date?: Date, isPast = false): RelativeTime => {
  if (!date) {
    return [];
  }

  if (isPast) {
    const now = dayjs().utc();
    let totalDays = now.diff(dayjs.utc(date), 'days');
    let totalHours = now.add(-totalDays, 'days').diff(dayjs.utc(date), 'hours');
    let totalMinutes = now.add(-totalDays, 'days').add(-totalHours, 'hours').diff(dayjs.utc(date), 'minutes');
    return [totalDays, totalHours, totalMinutes];
  }

  let totalMinutes = dayjs.utc(date).diff(dayjs(), 'minute');
  const isNegative = totalMinutes < 0;
  const totalDays = Math.floor(Math.abs(totalMinutes) / (24 * 60));
  totalMinutes = totalMinutes - (isNegative ? -1 * totalDays : totalDays) * (24 * 60);

  const totalHours = Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes - totalHours * 60;

  return [totalDays, totalHours, totalMinutes];
};

const getAppParameter = (key: string): any => {
  if (store?.getState()?.appState?.appParameters) {
    const keyValue = store.getState().appState.appParameters.find((a: AppParameter) => a.Key === key);
    if (keyValue) {
      return keyValue.Value;
    }
  }
};

const isString = (obj: any) => {
  return typeof obj === 'string' || obj instanceof String;
};

const toShortISOLocalString = (date?: Date) => {
  if (!date) {
    return '';
  }
  dayjs.extend(utc);
  const dateDayJs = dayjs(date).utc().local();
  return `${dateDayJs.format('YYYY').padStart(4, '0')}-${dateDayJs.format('MM-DD')}`;
};

const toISOLocalString = (date?: Date) => {
  if (!date) {
    return '';
  }
  dayjs.extend(utc);
  const dateDayJs = dayjs(date).utc().local();
  return `${dateDayJs.format('YYYY').padStart(4, '0')}-${dateDayJs.format('MM-DDTHH:mm:ss.SSS[Z]')}`;
};

const stringJoin = (separator: string, ...params: Array<string | undefined>) => params.join(separator);

const checkIfDateIsntMinValue = (date: string | Date) => {
  return new Date(date).getFullYear() !== 1;
};

const getBrowserDatePattern = () => {
  const formatter = new Intl.DateTimeFormat().formatToParts();
  return formatter
    .map(part => {
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
    })
    .join('');
};

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
};

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
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

const accumulateInfiniteData = <T extends unknown>(infiniteData: InfiniteData<PagedList<T>> | undefined): T[] => {
  if (infiniteData && infiniteData.pages) {
    return infiniteData.pages.reduce((acc: T[], val) => acc.concat(val.results), []);
  }
  return [];
};

const isLoggedIn = (): boolean => {
  const auth = store.getState()?.appUserState?.auth;

  if (!auth.isLoggedIn) {
    return false;
  }
  const accounts = getMsalInstance()?.getAllAccounts();
  return !!(accounts && accounts[0]);
};

const logout = async () => {
  if (window.CCP?.agent) {
    const offlineState = window.CCP.agent.getAgentStates().filter(a => a.name === UserStatus.Offline)[0];
    try {
      if (window.CCP.agent) window.CCP.agent.setState(offlineState);
    } catch (error: any) {
      window.CCP.agent.setState(offlineState, undefined, {
        enqueueNextState: true,
      });
    }
  }
  await axios
    .get(utils.getAppParameter('ConnectBaseUrl') + utils.getAppParameter('CcpLogoutUrl'), { withCredentials: true })
    .catch(() => {})
    .finally(() => {
      const auth = store.getState()?.appUserState?.auth;
      store.dispatch(clearAppParameters());
      const account = getMsalInstance()?.getAccountByUsername(auth.username);
      if (!!account) {
        getMsalInstance()
          ?.logoutRedirect({
            postLogoutRedirectUri: '/login',
          })
          .then()
          .finally(() => store.dispatch(logOut()));
      } else {
        store.dispatch(logOut());
      }
    });
};

const isSessionExpired = (): boolean => {
  const auth = store.getState()?.appUserState?.auth;
  if (auth && !auth.isLoggedIn) {
    return true;
  }
  if (auth) {
    return auth.expiresOn && dayjs(auth.expiresOn).isBefore(dayjs());
  }
  return false;
};

const parseOptions = <T extends any>(
  data: T[],
  labelExpression: (item: T) => string,
  valueExpression: (item: T) => string,
  assistiveTextExpression?: (item: T) => string,
  objectExpression?: (item: T) => any,
): Option[] => {
  if (!data) {
    return [];
  }

  return data.map(item => ({
    label: labelExpression(item),
    value: valueExpression(item),
    assistiveText: assistiveTextExpression ? assistiveTextExpression(item) : undefined,
    object: objectExpression ? objectExpression(item) : undefined,
  }));
};

const openWebSite = (url: string) => {
  if (!url.match(/^https?:\/\//i)) {
    url = 'http://' + url;
  }
  return window.open(url);
};

const serialize = (obj: any) => {
  const str: string[] = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (Array.isArray(obj[p])) {
        obj[p].forEach((a: any) => {
          str.push(`${encodeURIComponent(p)}=${encodeURIComponent(a)}`);
        });
      } else {
        if (obj[p] instanceof Date) {
          str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p].toISOString())}`);
        } else {
          str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
        }
      }
    }
  }
  return str.join('&');
};

const convertStringArrayToOptions = (array: string[]): TicketOptionsBase[] => {
  if (array && array.length > 0) {
    return array.map((dept, index) => {
      return {
        key: String(index + 1),
        value: dept,
      };
    });
  }

  return [];
};

const formatTime = (sec: number): string => {
  if (sec < 0) {
    return '--:--:--';
  }
  const duration = dayjs.duration(sec, 'seconds');
  return duration.format('HH:mm:ss');
};

const applyPhoneMask = (phone: string) => {
  if (!phone) {
    return phone;
  }
  return phone.replace(/^(\+\d{1,2})?(\d{3})(\d{3})(\d{4}).*/, '($2) $3-$4');
};

const maskPhone = (phone: string) => {
  if (!phone) {
    return '';
  }
  return `(XXX) XXX-${phone.slice(6, 10)}`;
};

const isValidDobByAthenaMaxAgeConstraint = (date: Date) => {
  return dayjs().diff(date, 'year') > 125;
};

const convertBlobToBase64 = (file: Blob) => {
  return new Promise<string | ArrayBuffer | null>(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getTimeDiffInFormattedSeconds = (endDate?: string, startDate?: string): string => {
  dayjs.extend(duration);

  if (!endDate || !startDate) {
    return '';
  }
  const diff = dayjs(endDate).diff(dayjs(startDate), 'second');
  return dayjs.duration(diff, 'seconds').format('HH:mm:ss');
};

const formatSeconds = (seconds: number = 0) => {
  dayjs.extend(duration);

  const beforeFormat = dayjs.duration(seconds, 'seconds');
  return beforeFormat.format('HH:mm:ss');
};

const sortBy = <T extends any, TV extends number>(data: T[], property: (item: T) => TV): T[] => {
  return data.sort((a, b) => property(a) - property(b));
};

const isGuid = (value: string): boolean => {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return guidRegex.test(value);
};

const isScrollable = (element: HTMLElement) => {
  return (
    (element === document.scrollingElement && element.scrollHeight > element.clientHeight) ||
    (element.scrollHeight > element.clientHeight && ['scroll', 'auto'].indexOf(getComputedStyle(element).overflowY) >= 0)
  );
};

const getScrollParent = (node: (Node & ParentNode) | null): (Node & ParentNode) | null => {
  if (node == null) {
    return null;
  }
  const htmlElement = node as HTMLElement;

  if (isScrollable(htmlElement)) {
    return node;
  } else {
    return getScrollParent(node.parentNode);
  }
};

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
};

const downloadFileFromData = (data: any, fileName: string, dataType: string) => {
  const blob = new Blob([data], { type: dataType });
  const objectUrl: string = URL.createObjectURL(blob);
  const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
};
const hasPermission = (permission: string) => {
  const appUserDetails = store.getState().appUserState.appUserDetails;
  return appUserDetails?.permissions?.includes(permission);
};

const isDateInNextSevenDays = (date: Date) => {
  return Math.abs(dayjs().diff(date, 'day')) <= 7 && (dayjs().isBefore(date) || dayjs().isSame(date, 'day'));
};

const isDateTimeInPast = (date: Date) => {
  return dayjs(date).isBefore(dayjs(), 'milliseconds');
};

const determineMimeTypeIcon = (mimeType: string, extension?: string) => {
  switch (mimeType) {
    case MimeTypes.Jpg:
    case MimeTypes.Jpeg:
      return Icon.JpgMime;
    case MimeTypes.Tiff:
      return Icon.TiffMime;
    case MimeTypes.Png:
      return Icon.PngMime;
    case MimeTypes.Pdf:
      return Icon.PdfMime;
    case MimeTypes.Txt:
      return Icon.TxtMime;
    case MimeTypes.Doc:
      return Icon.DocMime;
    case MimeTypes.DocX:
      return Icon.DocXMime;
    case MimeTypes.Xls:
      return Icon.XlsMime;
    case MimeTypes.XlsX:
      return Icon.XlsXMime;
    case MimeTypes.Rar:
      return Icon.RarMime;
    case MimeTypes.Zip:
    case MimeTypes.ZipCompressed:
      return Icon.ZipMime;
    case MimeTypes.Binary:
      switch (extension) {
        case 'rar':
          return Icon.RarMime;
        case 'jpeg':
          return Icon.JpgMime;
        default:
          return Icon.FallbackMime;
      }
    default:
      return Icon.FallbackMime;
  }
};
const dynamicSort = (sortField: string, sortDirection: SortDirection) => {
  var sortDirectionValue = 1;
  if (sortDirection === SortDirection.Desc) {
    sortDirectionValue = -1;
  }
  return function (a, b) {
    if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    } else {
      if (!a[sortField] && a[sortField] !== 0) a[sortField] = '';
      if (!b[sortField] && a[sortField] !== 0) b[sortField] = '';

      if (a[sortField] < b[sortField]) {
        return -1 * sortDirectionValue;
      } else if (a[sortField] > b[sortField]) {
        return sortDirectionValue;
      } else {
        return 0;
      }
    }
  };
};
const addPracticeBranding = practiceBranding => {
  const root = document.body;
  const hasDash = practiceBranding.primaryColor.startsWith('#');
  const primaryWithoutDash = hasDash ? practiceBranding.primaryColor.substring(1) : practiceBranding.primaryColor;

  //Primary
  root.style.setProperty('--color-primary-default', `${hasDash ? '' : '#'}${practiceBranding.primaryColor}`);
  root.style.setProperty('--color-primary-900', `${hasDash ? '' : '#'}${practiceBranding.primaryColor}`);
  root.style.setProperty('--color-primary-800', `${hasDash ? '' : '#'}${practiceBranding.primaryColor}`);
  root.style.setProperty('--color-primary-600', `${hasDash ? '' : '#'}${practiceBranding.primaryColor}`);
  root.style.setProperty('--color-primary-500', `${hasDash ? '' : '#'}${practiceBranding.primaryColor}`);
  root.style.setProperty('--color-primary-500-rgb', `${hexToRGB(primaryWithoutDash)}`);
  root.style.setProperty('--button-primary-background-color', `${hasDash ? '' : '#'}${practiceBranding.primaryColor}`);

  //Hover
  root.style.setProperty('--color-primary-700', `${hasDash ? '' : '#'}${practiceBranding.hoverColor}`);
  root.style.setProperty('--button-hover-background-color', `${hasDash ? '' : '#'}${practiceBranding.hoverColor}`);

  //Focus
  root.style.setProperty('--color-primary-400', `${hasDash ? '' : '#'}${practiceBranding.focusedColor}`);
  root.style.setProperty('--button-focused-background-color', `${hasDash ? '' : '#'}${practiceBranding.focusedColor}`);

  //Secondary
  root.style.setProperty('--color-primary-300', `${hasDash ? '' : '#'}${practiceBranding.secondaryColor}`);
  root.style.setProperty('--color-primary-200', `${hasDash ? '' : '#'}${practiceBranding.secondaryColor}`);

  //Tertiary Color
  root.style.setProperty('--color-burgundy', `#${practiceBranding.tertiaryColor}`);
};
const hexToRGB = hex => {
  hex = '0x' + hex;
  let r = (hex >> 16) & 0xff;
  let g = (hex >> 8) & 0xff;
  let b = hex & 0xff;
  return r + ', ' + g + ', ' + b;
};
export const spaceBetweenCamelCaseWords = (phrase: string) => {
  return phrase.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5').trim();
};
const isObject = object => {
  return object != null && typeof object === 'object';
};

export const deepEqual = (object1: any, object2: any) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }
  return true;
};

const updateCCPForwardingEnabled = (isForwardingEnabled: boolean) => {
  const newStatus = isForwardingEnabled ? ForwardingEnabledStatus : 'Available';
  if (store.getState().appUserState.status === newStatus) {
    return;
  }
  if (window.CCP.agent) {
    const state = store.getState()?.appUserState?.agentStates.find((agentState: AgentState) => agentState.name === newStatus);
    window.CCP.agent.setState(state, {
      failure: () => {
        store.dispatch(
          addSnackbarMessage({
            type: SnackbarType.Error,
            message: 'ccp.could_not_update_to_fw_enabled',
          }),
        );
      },
    });
  }
  store.dispatch(updateUserStatus(newStatus));
};

const convertTime24To12 = (time24: string) => {
  dayjs.extend(utc);
  const [hourString, minute] = time24.split(':');
  return dayjs().startOf('day').add(Number(hourString), 'hour').add(Number(minute), 'minutes').format('h:mm A');
};

const getListOfHours = (isTime24 = false, from: string = '00:00', to: string = '23:59', minInterval: number = 30) => {
  const toMinutes = (value: string) =>
    value
      .split(':')
      .map(Number)
      .reduce((h, m) => {
        return Number(h) * 60 + +Number(m);
      });

  const toTimeString = (min: number) => {
    const time24 = (Math.floor(min / 60) + ':' + (min % 60).toString().padEnd(2, '0')).replace(/\b\d\b/, '0$&');
    return isTime24 ? time24 : convertTime24To12(time24);
  };

  const start = toMinutes(from);
  const end = toMinutes(to);

  return Array.from({ length: Math.floor((end - start) / minInterval) + 1 }, (_, i) => toTimeString(start + i * minInterval));
};

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
  hasPermission,
  formatSeconds,
  isDateInNextSevenDays,
  isDateTimeInPast,
  determineMimeTypeIcon,
  capitalizeFirstLetters,
  spaceBetweenCamelCaseWords,
  dynamicSort,
  addPracticeBranding,
  formatPhoneWithoutBrackets,
  deepEqual,
  updateCCPForwardingEnabled,
  convertTime24To12,
  getListOfHours,
};

export default utils;
