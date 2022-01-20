import Avatar from "@components/avatar";
import {DropdownItemModel} from "@components/dropdown";
import MoreMenu from "@components/more-menu";
import SvgIcon, {Icon} from "@components/svg-icon";
import React from "react";
import {useTranslation} from "react-i18next";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

interface EmailMessageHeaderProps {
    subject: string;
    /* attachmentsCount: number; */
    date: Date;
    from: string;
    fromPhoto: string;
    collapseHandler: () => void,
    collapsedBody: boolean
}
const EmailMessageHeader = ({subject, date, from, fromPhoto, collapsedBody, collapseHandler}: EmailMessageHeaderProps) => {

    dayjs.extend(relativeTime);
    const {t} = useTranslation();
    const getImage = () => {
        if (fromPhoto && fromPhoto.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                src={`data:image/jpeg;base64,${fromPhoto}`} />
        }
        /* TODO handle the case for showing agent pics */
        return <Avatar userFullName={from} />
    }

    const getMoreMenuOption = (): DropdownItemModel[] => {
        const options: DropdownItemModel[] = [];
        const commonClassName = 'body2 py-1.5';
        /* TODO IN ANOTHER PBI */
        return options;
    }

    const onMoreMenuClick = (item: DropdownItemModel) => {
        /* TODO IN ANOTHER PBI */
    }


    const parsedDate = t('email.inbox.date', {
        relative: dayjs.utc(date).local().fromNow(),
        date: dayjs.utc(date).local().format('ddd, MMM DD, YYYY'),
        time: dayjs.utc(date).local().format('h:mm A')
    })

    return (
        <div className='flex items-center py-4'>
            {getImage()}
            <div className='flex flex-col px-4'>
                <span className='subtitle'>{from}</span>
                <span>{subject}</span>
            </div>
            <div className="ml-auto flex justify-center items-center">
                <div className="mb-auto body3-medium">{parsedDate}</div>
                <div className="px-7">
                    <MoreMenu
                        iconClassName='default-toolbar-icon'
                        iconFillClassname='cursor-pointer icon-medium'
                        menuClassName='w-52'
                        items={getMoreMenuOption()}
                        onClick={onMoreMenuClick}
                    />
                </div>
                <div className='flex justify-center items-center rounded-full h-10 w-10 leading-10 collapsible-button cursor-pointer' onClick={() => collapseHandler()}>
                    <SvgIcon type={collapsedBody ? Icon.ArrowDown : Icon.ArrowUp} fillClass='collapsible-arrow-icon' />
                </div>
            </div>

        </div>
    )
}

export default EmailMessageHeader;