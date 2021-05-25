import {useQuery} from 'react-query';
import {PreviewMedicalRecords} from '@constants/react-query-constants';
import {getMedicalRecordsAsHtml} from '@pages/patients/services/patients.service';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {useSelector} from 'react-redux';
import {selectRequestMedicalRecordsPreviewData} from '@pages/external-access/request-medical-records/store/medical-records.selectors';

const MedicalRecordsPreview = () => {
    const previewModel = useSelector(selectRequestMedicalRecordsPreviewData);
    const {isLoading, data, isError, error} = useQuery<string, Error>(PreviewMedicalRecords, () =>
            getMedicalRecordsAsHtml({
                patientId: previewModel.patientId,
                departmentId: previewModel.departmentId,
                startDate: previewModel.startDate,
                endDate: previewModel.endDate
            }), {
            retry: 3
        }
    );

    if (isLoading) {
        return <ThreeDots/>
    }

    if (isError || !data) {
       return <div>{error}</div>
    }

    return <div dangerouslySetInnerHTML={{__html: data}}/>
}

export default MedicalRecordsPreview;
