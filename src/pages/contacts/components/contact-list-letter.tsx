import React from 'react';

interface ContactListLetterProps {
    letter: string
}
const ContactListLetter = ({letter}: ContactListLetterProps) => {
    return (
        <div className="w-full h-6 company-item-letter pl-6 body2">
            {
                letter.toUpperCase()
            }
        </div>
    )
}

export default ContactListLetter;