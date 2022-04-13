import { useSelector } from "react-redux";
import { selectIsStatusBarVisible } from "@shared/layout/store/layout.selectors";
import withErrorLogging from "../../shared/HOC/with-error-logging";
import QueueStatus from "@shared/layout/components/queue-status";
import { QueueStatusType } from "@shared/layout/enums/queue-status-type";
import { useTranslation } from 'react-i18next';

const StatusBar = () => {
    const displayStatusBar = useSelector(selectIsStatusBarVisible);
    const { t: translate } = useTranslation();

    const content = <div className="flex flex-col w-72 border-l h-full">
            <QueueStatus queueType={QueueStatusType.MyQueues} queueTitle={translate('statuses.queuestatus.my_queues')} />  
            <QueueStatus queueType={QueueStatusType.AllQueues} queueTitle={translate('statuses.queuestatus.all_queues')} />
    </div>


    return displayStatusBar ? content : null;
};

export default withErrorLogging(StatusBar);
