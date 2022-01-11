import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {getLookupValues} from '@pages/tickets/services/tickets.service';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import './ccp-scripts.scss';
import {selectCurrentContactId} from '@pages/ccp/store/ccp.selectors';
const CcpScripts = () => {

    const dispatch = useDispatch();
    const suggestedTexts = useSelector(state => selectLookupValues(state, 'SuggestedText'));
    const currentContactId = useSelector(selectCurrentContactId);
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(getLookupValues('SuggestedText'));
    }, [dispatch]);

    if (!suggestedTexts || suggestedTexts.length < 1) {
        return <Spinner fullScreen/>
    }

    const onMessageClick = async (message: string) => {
        const agent = window.CCP.agent;
        const agentContacts = agent.getContacts();
        if (!agentContacts) {
            return;
        }
        const currentContact = agentContacts.find(a => a.contactId === currentContactId);
        if (currentContact) {
            const connection = currentContact.getAgentConnection();
            if (connection instanceof connect.ChatConnection) {
                const controller = await connection.getMediaController();
                controller.sendMessage({message, contentType: "text/plain"});
            }
        }
    }

    const Message = ({text}: {text: string}) => {
        return <div className='ccp-script-item w-96 py-2 px-3 body3 bg-gray-50 rounded cursor-pointer' onClick={() => onMessageClick(text)}>
            {text}
        </div>
    }

    return <div className='sms-container space-y-4 px-6 pt-4'>
        <div>{t('ccp.scripts.title')}</div>
        {suggestedTexts.map(text => {
           return <Message key={text.value} text={text.label}/>
        })}
    </div>
}

export default CcpScripts;
