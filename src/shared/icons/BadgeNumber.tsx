import './BadgeNumber.scss';

export interface BadgeNumberProps {
    number?: number;
    type?: 'yellow' | 'gray' | 'red'
}

export const BadgeNumber = ({type = 'yellow', number = 0}: BadgeNumberProps) => {
    return (
        <div className={`px-2 light-badge rounded-xl badge-${type}`}>
            {number}
        </div>
    );
}
