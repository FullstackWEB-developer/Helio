import { useDispatch, useSelector } from 'react-redux';
import { selectVerifiedPatent } from '../../patients/store/patients.selectors';
import Button from '../../../shared/components/button/button';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { useEffect } from 'react';
import { clearVerifiedPatient } from '../../patients/store/patients.slice';

const RequestMedicalRecords = () => {
    const patient = useSelector(selectVerifiedPatent);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearVerifiedPatient());
        }
    });

    if (patient) {
        return <Button label={'request-medical-records.download'} />
    } else {
        return <div>{'hipaa_validation_form.hipaa_verification_failed'}</div>
    }
}

export default withErrorLogging(RequestMedicalRecords);
