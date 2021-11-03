import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {LabResultDetail} from '../models/lab-result-detail.model';
import LabResultPdfDocument from './lab-result-pdf-document';
import {pdf} from '@react-pdf/renderer';
import {useSelector} from 'react-redux';
import {RootState} from 'src/app/store';
import {selectProviderById} from '@shared/store/lookups/lookups.selectors';
import {saveAs} from 'file-saver';
import {useQueryClient} from 'react-query';
import {GetLabResultDetailImage, GetLabResultsProviderPicture} from '@constants/react-query-constants';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {LabResultDetailPage} from '../models/lab-result-detail-page.model';
import {LabResultsPath} from '@app/paths';

const LabResultDetailHeader = ({labResultDetail}: {labResultDetail: LabResultDetail}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const provider = useSelector((state: RootState) => selectProviderById(state, labResultDetail.providerId));
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const queryClient = useQueryClient();
    const [preparingPdf, setPreparingPdf] = useState(false);

    const downloadPdf = async () => {
        setPreparingPdf(true);
        const providerImage: string | undefined = queryClient.getQueryData([GetLabResultsProviderPicture, labResultDetail.providerId]);
        const pages: {contentType: string, content: string}[] = [];
        if (labResultDetail.pages && labResultDetail.pages.length > 0) {
            labResultDetail.pages.forEach((p: LabResultDetailPage) => {
                const pageData: {contentType: string, content: string} | undefined = queryClient.getQueryData([GetLabResultDetailImage, labResultDetail.labResultId, p.pageId]);
                if (pageData) {
                    pages.push(pageData);
                }
            });
        }
        const document = <LabResultPdfDocument
            labResultDetail={labResultDetail}
            provider={provider}
            providerImage={providerImage}
            verifiedPatient={verifiedPatient}
            pages={pages} />;

        const asPdf = pdf([] as any);
        asPdf.updateContainer(document);
        const blob = await asPdf.toBlob();
        saveAs(blob, `lab-result-${labResultDetail.labResultId}.pdf`);
        setPreparingPdf(false);
    }
    return (
        <div className="flex flex-col mb-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center cursor-pointer" onClick={() => history.push(LabResultsPath)}>
                    <SvgIcon type={Icon.ArrowBack} fillClass='lab-result-icons-fill' />
                    <span className='body2 pl-2'>{t('external_access.lab_results.back_to_tests')}</span>
                </div>
                <div className='flex items-center cursor-pointer'>
                    {
                        <SvgIcon isLoading={preparingPdf} type={Icon.Download} className='icon-large' fillClass='lab-result-icons-fill' onClick={downloadPdf} />
                    }
                    <span className='pl-6'/>
                    <SvgIcon type={Icon.Print} className='icon-large' fillClass='lab-result-icons-fill' onClick={() => window.print()} />
                </div>
            </div>
            <h4>
                {labResultDetail.description || ''}
            </h4>
        </div>
    )
}

export default LabResultDetailHeader;
