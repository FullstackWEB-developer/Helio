import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from 'react-query';
import {GetPatientChartTabSettings} from '@constants/react-query-constants';
import {getPatientChartTabSettings, savePatientChartTabSettings} from '@shared/services/lookups.service';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import Button from '@components/button/button';
import {PatientChartVisibility} from '@pages/configurations/models/patient-chart-visibility.model';
import Checkbox from '@components/checkbox/checkbox';
import {useEffect, useState} from 'react';
import utils from '@shared/utils/utils';

const PatientChartTabs = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [defaultSettings, setDefaultSettings] = useState<PatientChartVisibility>();
    const [settings, setSettings] = useState<PatientChartVisibility>();
    const [isDirty, setDirty] = useState<boolean>();

    useEffect(() => {
        if (!settings || !defaultSettings) {
            return;
        }
        setDirty(!utils.deepEqual(settings, defaultSettings))
    }, [settings, defaultSettings])

    const savePatientChartTabSettingsMutation = useMutation(savePatientChartTabSettings, {
        onSuccess:() => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'configuration.patient_chart_tabs.update_success'
            }));
            setDefaultSettings(settings!);
        }
    });

    const {isLoading, isRefetching} = useQuery(GetPatientChartTabSettings, () => getPatientChartTabSettings(), {
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'common.error'
            }));
        },
        onSuccess: (data) => {
            setSettings(data);
            setDefaultSettings(data);
        }
    });

    if (isLoading || isRefetching) {
        return <Spinner fullScreen={true} />
    }

    const onSubmit = () => {
        if (settings) {
            savePatientChartTabSettingsMutation.mutate(settings);
        }
    }



    const reset = () => {
        setSettings(defaultSettings);
    }

    return <div className='w-10/12 overflow-auto h-full p-6 pr-4'>
            <h5 className='pb-6'>{t('configuration.patient_chart_tabs.title')}</h5>
            <div className='body2 pb-8'>
                {t('configuration.patient_chart_tabs.description')}
            </div>
                <div className='grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10'>
                    <Checkbox name='appointments' data-testid='appointments'
                              checked={settings?.isAppointmentsVisible}
                              onChange={(event) => setSettings(settings => {
                                  return {
                                      ...settings,
                                      isAppointmentsVisible: event.checked
                                  } as PatientChartVisibility
                              })}
                              label='configuration.patient_chart_tabs.appointments' />
                    <Checkbox name='insurance' data-testid='insurance'
                              checked={settings?.isInsuranceVisible}
                              onChange={(event) => setSettings(settings => {
                                  return {
                                      ...settings,
                                      isInsuranceVisible: event.checked
                                  } as PatientChartVisibility
                              })}
                              label='configuration.patient_chart_tabs.insurance' />
                    <Checkbox name='patientCases' data-testid='patientCases'
                              checked={settings?.isPatientCasesVisible}
                              onChange={(event) => setSettings(settings => {
                                  return {
                                      ...settings,
                                      isPatientCasesVisible: event.checked
                                  } as PatientChartVisibility
                              })}
                              label='configuration.patient_chart_tabs.patient_cases' />
                    <Checkbox name='medications' data-testid='medications'
                              checked={settings?.isMedicationsVisible}
                              onChange={(event) => setSettings(settings => {
                                  return {
                                      ...settings,
                                      isMedicationsVisible: event.checked
                                  } as PatientChartVisibility
                              })}
                              label='configuration.patient_chart_tabs.medications' />
                    <Checkbox name='testResults' data-testid='testResults'
                              checked={settings?.isTestResultsVisible}
                              onChange={(event) => setSettings(settings => {
                                  return {
                                      ...settings,
                                      isTestResultsVisible: event.checked
                                  } as PatientChartVisibility
                              })}
                              label='configuration.patient_chart_tabs.test_results' />
                </div>
                <div className="flex flex-row w-full">
                    <Button
                        data-testid='submit'
                        type='submit'
                        buttonType='medium'
                        label='common.save'
                        onClick={onSubmit}
                        disabled={!isDirty}
                        isLoading={savePatientChartTabSettingsMutation.isLoading}
                    />
                    <Button label='common.cancel'
                            data-testid='reset'
                            className=' ml-8'
                            buttonType='secondary'
                            onClick={() => reset()}
                            disabled={!isDirty || savePatientChartTabSettingsMutation.isLoading}
                    />
                </div>
        </div>
}

export default PatientChartTabs;
