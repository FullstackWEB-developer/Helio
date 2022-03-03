import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Dispatch, SetStateAction } from 'react';
import '../feedback.scss';
interface FeedbackRatingProps {
    id: number,
    selectedReview: number | undefined,
    icon: Icon,
    wrapperClassNames?: string,
    fillClass: string | undefined,
    text: string,
    setSelectedReview: Dispatch<SetStateAction<number | undefined>>
}

const FeedbackRatingOptions = ({id, selectedReview, icon, wrapperClassNames, fillClass, text, setSelectedReview}: FeedbackRatingProps) => {

    const getIsSelected = (id:number) => {
        return (selectedReview == id) && ' feedback-selected'
    }

    return (
        <>
            <div className={`feedback bg-white border-2 w-40 py-4 rounded-lg cursor-pointer ${wrapperClassNames} ${getIsSelected(id)}`} onClick={() =>setSelectedReview(id)} >
                <SvgIcon type={icon} fillClass={fillClass} className='w-10 h-10' wrapperClassName='flex justify-center items-center mb-2'/>
                <div className='subtitle flex justify-center items-center text-center'>{text}</div>
            </div>
        </>
    )
}

export default FeedbackRatingOptions;
