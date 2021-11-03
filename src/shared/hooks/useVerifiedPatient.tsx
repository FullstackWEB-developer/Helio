import {useSelector} from "react-redux";
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
const useVerifiedPatient = () => {
    return useSelector(selectVerifiedPatent);
}

export default useVerifiedPatient;
