import { KeyValuePair } from '@shared/models';
import { Dispatch } from '@reduxjs/toolkit';
import { setError } from '@components/search-bar/store/search-bar.slice';
import { setAllProviders, setLoading, setLocations, setMetricOptions, setProviders, setRatingOptions, setUserList } from '../store/lookups/lookups.slice';
import Api from './api';
import store from '../../app/store';
import { endGetLookupValuesRequest, setFailure, setLookupValues, startGeLookupValuesRequest } from '@pages/tickets/store/tickets.slice';
import { User } from '../models/user';
import { LookupValue } from '@pages/tickets/models/lookup-value';
import { TicketLookupValue } from '@pages/tickets/models/ticket-lookup-values.model';
import { SecuritySettings } from '@pages/configurations/models/security-settings';
import { PracticeBranding } from '@shared/models/practice-branding';
import { GeneralSettingsModel } from '@pages/configurations/models/general-settings.model';
import { PatientChartVisibility } from '@pages/configurations/models/patient-chart-visibility.model';
import i18n from 'i18next';
import { ChatWidgetModel } from '@pages/configurations/models/chat-widget.model';
import { OperationSettingModel, TimeZoneModel } from '@pages/configurations/models/business-hours-type.model';

const parametersUrl = '/lookups/parameters';
const lookupsUrl = '/lookups';
const lookupsValueUrl = '/lookups/values';
const operationUrl = `${lookupsUrl}/operations`;

export const getProviders = () => {
  const url = `${lookupsUrl}/providers`;

  const providers = store.getState().lookupsState.providerList;
  return async (dispatch: Dispatch) => {
    if (!providers || providers.length === 0) {
      dispatch(setError(false));
      dispatch(setLoading(true));
      await Api.get(url)
        .then(response => {
          dispatch(setProviders(response.data));
        })
        .catch((error: any) => {
          if (error.response?.status === 404) {
            dispatch(setProviders(undefined));
          } else {
            dispatch(setError(true));
            dispatch(setProviders(undefined));
            dispatch(setLoading(false));
          }
        });
    }
  };
};

export const getAllProviders = () => {
  const url = `${lookupsUrl}/providers`;
  const providers = store.getState().lookupsState.allProviderList;
  return async (dispatch: Dispatch) => {
    if (!providers || providers.length === 0) {
      dispatch(setError(false));
      dispatch(setLoading(true));
      await Api.get(url, {
        params: {
          includeAll: true,
        },
      })
        .then(response => {
          dispatch(setAllProviders(response.data));
        })
        .catch((error: any) => {
          if (error.response?.status === 404) {
            dispatch(setAllProviders(undefined));
          } else {
            dispatch(setError(true));
            dispatch(setAllProviders(undefined));
            dispatch(setLoading(false));
          }
        });
    }
  };
};

export const getLocations = () => {
  const url = lookupsUrl + '/departments';
  const departments = store.getState().lookupsState.locationList;
  return async (dispatch: Dispatch) => {
    if (!departments || departments.length === 0) {
      dispatch(setError(false));
      dispatch(setLoading(true));
      await Api.get(url)
        .then(response => {
          dispatch(setLocations(response.data));
        })
        .catch(error => {
          if (error.response?.status === 404) {
            dispatch(setLocations(undefined));
          } else {
            dispatch(setError(true));
            dispatch(setLocations(undefined));
            dispatch(setLoading(false));
          }
        });
    }
  };
};

export const getStates = async () => {
  const result = await Api.get(`${lookupsUrl}/states`);
  return result.data;
};

export const getUserList = () => {
  const url = '/users';
  const userList = store.getState().lookupsState.userList;
  return async (dispatch: Dispatch) => {
    if (!userList || userList.length === 0) {
      try {
        const response = await Api.get(url, {
          params: {
            pageSize: 1000,
          },
        });
        const list = response.data.results as User[];
        dispatch(setUserList(list));
      } catch (error: any) {
        dispatch(setFailure(error.message));
      }
    }
  };
};

export const getMetricOptions = () => {
  const url = 'lookups/CurrentMetricEnum';
  const metricOptions = store.getState().lookupsState.metricOptions;
  return async (dispatch: Dispatch) => {
    if (!metricOptions || metricOptions.length === 0) {
      try {
        const response = await Api.get(url);
        let list = response.data as KeyValuePair[];
        if (list && list.length > 0) {
          const removedOptionKeys = [2, 3, 9, 12, 13];
          list = list.filter(a => !removedOptionKeys.includes(+a.key));
          list = list.map(a => {
            return {
              ...a,
              value: i18n.t(`statuses.options.${a.key}`),
            };
          });
          dispatch(setMetricOptions(list));
        }
      } catch (error: any) {
        dispatch(setFailure(error.message));
      }
    }
  };
};

export const getRatingOptions = () => {
  const url = 'lookups/Rating';
  const ratingOptions = store.getState().lookupsState.ratingOptions;
  return async (dispatch: Dispatch) => {
    if (!ratingOptions || ratingOptions.length === 0) {
      try {
        const response = await Api.get(url);
        dispatch(setRatingOptions(response.data));
      } catch (error: any) {
        dispatch(setFailure(error.message));
      }
    }
  };
};

export const getLookupValues = (key: string, forceUpdate: boolean = false) => {
  const getLookupValuesUrl = `/lookups/values/${key}`;
  const stateLookupValues = store.getState().ticketState.lookupValues?.find((a: LookupValue) => a.key === key) || undefined;
  return async (dispatch: Dispatch) => {
    if (!stateLookupValues || forceUpdate) {
      dispatch(startGeLookupValuesRequest());
      await Api.get(getLookupValuesUrl)
        .then(response => {
          dispatch(setLookupValues({ key: key, result: response.data }));
          dispatch(endGetLookupValuesRequest(''));
        })
        .catch(() => {
          dispatch(endGetLookupValuesRequest('ticket-new.error'));
        });
    }
  };
};

export const upsertLookupValue = async (
  label: string,
  value: string,
  key: string,
  isUpdate: boolean,
  isReadOnly: boolean = false,
  intentName: string | undefined = undefined,
  parentValue: string = '',
) => {
  let request: TicketLookupValue = {
    label: label,
    value: value,
    key: key,
    parentValue: parentValue,
    isReadOnly: isReadOnly,
    intentName: intentName,
  };

  if (isUpdate) {
    await Api.put(lookupsValueUrl, request);
  } else {
    await Api.post(lookupsValueUrl, request);
  }
};

export const deleteLookupValue = async (key: string, value: string) => {
  await Api.delete(`${lookupsValueUrl}/${key}/${value}`);
};
export const uploadAssetFile = async (logo: File) => {
  const options = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  let formData = new FormData();
  formData.append('formFile', logo);
  const { data } = await Api.post<{ fileName: string; success: boolean }>(`${parametersUrl}/upload-asset-file`, formData, options);
  return data;
};
export const savePracticeBranding = async (payload: PracticeBranding) => {
  await Api.post(`${parametersUrl}/practice-branding`, payload);
};
export const getPracticeBranding = async () => {
  const { data } = await Api.get<PracticeBranding>(`${parametersUrl}/practice-branding`);
  return data;
};
export const getAppointmentReminders = async () => {
  const { data } = (await Api.get<string>(`${parametersUrl}/appointment-reminder`)) || {};
  return data;
};
export const setAppointmentReminders = async (newValue: string) => {
  await Api.post(`${parametersUrl}/set-appointment-reminder?newValue=${encodeURIComponent(newValue)}`);
};

export const getSecuritySettings = async () => {
  const { data } = await Api.get<SecuritySettings>(`${parametersUrl}/security-settings`);
  return data;
};
export const saveSecuritySettings = async (payload: SecuritySettings) => {
  await Api.post(`${parametersUrl}/security-settings`, payload);
};

export const getGeneralSetting = async () => {
  const { data } = await Api.get<GeneralSettingsModel>(`${parametersUrl}/general-settings`);
  return data;
};
export const setGeneralSetting = async (payload: GeneralSettingsModel) => {
  await Api.post(`${parametersUrl}/general-settings`, payload);
};

export const getPatientChartTabSettings = async (): Promise<PatientChartVisibility> => {
  const { data } = await Api.get<PatientChartVisibility>(`${parametersUrl}/patient-tabs`);
  return data;
};
export const savePatientChartTabSettings = async (payload: PatientChartVisibility) => {
  await Api.post(`${parametersUrl}/patient-tabs`, payload);
};

export const getChatWidget = async (): Promise<ChatWidgetModel> => {
  const { data } = await Api.get<ChatWidgetModel>(`${parametersUrl}/chat-widget`);
  return data;
};
export const saveChatWidget = async (payload: any) => {
    await Api.post(`${parametersUrl}/chat-widget`, {
        autoStartDelay: payload.timeDelay,
        autoStartEnabled: payload.autoStart,
        displayPosition: Number(payload.displayPosition),
        domains: payload.webChat.length > 0 ? payload.webChat.map( x => x.domain ) : [],
        idleDelay: Number(payload.idleDelay),
        idleWarningDelay: Number(payload.idleWarningDelay)
    } as ChatWidgetModel);
}

export const getTimeZones = async () : Promise<TimeZoneModel[]> => {
    const result = await Api.get(`${operationUrl}/timezones`);
    return result.data;
};

export const getOperationSettings = async () => {
  const { data } = await Api.get<OperationSettingModel>(`${operationUrl}/settings`);
  return data;
};

export const saveOperationSettings = async (payload: OperationSettingModel) => {
  const { data } = await Api.post<OperationSettingModel>(`${operationUrl}/settings`, payload);
  return data;
};
