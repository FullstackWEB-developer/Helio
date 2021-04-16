import {useSelector} from "react-redux";
import {selectIsStatusBarVisible} from "@shared/layout/store/layout.selectors";
import withErrorLogging from "../../shared/HOC/with-error-logging";
import QueueStatus from './components/quueue-status';
import Extensions from './components/extensions';
import './statusbar.scss';

const StatusBar = () => {
  const displayStatusBar = useSelector(selectIsStatusBarVisible);

  const content = <div className="flex flex-col w-72 border-l h-full">
    <div>
      <QueueStatus/>
    </div>
    <div>
      <Extensions/>
    </div>
  </div>;


  return displayStatusBar ? content : null;
};

export default withErrorLogging(StatusBar);
