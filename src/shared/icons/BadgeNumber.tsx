import './BadgeNumber.scss';

export interface BadgeNumberProps {
    number?: number;
    type?: 'yellow' | 'gray' | 'red'
}

export const BadgeNumber = ({type = 'yellow', number = 0}: BadgeNumberProps) => {
    return (
        <svg id="Badges_Number_Fill_18px" data-name="Badges/Number/Fill/18px" xmlns="http://www.w3.org/2000/svg"
             width="18" height="18" viewBox="0 0 18 18">
            <rect id="Background" width="18" height="18" rx="9" className={`badge-${type}`}/>
            <text x={"6"} y={"13"} className='light-badge badge-number'>{number}</text>
        </svg>

    );
}
