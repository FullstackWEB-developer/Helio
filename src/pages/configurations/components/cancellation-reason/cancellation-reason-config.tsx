import React, {useState} from 'react';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import {GetCancellationReasonsEditable} from '@constants/react-query-constants';
import {getCancellationReasonsEditable} from '@pages/appointments/services/appointments.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import {CancellationReasonExtended} from '../../models/CancellationReasonExtended';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
import './cancellation-reason-config.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
import classNames from 'classnames';
import {useHistory} from 'react-router';
import {DefaultPagination, Paging} from '@shared/models';
import Pagination from '@components/pagination';
import CancellationReasonDefaults from './cancellation-reason-defaults';


const CancellationReasonConfig = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const pageSize = 8;
    const [paginationProperties, setPaginationProperties] = useState<Paging>({...DefaultPagination, pageSize});
    const [reasonsPagedResults, setReasonsPagedResults] = useState<CancellationReasonExtended[]>([]);
    const {isFetching, data} = useQuery<CancellationReasonExtended[]>(GetCancellationReasonsEditable, () => getCancellationReasonsEditable(), {
        onSuccess: (data) => paginateResults(data),
        onError: () => {
            setReasonsPagedResults([]);
            dispatch(addSnackbarMessage({
                message: 'configuration.cancellation_reason.error_fetching_reasons',
                type: SnackbarType.Error
            }))
        }
    });

    const paginateResults = (data: CancellationReasonExtended[]) => {
        if (data && data.length > 1) {
            setPaginationProperties({
                pageSize: pageSize,
                page: 1,
                totalCount: data.length,
                totalPages: Math.ceil(data.length / pageSize),
            });
            setReasonsPagedResults(data.slice(0, pageSize));
        }
    }

    const handlePageChange = (p: Paging) => {
        setPaginationProperties(p);
        if (data && data.length) {
            setReasonsPagedResults(data.slice(p.pageSize * (p.page - 1),
                p.pageSize * p.page))
        }
    }

    const onEditIconClick = (existsOnEMR: boolean, id: string) => {
        if (!existsOnEMR) return;
        history.push(`/configurations/cancellation-reasons/${id}`);
    }

    const paginationDisplayConditions = paginationProperties.totalCount !== DefaultPagination.totalCount && data;

    return (
        <div className='px-6 pt-7 flex flex-1 flex-col group overflow-y-auto'>
            <h6 className='pb-7'>{t('configuration.cancellation_reason.title')}</h6>
            <div className={classNames('body2 whitespace-pre-line', {'pb-14': !paginationDisplayConditions})} >{t('configuration.cancellation_reason.description')}</div>
            <CancellationReasonDefaults />
            {
                paginationDisplayConditions && <div className='py-4 ml-auto'><Pagination value={paginationProperties} onChange={handlePageChange} /></div>
            }
            <div className="h-12 px-4 cancellation-reason-list-grid head-row caption-caps">
                <ElipsisTooltipTextbox value={'configuration.cancellation_reason.grid_id'} />
                <ElipsisTooltipTextbox value={'configuration.cancellation_reason.grid_name'} />
                <ElipsisTooltipTextbox value={'configuration.cancellation_reason.grid_description'} />
                <div></div>
            </div>
            {
                isFetching ? <Spinner className='px-2' /> :
                    reasonsPagedResults && reasonsPagedResults.length > 0 && reasonsPagedResults.map(r =>
                        <div key={r.id} className={classNames('cancellation-reason-list-grid data-row px-6 body2 group', {'data-row-disabled': !r.existsOnEMR})} >
                            <div className='flex items-center'>
                                {!r.existsOnEMR && <SvgIcon type={Icon.Error} fillClass='danger-icon' className='mr-3' />}
                                <ElipsisTooltipTextbox value={`${r.id} ${r.nameOnEMR || ''}`} classNames='flex items-center h-full' />
                            </div>
                            <ElipsisTooltipTextbox value={!r.isMapped ? 'common.not_available' : r.name} classNames='flex items-center h-full' />
                            <ElipsisTooltipTextbox value={!r.isMapped ? 'common.not_available' : (r.description || '')} classNames='flex items-center h-full' />
                            <div>
                                <SvgIcon type={Icon.Edit} fillClass={!r.existsOnEMR ? 'rgba-038-fill' : 'rgba-062-fill'} onClick={() => onEditIconClick(r.existsOnEMR, r.id)} />
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default CancellationReasonConfig;