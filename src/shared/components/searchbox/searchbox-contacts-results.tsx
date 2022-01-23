import {useTranslation} from 'react-i18next';
import {ContactExtended, Paging} from '@shared/models';
import Pagination from '@components/pagination';
import {useMemo} from 'react';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import utils from '@shared/utils/utils';
import SvgIcon, {Icon} from '@components/svg-icon';
import SearchboxAddIcon from '@components/searchbox/components/searchbox-add-icon';
import {ContactType} from '@pages/contacts/models/ContactType';

interface SearchBoxResultsProps {
    items?: ContactExtended[];
    error?: string;
    onSelect: (contact: ContactExtended) => void;
    type: 'sms' | 'email',
    paging: Paging
    onPageChange: (paging: Paging) => void;
}
const SearchboxContactsResults = ({items, error, onSelect, type, paging, onPageChange}: SearchBoxResultsProps) => {

    const {t} = useTranslation();

    const tableModel = useMemo(() => {
        const smsTableModel: TableModel = {
            columns: [{
                title: 'searchbox_result.name',
                widthClass: 'w-2/12',
                render:(_, record: ContactExtended) => record.type === ContactType.Individual ? utils.stringJoin(', ', record.lastName, record.firstName) : t('common.not_available'),
                field: 'firstName'
            },{
                title: 'searchbox_result.company',
                widthClass: 'w-2/12',
                field: 'companyName'
            },{
                title: 'searchbox_result.email',
                widthClass: 'w-2/12',
                field: 'emailAddress'
            },{
                title: 'searchbox_result.phone',
                widthClass: 'w-1/6',
                field: 'mobilePhone',
                render:(_, record) => !!record.mobilePhone && <SvgIcon
                    type={Icon.CheckMark}
                    fillClass="default-toolbar-icon"
                />
            },{
                title: 'searchbox_result.add',
                widthClass: 'w-1/6',
                field: 'patientId',
                render:(_, record: ContactExtended) => <div className='cursor-pointer'><SearchboxAddIcon contact={record} onClick={() => onSelect(record)} type={type} /></div>
            }],
            hasRowsBottomBorder: true,
            rowClass: 'searchbox-row flex items-center hover:bg-gray-100',
            rows: items ?? [],
            headerClassName:'h-12',
            size: 'large'
        }

        const emailTableModel: TableModel = {
            columns: [{
                title: 'searchbox_result.name',
                widthClass: 'w-3/12',
                render:(_, record: ContactExtended) => record.type === ContactType.Individual ? utils.stringJoin(', ', record.lastName, record.firstName) : record.companyName,
                field: 'firstName'
            },{
                title: 'searchbox_result.company',
                widthClass: 'w-3/12',
                field: 'companyName'
            },{
                title: 'searchbox_result.position',
                widthClass: 'w-3/12',
                field: 'position'
            },{
                title: 'searchbox_result.add',
                widthClass: 'w-2/6',
                alignment: 'center',
                field: 'id',
                render:(_, record: ContactExtended) => <div className='cursor-pointer flex justify-center'><SearchboxAddIcon contact={record} onClick={() => onSelect(record)} type={type} /></div>
            }],
            hasRowsBottomBorder: true,
            rowClass: 'searchbox-row flex items-center hover:bg-gray-100',
            rows: items ?? [],
            headerClassName:'h-12',
            size: 'large',
        }
        return type === 'sms' ? smsTableModel : emailTableModel;
    }, [type, items])

    return (
        <div>
            <div className='px-6 pb-7'>
                <div className='flex flex-row justify-between pt-6 pb-4 items-center mb-2'>
                    <h5>{t('search.search_results.heading_contact')}</h5>
                    <div className="flex flex-row justify-end">
                        <Pagination
                            value={paging}
                            onChange={onPageChange}
                        />
                    </div>
                </div>
                <Table model={tableModel} />
                {!!error &&
                    <div className='flex justify-end body3'><span>{t(error)}</span></div>
                }
            </div>
        </div>
    );
}

export default SearchboxContactsResults;
