import {useTranslation} from 'react-i18next';
import {Patient} from '@pages/patients/models/patient';
import {ChannelTypes, DefaultPagination, Paging} from '@shared/models';
import Pagination from '@components/pagination';
import {useMemo, useState} from 'react';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import utils from '@shared/utils/utils';
import dayjs from 'dayjs';
import SvgIcon, {Icon} from '@components/svg-icon';
import SearchboxAddIcon from '@components/searchbox/components/searchbox-add-icon';

interface SearchBoxResultsProps {
    items?: Patient[];
    error?: string;
    onSelect: (patient: Patient) => void;
    type: ChannelTypes.SMS | ChannelTypes.Email,
    paginate?: boolean;
}
const SearchboxPatientsResults = ({items, error, onSelect, type, paginate}: SearchBoxResultsProps) => {
    const {t} = useTranslation();
    const [pagination, setPagination] = useState<Paging>({
        page: 1,
        pageSize: DefaultPagination.pageSize,
        totalCount: items?.length ?? 0,
        totalPages: items?.length ? items.length/ DefaultPagination.pageSize : 0
    });
    
    const itemsToDisplay = useMemo(() => {
        if (!paginate) {
            return items;
        }
        return items?.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
    }, [paginate, items, pagination.page, pagination.pageSize]);


    
    const tableModel = useMemo(() => {
        const smsTableModel: TableModel = {
            columns: [{
                title: 'searchbox_result.name',
                widthClass: 'w-3/12',
                render:(_, record: Patient) => utils.stringJoin(', ', record.lastName, record.firstName),
                field: 'firstName'
            },{
                title: 'searchbox_result.id',
                widthClass: 'w-2/12',
                field: 'patientId'
            },{
                title: 'searchbox_result.dob',
                widthClass: 'w-2/12',
                field: 'dateOfBirth',
                render: (_, record: Patient) => dayjs(record.dateOfBirth).format('MM/DD/YYYY')
            },{
                title: 'searchbox_result.email',
                widthClass: 'w-2/12',
                field: 'email',
                render:(_, record) => !!record.emailAddress && <SvgIcon
                    type={Icon.CheckMark}
                    fillClass="default-toolbar-icon"
                />
            },{
                title: 'searchbox_result.phone',
                widthClass: 'w-1/6',
                field: 'mobilePhone',
                render:(_, record) => !!record.mobilePhone && <SvgIcon
                    type={Icon.CheckMark}
                    fillClass="default-toolbar-icon"
                />
            },{
                title: 'searchbox_result.text_consent',
                widthClass: 'w-1/6',
                field: 'consentToText',
                render:(_, record) => record.consentToText ? t('common.yes') : t('common.no')
            },{
                title: 'searchbox_result.add',
                widthClass: 'w-1/6',
                field: 'patientId',
                render:(_, record: Patient) => <div className='cursor-pointer'><SearchboxAddIcon patient={record} onClick={() => onSelect(record)} type={type} /></div>
            }],
            hasRowsBottomBorder: true,
            rowClass: 'searchbox-row flex items-center hover:bg-gray-100',
            rows: itemsToDisplay ?? [],
            headerClassName:'h-12',
            size: 'large'
        }

        const emailTableModel: TableModel = {
            columns: [{
                title: 'searchbox_result.name',
                widthClass: 'w-3/12',
                render:(_, record: Patient) => utils.stringJoin(', ', record.lastName, record.firstName),
                field: 'firstName'
            },{
                title: 'searchbox_result.id',
                widthClass: 'w-3/12',
                field: 'patientId'
            },{
                title: 'searchbox_result.dob',
                widthClass: 'w-5/12',
                field: 'dateOfBirth',
                render: (_, record: Patient) => dayjs(record.dateOfBirth).format('MM/DD/YYYY')
            },{
                title: 'searchbox_result.add',
                widthClass: 'w-2/6',
                field: 'patientId',
                alignment: 'center',
                render:(_, record: Patient) => <div className='cursor-pointer flex justify-center'><SearchboxAddIcon patient={record} onClick={() => onSelect(record)} type={type} /></div>
            }],
            hasRowsBottomBorder: true,
            rowClass: 'searchbox-row flex items-center hover:bg-gray-100',
            rows: itemsToDisplay ?? [],
            headerClassName:'h-12',
            size: 'large'
        }
        return type === ChannelTypes.SMS ? smsTableModel : emailTableModel;
    }, [type, itemsToDisplay])

    return (
        <div>
            <div className='px-6 pb-7'>
                <div className='flex flex-row justify-between pt-6 pb-4 items-center mb-2'>
                    <h5>{t('patient.search_heading_result')}</h5>
                    {paginate && <div className="flex flex-row justify-end">
                        <Pagination
                            value={pagination}
                            onChange={setPagination}
                        />
                    </div>}
                </div>
                <Table model={tableModel} />
                {!!error &&
                    <div className='flex justify-end body3'><span>{t(error)}</span></div>
                }
            </div>
        </div>
    );
}

export default SearchboxPatientsResults;
