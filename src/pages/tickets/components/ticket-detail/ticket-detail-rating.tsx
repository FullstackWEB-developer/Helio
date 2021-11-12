import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';

const TicketDetailRating = ({rating}: { rating?: number }) => {
    switch (rating) {
        case -1 :
            return <SvgIcon
                fillClass='icon-medium rating-widget-unsatisfied'
                type={Icon.RatingDissatisfied}/>;
        case 1 :
            return <SvgIcon
                fillClass='icon-medium rating-widget-satisfied'
                type={Icon.RatingVerySatisfied}/>;
        case 0:
            return <SvgIcon
                fillClass='icon-medium rating-widget-neutral'
                type={Icon.RatingSatisfied}/>;
        default:
            return null;
    }

}
export default TicketDetailRating;
