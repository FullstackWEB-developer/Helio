import {Department} from "../../models/department";
import {Provider} from "../../models/provider";

export interface LookupsState {
    departmentList?: Department[];
    providerList?: Provider[];
    isLoading: boolean;
    isError: boolean;
}

const initialState: LookupsState = {
    departmentList: undefined,
    providerList: undefined,
    isLoading: false,
    isError: false
}
export default initialState;
