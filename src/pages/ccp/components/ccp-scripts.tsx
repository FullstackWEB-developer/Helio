import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef} from 'react';
import {getLookupValues} from '@pages/tickets/services/tickets.service';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import './ccp-scripts.scss';
const CcpScripts = () => {

    const dispatch = useDispatch();
    const suggestedTexts = useSelector(state => selectLookupValues(state, 'SuggestedText'));
    const {t} = useTranslation();
    const controllerRef = useRef();

    useEffect(() => {
        dispatch(getLookupValues('SuggestedText'));
    }, []);

    if (!suggestedTexts || suggestedTexts.length < 1) {
        return <Spinner fullScreen/>
    }

    const onMessageClick = async (message: string) => {
        const contact = window.CCP.contact as connect.Contact;
        const connection = contact.getAgentConnection();
        if (connection instanceof connect.ChatConnection) {
            if (!controllerRef?.current) {
                controllerRef.current = await connection.getMediaController();
            }
            // @ts-ignore
            controllerRef.current.sendMessage({message, contentType: "text/plain"});
        }
    }

    const Message = ({text}: {text: string}) => {
        return <div className='ccp-script-item w-96 py-2 px-3 body3 bg-gray-50 rounded cursor-pointer' onClick={() => onMessageClick(text)}>
            {text}
        </div>
    }

    return <div className='space-y-4 px-6 pt-4'>
        <div>{t('ccp.scripts.title')}</div>
        {suggestedTexts.map(text => {
           return <Message key={text.value} text={text.label}/>
        })}
    </div>
}

export default CcpScripts;
