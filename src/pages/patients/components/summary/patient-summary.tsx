import ContactInformation from './contact-information';
import OutstandingBalances from './outstanding-balances';

const PatientSummary = () => {
    return (<>
                <ContactInformation/>
                <OutstandingBalances/>
            </>
    );
};

export default PatientSummary;
