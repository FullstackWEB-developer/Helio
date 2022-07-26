import React, {createContext, ReactNode, useState} from 'react';
import {CallsLogContextType} from './calls-log-context-type';
import {TicketLogRequestModel} from '@shared/models/ticket-log.model';
import {DEFAULT_PAGING} from '@shared/constants/table-constants';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
export const CallsLogContext = createContext<CallsLogContextType | null>(null);

const CallsLogProvider =({children}: {children: ReactNode}) => {
    const [searchTerm, setSearchTerm] = useState<string>();
    const isDefaultTeam = useCheckPermission('Calls.DefaultToTeamView');
    const appUser = useSelector(selectAppUserDetails);
    const [callsLogFilter, setCallsLogFilter] = useState<TicketLogRequestModel>({
        ...DEFAULT_PAGING,
        assignedTo: !isDefaultTeam ? appUser?.id : '',
        sorts: ['createdOn Desc']
    });
    return (<CallsLogContext.Provider value={{
        searchTerm,
        setSearchTerm,
        callsLogFilter,
        setCallsLogFilter
    }}>
                {children}
    </CallsLogContext.Provider>)

}

export default CallsLogProvider;
