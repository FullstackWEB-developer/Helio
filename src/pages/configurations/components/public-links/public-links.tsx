import { Trans, useTranslation } from 'react-i18next';
import SvgIcon, { Icon } from '@components/svg-icon';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './public-links.scss'
import { PracticeBrandingPath } from '@app/paths';

interface PublicLink {
    id: number,
    name: string,
    relativePath: string,
    copied?: boolean
}
const PublicLinks = () => {
    const { t } = useTranslation();
    const publicLinksInitialState: PublicLink[] = [
        { id: 1, name: t('configuration.public_links.items.new_patient_registration'), relativePath: 'o/registration' },
        { id: 2, name: t('configuration.public_links.items.schedule_appointment'), relativePath: 'o/new-appointment' },
        { id: 3, name: t('configuration.public_links.items.manage_upcoming_appointments'), relativePath: 'o/appointment-list' },
        { id: 4, name: t('configuration.public_links.items.request_prescription_refills'), relativePath: 'o/view-medications' },
        { id: 5, name: t('configuration.public_links.items.medical_records'), relativePath: 'o/request-medical-records' },
        { id: 6, name: t('configuration.public_links.items.recent_test_results'), relativePath: 'o/lab-results' }
    ]
    const [publicLinks, setPublicLinks] = useState(publicLinksInitialState);
    const onCopy = (id: number, absolutePath: string) => {
        navigator.clipboard.writeText(absolutePath).then(function () {
            const newList = [...publicLinks];
            newList.forEach(item => {
                item.copied = false;
            });
            const matchedItem = newList.find(x => x.id == id);
            if (matchedItem) {
                matchedItem.copied = true;
                setPublicLinks(newList);
            }
        });
    }
    const tableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: publicLinks,
        headerClassName: 'h-12',
        rowClass: 'h-12',
        columns: [
            {
                title: 'configuration.public_links.grid_name',
                field: 'name',
                widthClass: 'w-3/12',
                rowClassname: 'subtitle2',
                render: (name: string) => {
                    return (<span className='flex items-center h-full ml-3'>{name}</span>)
                }
            },
            {
                title: 'configuration.public_links.grid_link',
                field: 'relativePath',
                widthClass: 'w-7/12',
                render: (relativePath: string) => {
                    return (<Link to={`/${relativePath}`} className='body2-primary hover:underline flex items-center h-full' target={"_blank"}>{`${window.origin}/${relativePath}`}</Link>
                    );
                }
            },
            {
                title: 'configuration.public_links.grid_copy_link',
                field: 'id',
                widthClass: 'w-2/12',
                render: (id: string, row: PublicLink) => {
                    return (
                        <span className='flex items-center h-full'>
                            {row.copied ?
                                <span className='copied py-1 px-2'>{t('configuration.public_links.copied_badge')}</span> :
                                <SvgIcon dataTestId={`onCopy-${row.id}`} type={Icon.Edit} className='icon-medium cursor-pointer' fillClass='edit-icon' onClick={() => {
                                    onCopy(row.id, `${window.origin}/${row.relativePath}`)
                                }} />
                            }

                        </span>
                    );
                }
            }
        ]
    }
    return (
        <div className='w-10/12 overflow-auto h-full p-6 pr-4'>
            <h5 className='pb-6'>{t('configuration.public_links.title')}</h5>
            <p className='body2'>{t('configuration.public_links.description')}</p>
            <div className='body2 mb-6 flex whitespace-pre'>
                <Trans i18nKey="configuration.public_links.description_link_holder">
                    <Link to={PracticeBrandingPath} className='body2-primary hover:underline flex items-center h-full' target={"_blank"}>{t('configuration.public_links.description_link_holder_center')}</Link>
                </Trans>
            </div>

            <div>
                <Table model={tableModel} />
            </div>
        </div>
    )
}

export default PublicLinks;