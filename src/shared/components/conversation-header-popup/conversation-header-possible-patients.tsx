import { GetPatient } from '@constants/react-query-constants';
import { getPatientByIdWithQuery } from '@pages/patients/services/patients.service';
import {useTranslation} from 'react-i18next';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
import { ExtendedPatient } from '@pages/patients/models/extended-patient';

const ConversationHeaderPossiblePatients = ({patientId, selectPatient}: {patientId: number, selectPatient: (patient: ExtendedPatient) => void}) => {

    const {t} = useTranslation();
    const {data, isLoading, isFetching} = useQuery([GetPatient, patientId], () => getPatientByIdWithQuery(patientId), {
        enabled: true
    });

    return (
        !isLoading && !isFetching && data ? (
            <div className='flex'>
                <div className="flex-auto w-32">
                    <ElipsisTooltipTextbox value={`${data.firstName} ${data.lastName}`} classNames={"w-32 truncate"} asSpan={false} />
                </div>
                <div className="flex-auto w-16">
                    {dayjs(data.dateOfBirth).format('MM/DD/YYYY')}
                </div>
                <div className="flex-none">
                    <div className="body2-primary cursor-pointer hover:underline" onClick={() => selectPatient(data)}>{t("email.inbox.assign")}</div>
                </div>
            </div>
        ) : (<></>)
    )
}

export default ConversationHeaderPossiblePatients;
