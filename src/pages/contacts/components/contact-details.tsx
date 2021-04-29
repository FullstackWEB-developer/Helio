import Tab from '@components/tab/Tab';
import Tabs from '@components/tab/Tabs';
import {Contact} from '@shared/models/contact.model';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ContactHeader from './contact-header';
import IndividualContactDetails from './individual-contact-details';
import CompanyContactDetails from './company-contact-details';
import ContactNotes from './contact-notes';
import TextArea from '@components/textarea/textarea';
import {ContactNote} from '../models/ContactNote';
import {useDispatch, useSelector} from 'react-redux';
import {userFullNameSelector} from '@shared/store/app-user/appuser.selectors';
import {showCcp} from '@shared/layout/store/layout.slice';
import ContactTickets from './contact-tickets';
import Logger from '@shared/services/logger';
interface ContactDetailsProps {
    contact: Contact;
    editMode: boolean;
    editIconClickHandler?: () => void;
}
const ContactDetails = ({contact, editMode, editIconClickHandler}: ContactDetailsProps) => {
    const {t} = useTranslation();
    const [selectedTab, setSelectedTab] = useState(-1);
    const noteSectionStart = useRef<HTMLDivElement>(null);
    const [note, setNote] = useState('');
    const userFullName = useSelector(userFullNameSelector);
    const dispatch = useDispatch();
    const logger = Logger.getInstance();
    const [notes, setNotes] = useState<ContactNote[]>([
        {
            noteText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.laboris nisi ut aliquip ex ea commodo consequat.',
            id: 2,
            createdBy: 'Anna Smith',
            createdOn: new Date(1613786100000)
        },
        {
            noteText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.laboris nisi ut aliquip ex ea commodo consequat.',
            id: 1,
            createdBy: 'Joanna Mayer',
            createdOn: new Date(1609847700000)
        }
    ]);
    const addNote = () => {
        const newNote: ContactNote = {
            noteText: note,
            createdOn: new Date(),
            id: new Date().getMilliseconds(),
            createdBy: userFullName
        }
        setNote('');
        setNotes([
            newNote,
            ...notes
        ]);
        noteSectionStart.current?.scrollIntoView({behavior: 'smooth'});
    }
    const initiateACall = () => {
        dispatch(showCcp());
        if (window.CCP.agent) {
            const endpoint = connect.Endpoint.byPhoneNumber('+12026979394');
            window.CCP.agent.connect(endpoint, {
                failure: (e: any) => {
                    logger.error('Cannot make a call to contact: ', e);
                }
            })
        }
    }
    return (
        <div className={`flex flex-grow flex-col overflow-y-${selectedTab === 1 ? 'hidden' : 'auto'} relative`}>
            <ContactHeader contact={contact} editMode={editMode} editIconClickHandler={editIconClickHandler} />
            <div className='px-8 pt-4 w-full'>
                <Tabs onSelect={(selectedTabIndex) => {setSelectedTab(selectedTabIndex)}}>
                    <Tab title={`${t('contacts.contact-details.details')}`}>
                        <div className='pt-8 overflow-x-hidden'>
                            {
                                !contact.isCompany ?
                                    <IndividualContactDetails editMode={editMode} initiateACall={initiateACall} /> :
                                    <CompanyContactDetails contact={contact} editMode={editMode} initiateACall={initiateACall} />
                            }
                        </div>
                    </Tab>
                    <Tab title={`${t('contacts.contact-details.notes')}`}>
                        <div className='pt-4 overflow-x-hidden overflow-y-auto contact-notes-section'>
                            <div ref={noteSectionStart}></div>
                            <ContactNotes notes={notes} />
                        </div>
                    </Tab>
                    <Tab title={`${t('contacts.contact-details.tickets')}`}>
                        <div className='pt-2'>
                            <ContactTickets />
                        </div>
                    </Tab>
                </Tabs>
            </div>
            {
                selectedTab === 1 &&
                (<div className="h-20 absolute bottom-0 w-full border-t">
                    <TextArea className='w-full pt-2 body2' hasIcon={true} value={note} resizable={false} hasBorder={false}
                        iconFill='contact-light-fill'
                        placeholder={t('contacts.contact-details.enter_note')}
                        iconContainerClassName='px-10'
                        iconClassNames='cursor-pointer'
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {setNote(e.target.value)}}
                        iconOnClick={() => {addNote()}} />
                </div>)
            }
        </div>
    )
}

export default ContactDetails;