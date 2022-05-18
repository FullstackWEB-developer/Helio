import {ChartAlert} from '../models/chart-alert';
import dayjs from 'dayjs';
import './patient-chart-alert.scss';

interface PatientChartAlertProps {
    chartAlert: ChartAlert
}

const PatientChartAlert = ({ chartAlert }: PatientChartAlertProps) => {

    return (
        <div className="flex flex-col p-6 chart-alert-body max-h-96 overflow-y-auto">
            <span className="body2 pb-1.5 whitespace-pre-wrap">{chartAlert.noteText}</span>
            <div className="flex body3-medium justify-between w-full">
                {chartAlert.lastModifiedBy}
                <span className="px-1"/>
                {dayjs(chartAlert.lastModified)?.format('MMM DD, YYYY')}
            </div>
        </div>
    )
}

export default PatientChartAlert;
