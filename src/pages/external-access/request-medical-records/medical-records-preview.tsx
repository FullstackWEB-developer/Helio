import {useQuery} from 'react-query';
import {PreviewMedicalRecords} from '@constants/react-query-constants';
import {getMedicalRecordsAsHtml} from '@pages/patients/services/patients.service';
import {useSelector} from 'react-redux';
import {selectRequestMedicalRecordsPreviewData} from '@pages/external-access/request-medical-records/store/medical-records.selectors';
import Spinner from '@components/spinner/Spinner';

const MedicalRecordsPreview = () => {
    const previewModel = useSelector(selectRequestMedicalRecordsPreviewData);
    const {isLoading, data, isError, error} = useQuery<string, Error>(PreviewMedicalRecords, () =>
            getMedicalRecordsAsHtml({
                linkId: previewModel.downloadLink
            }), {
            retry: 3
        }
    );

    if (isLoading) {
        return <Spinner fullScreen/>
    }

    if (isError || !data) {
       return <div>{error}</div>
    }

    return <div className='overflow-auto' dangerouslySetInnerHTML={{__html: data}}/>
}

export default MedicalRecordsPreview;
