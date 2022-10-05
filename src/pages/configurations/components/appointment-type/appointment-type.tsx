import { ConfigurationsPath } from '@app/paths';
import SvgIcon, { Icon } from '@components/svg-icon';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import { useState } from 'react';
import {useTranslation} from 'react-i18next';
import './appointment-type.scss';
import {useHistory} from 'react-router-dom';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import classnames from 'classnames';
import { useQuery } from 'react-query';
import { getAppointmentTypeSummary } from '@pages/appointments/services/appointments.service';
import Spinner from '@components/spinner/Spinner';
import { AppointmentTypeSummary } from '@pages/appointments/models/appointment-type-summary';
import { GetAppointmentTypeSummary } from '@constants/react-query-constants';

const AppointmentType = () => {
    const {t} = useTranslation();
    const [patientPagedResults, setPatientPagedResults] = useState<AppointmentTypeSummary[]>([]);
    const history = useHistory();
    const tableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: patientPagedResults,
        headerClassName: 'h-12',
        rowClass: 'h-14',
        pageable: true,
        pageSize: 15,
        paginationPosition: 'both',
        columns: [
            {
                title: 'configuration.appointment_type_list.column_names.ehr_emr_appointment_id',
                field: 'nameOnEmr',
                widthClass: 'w-1/3',
                rowClassname: 'body2',
                render: (nameOnEmr: string, row: AppointmentTypeSummary) => {
                    if(row.existsOnEmr)
                        return (<div className='flex items-center h-full'>
                            <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2', {'exists-on-emr': !row.existsOnEmr})}>
                                {nameOnEmr ? nameOnEmr : "-"}
                            </div>
                        </div>)
                    else
                        return (
                            <div className='flex items-center h-full'>
                                <ToolTipIcon
                                    icon={Icon.Error}
                                    iconFillClass='danger-icon'
                                    placement='right-start'
                                >
                                    <div className='flex flex-col p-6 w-80'>
                                        <span className='subtitle2'>{t('configuration.appointment_type_list.not_exists_on_emr')}</span>
                                    </div>
                                </ToolTipIcon>
                                <div className='flex items-center ml-3 h-full'>
                                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2', {'exists-on-emr': !row.existsOnEmr})}>
                                        {nameOnEmr ? nameOnEmr : "-"}
                                    </div>
                                </div>
                            </div>
                        )
                }
            },
            {
                title: 'configuration.appointment_type_list.column_names.helio_appointment_name',
                field: 'name',
                widthClass: 'w-1/3',
                rowClassname: 'body2',
                render: (name: string, row: AppointmentTypeSummary) => {
                    if(row.isMapped)
                        return (<span className='flex items-center h-full'>
                            <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2', {'exists-on-emr': !row.existsOnEmr})}>
                                {name}
                            </div>
                        </span>)
                    else
                        return (<span className={classnames('flex items-center h-full not-available body2', {'exists-on-emr': !row.existsOnEmr})}>{t('configuration.appointment_type_list.not_available')}</span>)
                }
            },
            {
                title: 'configuration.appointment_type_list.column_names.description',
                field: 'description',
                widthClass: 'w-1/3',
                rowClassname: 'body2',
                render: (description: string, row: AppointmentTypeSummary) => {
                    if(row.isMapped)
                        return (<span className='flex items-center h-full'>
                            <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2', {'exists-on-emr': !row.existsOnEmr})}>
                                {description}
                            </div>
                        </span>)
                    else
                        return (<span className={classnames('flex items-center h-full not-available body2', {'exists-on-emr': !row.existsOnEmr})}>{t('configuration.appointment_type_list.not_available')}</span>)
                }
            },
            {
                title: '',
                field: 'id',
                alignment: 'start',
                widthClass: 'w-10 flex items-center justify-center h-full',
                render: (id: string, row: AppointmentTypeSummary) => {
                    return (<SvgIcon dataTestId={`appointment-type-${id}`} type={Icon.Edit} className={`icon-medium  ${row.existsOnEmr ? 'cursor-pointer' : 'cursor-not-allowed'}`} fillClass={row.existsOnEmr ? 'edit-icon' : 'rgba-038-fill'} onClick={() => {
                        if(row.existsOnEmr){
                            const pathName = `${ConfigurationsPath}/appointment-type/${id}`;
                            history.push({
                                pathname: pathName,
                                state: {
                                    nameOnEmr: row.nameOnEmr
                                }
                            });
                        }
                    }}/>);
                }
            }
        ]
    }
    const {isLoading, isFetching} =
    useQuery([GetAppointmentTypeSummary],() => getAppointmentTypeSummary(), {
        onSuccess: (data) => setPatientPagedResults(data),
        onError: () => setPatientPagedResults([])
    });
    return (
        <div className='appointment-type overflow-auto h-full p-6 pr-4'>
            <h5 className='appointment-type-header'>{t('configuration.appointment_type_list.title')}</h5>
            <div className='body2'>{t('configuration.appointment_type_list.description')}</div>
            {isLoading ||isFetching ? (
                <Spinner size='large-40' className='pt-2' />
            ):(
                <div>
                    <Table model={tableModel} />
                </div>
            )}
        </div> 
            
    );
}

export default AppointmentType;
