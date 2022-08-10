import Api from '../../../../shared/services/api';
import {RequestChannel} from '@shared/models/request.channel.enum';

export const getPatientsLabResults = async (patientId: number, departmentId: number, requestChannel: RequestChannel) => {
    const getLabResultsUrl = `/patients/${patientId.toString()}/chart/labresults?departmentId=${departmentId.toString()}&showportalonly=true&requestChannel=${requestChannel}`;
    const {data} = await Api.get(getLabResultsUrl);
    return data;
}

export const getPatientLabResultDetail = async (patientId: number, labResultId: number) => {
    const getLabResultDetailUrl = `/patients/${patientId}/documents/labresult/${labResultId}`;
    const {data} = await Api.get(getLabResultDetailUrl);
    return data;
}

export const getPatientLabResultDetailImage = async (patientId: number, labResultId: number, pageId: number) => {
    const getLabResultDetailImageUrl = `patients/${patientId}/documents/labresult/${labResultId}/pages/${pageId}`;
    const {data} = await Api.get(getLabResultDetailImageUrl);
    return data;
}
