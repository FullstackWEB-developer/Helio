import { AppointmentDetailDisplayItem } from '../models/appointment-detail-display-item';

interface AppointmentDetailProps {
    item: AppointmentDetailDisplayItem
}

const AppointmentDetailItem = ({ item }: AppointmentDetailProps) => {
    return (
        <div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    {item.title}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.description}
                </dd>
            </div>
        </div>
    );
}

export default AppointmentDetailItem;
