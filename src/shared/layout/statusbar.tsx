import {useSelector} from "react-redux";
import {selectIsStatusBarVisible} from "@shared/layout/store/layout.selectors";
import withErrorLogging from "../../shared/HOC/with-error-logging";
import Extensions from './components/extensions';
import './statusbar.scss';
import QueueStatusTabs from "@shared/layout/components/queue-status-tabs";

const StatusBar = () => {
    const displayStatusBar = useSelector(selectIsStatusBarVisible);

    const content = <div className="flex flex-col w-72 border-l h-full">
        <div className='queue-status-div overflow-y-auto'>
            <QueueStatusTabs/>
        </div>
        <div className='overflow-y-auto'>
            <Extensions/>
        </div>
    </div>;


    return displayStatusBar ? content : null;
};

export default withErrorLogging(StatusBar);
