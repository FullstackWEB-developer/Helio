import Api from '@shared/services/api';
import {Medication} from '@pages/external-access/request-refill/models/medication.model';
import {
    createPatientCase,
    getPatientDefaultPharmacy,
    getPatientMedications,
    searchPharmacies
} from '@pages/external-access/request-refill/services/request-refill.service';
import {Pharmacy} from '@pages/external-access/request-refill/models/pharmacy.model';
import {
    PatientCaseDocumentSource,
    PatientCaseDocumentSubClass,
    PatientCaseExternal
} from '@pages/external-access/request-refill/models/patient-case-external.model';

describe("Request Refill  Service Tests", () => {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("getPatientMedications should return", async () => {
        const medications :Medication[] = [
            {
                medicationName: 'Med1',
                defaultProviderId: 3,
                refillsAllowed: 3,
                enteredBy:'Bbolek',
                unstructuredSig: 'Take 2'
            },
            {
                medicationName: 'Med2',
                defaultProviderId: 3,
                refillsAllowed: 3,
                enteredBy:'Bbolek',
                unstructuredSig: 'Take 2'
            }
        ]
        const spy =jest.spyOn(Api, 'get').mockResolvedValue(
            {
                data: medications
            }
        );
        const result = await getPatientMedications(12323);
        expect(result).not.toBeNull();
        expect(result).toBe(medications);
        expect(spy).toBeCalledWith('/patients/12323/chart/medications');
    });

    it("getPatientDefaultPharmacy should return", async () => {
        const pharmacy :Pharmacy = {
            address1: 'address',
            city: 'city',
            phoneNumber: '2222222222',
            state: 'AL',
            zip: '55555',
            clinicalProviderId: 3,
            clinicalProviderName: 'bb',
            faxNumber: '223232323'
        }
        const spy =jest.spyOn(Api, 'get').mockResolvedValue(
            {
                data: pharmacy
            }
        );
        const result = await getPatientDefaultPharmacy(12323);
        expect(result).not.toBeNull();
        expect(result).toBe(pharmacy);
        expect(spy).toBeCalledWith('/patients/12323/pharmacies/default');
    });

    it("searchPharmacies should return", async () => {
        const pharmacies :Pharmacy[] = [{
            address1: 'address',
            city: 'city',
            phoneNumber: '2222222222',
            state: 'AL',
            zip: '55555',
            clinicalProviderId: 3,
            clinicalProviderName: 'bb',
            faxNumber: '223232323'
        },{
            address1: 'address2',
            city: 'city2',
            phoneNumber: '2222222222',
            state: 'AL2',
            zip: '55555',
            clinicalProviderId: 3,
            clinicalProviderName: 'bb',
            faxNumber: '223232323'
        }]
        const spy =jest.spyOn(Api, 'get').mockResolvedValue(
            {
                data: pharmacies
            }
        );
        const result = await searchPharmacies(12323,  3,'lab');
        expect(result).not.toBeNull();
        expect(result).toBe(pharmacies);
        expect(spy).toBeCalledWith('/patients/12323/pharmacies?departmentId=3&name=lab');
    });

    it("createPatientCase should return", async () => {
        const patientCaseExternal :PatientCaseExternal = {
            departmentId: 3,
            documentSource: PatientCaseDocumentSource.Patient,
            documentSubClass: PatientCaseDocumentSubClass.ClinicalQuestion,
            providerId: 4,
            ignoreNotification: false,
            internalNote: 'Internal Note'
        }

        const params = {
            'departmentId': patientCaseExternal.departmentId,
            'providerId':  parseInt(patientCaseExternal.providerId.toString()),
            'internalNote': patientCaseExternal.internalNote,
            'ignoreNotification': patientCaseExternal.ignoreNotification,
            'documentSubClass': patientCaseExternal.documentSubClass,
            'documentSource': patientCaseExternal.documentSource
        };

        const spy =jest.spyOn(Api, 'post').mockResolvedValue(
            {
                data: "ok"
            }
        );
        const result = await createPatientCase({patientId: 12323, patientCaseExternal});
        expect(result).not.toBeNull();
        expect(spy).toBeCalledWith('/patients/12323/cases', params);
    });
});
