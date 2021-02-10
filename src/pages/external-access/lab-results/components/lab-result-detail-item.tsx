import { LabResultDetailDisplayItem } from '../models/lab-result-detail-display-item.model';
import { useTranslation } from 'react-i18next';
import utils from '../../../../shared/utils/utils';

interface LabResultDetailProps {
    item: LabResultDetailDisplayItem
}

const LabResultDetailItem = ({ item }: LabResultDetailProps) => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    {t('lab-results.detail_display_item_status')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.label}
                </dd>
                <dt className="text-sm font-medium text-gray-500">
                    {t('lab-results.detail_display_item_date')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {utils.formatDate(item.datetime)}
                </dd>
                <dt className="text-sm font-medium text-gray-500">
                    {t('lab-results.detail_display_item_note')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.note}
                </dd>
            </div>
        </div>
    );
}

export default LabResultDetailItem;
