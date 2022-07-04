import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import {Icon} from '@components/svg-icon';
import React from 'react';
import {Trans} from 'react-i18next';
import {Placement} from '@popperjs/core';

const SmsTemplateTooltip = ({messages, placement}: {messages: string[]; placement: Placement}) => {
    return <ToolTipIcon
        icon={Icon.InfoOutline}
        iconFillClass='rgba-05-fill'
        placement={placement}
        iconClassName='cursor-pointer icon'
    >
        <div className='flex flex-col p-6 w-80'>
            {messages.map((message, index) => <p key={index} className='body2'>
                <Trans i18nKey={message}>
                    {message}
            </Trans>
            </p>)}
        </div>
    </ToolTipIcon>
}

export default SmsTemplateTooltip;
