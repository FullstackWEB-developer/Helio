import SvgIcon, {Icon} from '@components/svg-icon';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {getLookupValues} from '@shared/services/lookups.service';
import classNames from 'classnames';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {SystemReport} from '../models/system-report.model';
import {getFormattedTime} from '../utils/constants';
import './system-reports-table.scss';

const SystemReportTable = ({data}: {data: SystemReport[]}) => {

    const {t} = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
    }, [dispatch]);
    const reasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));

    const displayPatientRating = (ratio: number) => {
        if (ratio == 0) return null;
        if (ratio >= 0 && ratio < 40) {
            return <SvgIcon
                className='icon-medium mr-3'
                fillClass='rating-widget-unsatisfied'
                wrapperClassName='cursor-pointer'
                type={Icon.RatingDissatisfied} />;
        } else if (ratio >= 40 && ratio < 60) {
            return <SvgIcon
                className='icon-medium mr-3'
                fillClass='rating-widget-neutral'
                wrapperClassName='cursor-pointer'
                type={Icon.RatingSatisfied} />;
        } else {
            return <SvgIcon
                className='icon-medium mr-3'
                fillClass='rating-widget-satisfied'
                wrapperClassName='cursor-pointer'
                type={Icon.RatingVerySatisfied} />;
        }
    }

    return (
        <div data-testid="system-report-grid" className='mt-6 pt-4 bg-white rounded-lg'>
            <div className='px-6 flex pb-3'>
                <div className='h7 w-5/24'>{t('reports.system_reports.title')}</div>
            </div>

            <div className='grid grid-cols-3 system-report-grid system-report-grid-head-row subtitle3'>
                <div>{t('reports.system_reports.channel')}</div>
                <div>{t('reports.system_reports.kpi')}</div>
                <div>{t('reports.system_reports.value')}</div>
            </div>

            <div className='grid grid-cols-3 system-report-grid system-report-grid-data-row'>
                <div className='subtitle2'><span>{t('reports.system_reports.tickets')}</span></div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.total_tickets_created')}</span></div>
                    <div className='h-10'><span>{t('reports.system_reports.average_patient_satisfaction_rating')}</span></div>
                </div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{data[0].totalTickets.toLocaleString()}</span></div>
                    <div className='h-10'>
                        <span className='flex items-center'>
                            {displayPatientRating(data[0].averagePatientSatisfactionRatingForTickets)}
                            {`${data[0].averagePatientSatisfactionRatingForTickets}%`}
                        </span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-3 system-report-grid system-report-grid-data-row'>
                <div className='subtitle2'><span>{t('reports.system_reports.voice')}</span></div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.total_inbound_calls')}</span></div>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.total_outbound_calls')}</span></div>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.average_response_time')}</span></div>
                    <div className='h-10'><span>{t('reports.system_reports.average_patient_satisfaction_rating')}</span></div>
                </div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{data[0].totalInboundCalls.toLocaleString()}</span></div>
                    <div className='h-10 border-b'><span>{data[0].totalOutboundCalls.toLocaleString()}</span></div>
                    <div className='h-10 border-b'><span>{getFormattedTime(data[0].averageCallResponseTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}</span></div>
                    <div className='h-10'>
                        <span className='flex items-center'>
                            {displayPatientRating(data[0].averagePatientSatisfactionRatingForVoice)}
                            {`${data[0].averagePatientSatisfactionRatingForVoice}%`}
                        </span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-3 system-report-grid system-report-grid-data-row'>
                <div className='subtitle2'><span>{t('reports.system_reports.chat')}</span></div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.total_inbound_chats')}</span></div>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.average_response_time')}</span></div>
                    <div className='h-10'><span>{t('reports.system_reports.average_patient_satisfaction_rating')}</span></div>
                </div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{data[0].totalInboundChats.toLocaleString()}</span></div>
                    <div className='h-10 border-b'><span>{getFormattedTime(data[0].averageChatResponseTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}</span></div>
                    <div className='h-10'>
                        <span className='flex items-center'>
                            {displayPatientRating(data[0].averagePatientSatisfactionRatingForChat)}
                            {`${data[0].averagePatientSatisfactionRatingForChat}%`}
                        </span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-3 system-report-grid system-report-grid-data-row'>
                <div className='subtitle2'><span>{t('reports.system_reports.sms')}</span></div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.total_incoming_sms')}</span></div>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.total_outgoing_sms')}</span></div>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.average_response_time')}</span></div>
                    <div className='h-10'><span>{t('reports.system_reports.average_patient_satisfaction_rating')}</span></div>
                </div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{data[0].totalIncomingSms.toLocaleString()}</span></div>
                    <div className='h-10 border-b'><span>{data[0].totalOutgoingSms.toLocaleString()}</span></div>
                    <div className='h-10 border-b'><span>{getFormattedTime(data[0].averageSmsResponseTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}</span></div>
                    <div className='h-10'>
                        <span className='flex items-center'>
                            {displayPatientRating(data[0].averagePatientSatisfactionRatingForSms)}
                            {`${data[0].averagePatientSatisfactionRatingForSms}%`}
                        </span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-3 system-report-grid system-report-grid-data-row'>
                <div className='subtitle2'><span>{t('reports.system_reports.email')}</span></div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.total_initial_inbound_emails')}</span></div>
                    <div className='h-10 border-b'><span>{t('reports.system_reports.average_response_time')}</span></div>
                    <div className='h-10'><span>{t('reports.system_reports.average_patient_satisfaction_rating')}</span></div>
                </div>
                <div className='flex flex-col body2'>
                    <div className='h-10 border-b'><span>{data[0].totalInboundEmails.toLocaleString()}</span></div>
                    <div className='h-10 border-b'><span>{getFormattedTime(data[0].averageEmailResponseTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}</span></div>
                    <div className='h-10'>
                        <span className='flex items-center'>
                            {displayPatientRating(data[0].averagePatientSatisfactionRatingForEmail)}
                            {`${data[0].averagePatientSatisfactionRatingForEmail}%`}
                        </span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-3 system-report-grid system-report-grid-data-row'>
                <div className='subtitle2'><span>{t('reports.system_reports.tickets_by_reason')}</span></div>
                <div className='flex flex-col body2'>
                    <>
                        {
                            data[0].ticketCountsByReason.map((ticketByReasonSection, index) => {
                                const ticketReason = reasons.find(r => r.value == ticketByReasonSection.reason);
                                return !!ticketReason ? <div key={ticketReason.label} className={classNames('h-10', {'border-b': index != data[0].ticketCountsByReason.length - 1})}><span >{ticketReason.label}</span></div>
                                    : <div key={`other-${index}`} className={classNames('h-10', {'border-b': index != data[0].ticketCountsByReason.length - 1})}><span>{t('common.other')}</span></div>
                            })
                        }
                    </>
                </div>
                <div className='flex flex-col body2'>
                    <>
                        {
                            data[0].ticketCountsByReason.map((ticketByReasonSection, index) =>
                                <div key={ticketByReasonSection.reason} className={classNames('h-10', {'border-b': index != data[0].ticketCountsByReason.length - 1})}>
                                    <span className='flex'>
                                        <span className='w-28 pr-7'>{ticketByReasonSection.count.toLocaleString()}</span>
                                        <span>{`${data[0].ticketRatiosByReason[index].count.toLocaleString()}%`}</span>
                                    </span>
                                </div>
                            )
                        }
                    </>
                </div>
            </div>

            <div className='h-8'></div>
        </div>
    );
}

export default SystemReportTable;