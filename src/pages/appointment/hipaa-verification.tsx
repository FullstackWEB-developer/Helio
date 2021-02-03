import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { selectRedirectLink } from './store/redirect-link.selectors';
import { verifyPatient } from '../../shared/services/search.service';
import Input from "../../shared/components/input/input";

enum RequestTypes {
    Appointment = 2
}

const HipaaVerification = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const redirectLink = useSelector(selectRedirectLink);
    const [formData, setFormData] = useState({
        dob: '',
        phone: '',
        zip: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        dispatch(verifyPatient(formData.dob, formData.phone, formData.zip));
        if (redirectLink !== undefined && redirectLink.requestType === RequestTypes.Appointment) {
            history.push('/appointment-detail/' + redirectLink.patientId);
        }
    }

    return (
        <div className="container mx-auto my-auto">
            <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{t('appointment.hipaa_verification')}</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                {t('appointment.ask_additional_information')}
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form data-test-id="appointment-additional-information-form" onSubmit={handleSubmit} autoComplete="off" >
                            <div className="shadow overflow-hidden sm:rounded-md">
                                <div className="px-4 py-5 bg-white sm:p-6">
                                    <div className="grid grid-cols-6 gap-6">

                                        <div className="col-span-6 sm:col-span-3">
                                            <Input data-test-id="appointment-dob" type="date" name="dob" id="dob" htmlFor="dob"
                                                   label={t('appointment.dob')}
                                                   value={formData.dob}
                                                   onChange={handleChange}
                                                />
                                        </div>

                                        <div className="col-span-6 sm:col-span-4">
                                            <Input data-test-id="appointment-phone" type="text" name="phone" id="phone" htmlFor="phone"
                                                   label={t('appointment.phone')}
                                                   value={formData.phone}
                                                   onChange={handleChange}
                                               />
                                        </div>

                                        <div className="col-span-6">
                                            <Input data-test-id="appointment-zip" type="text" name="zip" id="zip" htmlFor="zip"
                                                   label={t('appointment.zip')}
                                                   value={formData.zip}
                                                   onChange={handleChange}
                                               />
                                        </div>
                                    </div>

                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button data-test-id="appointment-verify-btn" type="submit"
                                            disabled={ !formData.dob || !formData.phone || !formData.zip }
                                            className="btn-primary">
                                        {t('appointment.verify')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HipaaVerification;

