import React from 'react';
import {LabResultDetail} from '../models/lab-result-detail.model';
import {Document, Page, View, Text, Font, Image} from '@react-pdf/renderer';
// @ts-ignore
import font300 from '../../../../themes/fonts/poppins/poppins-v15-latin-300.ttf';
// @ts-ignore
import fontRegular from '../../../../themes/fonts/poppins/poppins-v15-latin-regular.ttf';
// @ts-ignore
import font500 from '../../../../themes/fonts/poppins/poppins-v15-latin-500.ttf';
// @ts-ignore
import font600 from '../../../../themes/fonts/poppins/poppins-v15-latin-600.ttf';
import {useTranslation} from 'react-i18next';
import {Provider} from '@shared/models/provider';
import utils from '@shared/utils/utils';
import {LabResultObservation} from '../models/lab-result-observation.model';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import LabResultPdfHeaderLogo from './lab-result-pdf-header-logo';
interface LabResultPdfDocumentProps {
    labResultDetail: LabResultDetail,
    provider?: Provider,
    providerImage?: string,
    verifiedPatient?: VerifiedPatient,
    pages?: {contentType: string, content: string}[]
}
const LabResultPdfDocument = ({labResultDetail, provider, providerImage, verifiedPatient, pages}: LabResultPdfDocumentProps) => {

    Font.register({
        family: 'Poppins', fonts: [
            {src: font300, fontWeight: 'light', fontStyle: 'normal'},
            {src: fontRegular, fontWeight: 'normal', fontStyle: 'normal'},
            {src: font500, fontWeight: 'medium', fontStyle: 'normal'},
            {src: font600, fontWeight: 'semibold', fontStyle: 'normal'}
        ]
    });
    const {t} = useTranslation();

    const styles = {
        header: {height: '60pt', backgroundColor: '#DD719A', marginBottom: '5pt'},
        container: {margin: '40pt'},
        labTitle: {fontFamily: 'Poppins', fontSize: '25.5pt', fontWeight: 'light' as const, marginBottom: '27pt'},
        providerCommentSection: {display: 'flex' as const, flexDirection: 'column' as const, padding: '18pt', marginBottom: '24pt', border: '1px solid #E0E0E0', borderRadius: '3pt', width: '100%'},
        providerCommentTitle: {fontFamily: 'Poppins', fontWeight: 'medium' as const, fontSize: '12pt', paddingBottom: '13.5pt'},
        providerImage: {width: '72', height: '72', minHeight: '72', minWidth: '72', borderRadius: '50%', objectFit: 'cover', marginRight: '18'},
        providerName: {paddingBottom: '9pt', fontFamily: 'Poppins', fontWeight: 'medium' as const, fontSize: '10.5pt'},
        providerNote: {paddingBottom: '9pt', fontFamily: 'Poppins', fontWeight: 'normal' as const, fontSize: '10.5pt', width: '80%'},
        labResultHead: {display: 'flex' as const, flexDirection: 'row' as const, marginBottom: '15pt', justifyContent: 'space-between' as const, width: '100%'},
        labResultTitle: {fontFamily: 'Poppins', fontWeight: 'medium' as const, fontSize: '12pt'},
        labResultDateContent: {display: 'flex' as const, flexDirection: 'row' as const, fontFamily: 'Poppins', fontWeight: 'normal' as const, fontSize: '10.5pt'},
        gridHead: {backgroundColor: '#F5F5F5', width: '100%', color: '#7A7A7A', paddingHorizontal: '12', paddingVertical: '6'},
        gridAnalytesCol: {width: '38%', fontFamily: 'Poppins', fontSize: '9pt', fontWeight: 'normal' as const},
        gridValueCol: {width: '14%', fontFamily: 'Poppins', fontSize: '9pt', fontWeight: 'normal' as const},
        gridRefRangeCol: {width: '24%', fontFamily: 'Poppins', fontSize: '9pt', fontWeight: 'normal' as const},
        gridUnitsCol: {width: '14%', fontFamily: 'Poppins', fontSize: '9pt', fontWeight: 'normal' as const},
        gridRow: {width: '100%', paddingVertical: '6', borderBottom: '1px solid #E0E0E0', paddingHorizontal: '12'},
        gridRowBorderless: {width: '100%', paddingVertical: '6', paddingHorizontal: '12'},
        gridNoteCol: {fontFamily: 'Poppins', fontSize: '7.5pt', fontWeight: 'normal' as const, flexGrow: 1},
        gridGap: {paddingRight: '24'},
        sectionTitle: {paddingBottom: '6', fontSize: '12', fontWeight: 'normal' as const, fontFamily: 'Poppins', width: '100%', marginBottom: '12', borderBottom: '1px solid #E0E0E0'},
        resultInfoGrid: {width: '100%', display: 'flex' as const, flexDirection: 'row' as const, fontFamily: 'Poppins', fontSize: '10.5', fontWeight: 'normal' as const, paddingBottom: '8'},
        patientInfoCol: {width: '40%'},
        labResultInfoCol: {flexGrow: 1},
        grayedOutText: {color: '#666666'},
        footerNote: {fontFamily: 'Poppins', fontWeight: 'medium' as const, fontSize: '10.5'}
    }

    const determineAbnormalValueColor = (observation: LabResultObservation) => {
        switch (observation.abnormalFlag) {
            case "high":
            case "low":
                return 'red';
            default:
                return 'inherit';
        }
    }

    const determineContentType = (page: {contentType: string, content: string}) => {
        return page?.contentType?.slice(0, page.contentType.indexOf(';') !== -1 ? page.contentType.indexOf(';') : page.contentType.length);
    }

    return (
        <Document>
            <Page size="A4" wrap={true}>
                <View style={styles.header} fixed>
                    <LabResultPdfHeaderLogo key={Math.random()} />
                </View>
                <View style={styles.container}>
                    <Text style={styles.labTitle}>{labResultDetail?.description || ''}</Text>
                    <View style={styles.providerCommentSection}>
                        <Text style={styles.providerCommentTitle}>{t('external_access.lab_results.providers_comment')}</Text>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            {
                                providerImage ? <Image src={providerImage} style={styles.providerImage} /> : null
                            }
                            <View style={{display: 'flex', flexDirection: 'column'}}>
                                <Text style={styles.providerName}>{provider?.displayName || ''}</Text>
                                <Text style={styles.providerNote}>{labResultDetail?.patientNote || ''}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={styles.labResultHead}>
                        <Text style={styles.labResultTitle}>{t('external_access.lab_results.lab_results')}</Text>
                        {
                            labResultDetail.createdDateTime && utils.checkIfDateIsntMinValue(labResultDetail.createdDateTime) &&
                            <View style={styles.labResultDateContent}>
                                <Text style={{color: '#666666'}}>{t('external_access.lab_results.received')}&nbsp;</Text>
                                <Text>{utils.formatDateShortMonth(labResultDetail.createdDateTime.toString())}</Text>
                            </View>
                        }
                    </View>
                    <View>
                        <View style={{...styles.gridHead, display: 'flex', flexDirection: 'row', fontWeight: 'medium'}}>
                            <Text style={styles.gridAnalytesCol}>{t('external_access.lab_results.analytes')}</Text>
                            <Text style={styles.gridGap}></Text>
                            <Text style={styles.gridValueCol}>{t('external_access.lab_results.value')}</Text>
                            <Text style={styles.gridGap}></Text>
                            <Text style={styles.gridRefRangeCol}>{t('external_access.lab_results.ref_range')}</Text>
                            <Text style={styles.gridGap}></Text>
                            <Text style={styles.gridUnitsCol}>{t('external_access.lab_results.units')}</Text>
                        </View>
                        {
                            labResultDetail.observations && labResultDetail.observations.length > 0 &&
                            labResultDetail.observations.map(observation => {
                                return (
                                    <>
                                        <View key={observation.observationIdentifier} style={{
                                            ...(observation.note ? styles.gridRowBorderless : styles.gridRow), display: 'flex', flexDirection: 'row', fontWeight: 'normal', alignItems: 'center'
                                        }}>
                                            <Text style={styles.gridAnalytesCol}>{observation.analyteName || ''}</Text>
                                            <Text style={styles.gridGap}></Text>
                                            <Text style={{...styles.gridValueCol, color: determineAbnormalValueColor(observation)}}>
                                                {observation.value || ''}
                                            </Text>
                                            <Text style={styles.gridGap}></Text>
                                            <Text style={styles.gridRefRangeCol}>{observation.referenceRange || ''}</Text>
                                            <Text style={styles.gridGap}></Text>
                                            <Text style={styles.gridUnitsCol}>{observation.units || ''}</Text>
                                        </View>
                                        {
                                            observation.note &&
                                            <View key={`${observation.observationIdentifier}-note`} style={{...styles.gridRow, display: 'flex', flexDirection: 'row', fontWeight: 'normal', alignItems: 'center'}}>
                                                <Text style={styles.gridAnalytesCol}></Text>
                                                <Text style={styles.gridGap}></Text>
                                                <Text style={styles.gridNoteCol}>{observation.note}</Text>
                                            </View>
                                        }
                                    </>
                                )
                            })
                        }
                    </View>
                    <Text style={{marginTop: '30'}}></Text>
                    <Text style={styles.sectionTitle}>{t('external_access.lab_results.test_information')}</Text>
                    <View style={styles.resultInfoGrid}>
                        <Text style={styles.patientInfoCol}>
                            <Text style={styles.grayedOutText}>{t('external_access.lab_results.patient_name')}</Text>
                            {verifiedPatient?.firstName || ''} {verifiedPatient?.lastName || ''}
                        </Text>
                        <Text style={styles.gridGap}></Text>
                        <Text style={styles.labResultInfoCol}>
                            <Text style={styles.grayedOutText}>{t('external_access.lab_results.test')}</Text>
                            {labResultDetail?.description || ''}
                        </Text>
                    </View>
                    <View style={styles.resultInfoGrid}>
                        <Text style={styles.patientInfoCol}>
                            <Text style={styles.grayedOutText}>{t('external_access.lab_results.dob')}</Text>
                            {verifiedPatient?.dateOfBirth ? utils.formatDateShortMonth(verifiedPatient.dateOfBirth.toString()) : ''}
                        </Text>
                        <Text style={styles.gridGap}></Text>
                        <Text style={styles.labResultInfoCol}>
                            <Text style={styles.grayedOutText}>{t('external_access.lab_results.laboratory')}</Text>
                            {labResultDetail?.performingLabName || ''}
                        </Text>
                    </View>
                    <View style={styles.resultInfoGrid}>
                        <Text style={styles.patientInfoCol}>
                        </Text>
                        <Text style={styles.gridGap}></Text>
                        <Text style={styles.labResultInfoCol}>
                            <Text style={styles.grayedOutText}>{t('external_access.lab_results.specimen_id')}</Text>
                            {labResultDetail?.labResultId || ''}
                        </Text>
                    </View>
                    <View style={styles.resultInfoGrid}>
                        <Text style={styles.patientInfoCol}>
                        </Text>
                        <Text style={styles.gridGap}></Text>
                        <Text style={styles.labResultInfoCol}>
                            <Text style={styles.grayedOutText}>{t('external_access.lab_results.collected')}: </Text>
                            {labResultDetail?.encounterDate && utils.checkIfDateIsntMinValue(labResultDetail.encounterDate) ? utils.formatDateShortMonth(labResultDetail.encounterDate.toString()) : ''}
                        </Text>
                    </View>
                    <View style={styles.resultInfoGrid}>
                        <Text style={styles.patientInfoCol}>
                        </Text>
                        <Text style={styles.gridGap}></Text>
                        <Text style={styles.labResultInfoCol}>
                            <Text style={styles.grayedOutText}>{t('external_access.lab_results.received')}: </Text>
                            {labResultDetail?.createdDateTime && utils.checkIfDateIsntMinValue(labResultDetail.createdDateTime) ? utils.formatDateShortMonth(labResultDetail.createdDateTime.toString()) : ''}
                        </Text>
                    </View>
                    <Text style={{marginTop: '30'}}></Text>
                    <Text style={styles.sectionTitle}>{t('external_access.lab_results.note')}</Text>
                    <Text style={styles.footerNote}>
                        <Text style={{fontWeight: 'bold'}}>{t('external_access.lab_results.note_paragraph_1')} </Text>
                        <Text>{t('external_access.lab_results.note_paragraph_2')}</Text>
                    </Text>
                </View>
            </Page>
            {
                pages && pages.length > 0 && pages.map((p, index) => {
                    return <Page key={`${labResultDetail.labResultId}-page-${index}`} size="A4" >
                        <View style={styles.header} fixed />
                        <View style={styles.container}>
                            <Image src={`data:${determineContentType(p)};base64,${p.content}`} style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} />
                        </View>
                    </Page>
                })
            }
        </Document>
    )
}

export default LabResultPdfDocument;