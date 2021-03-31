import Tab from "@components/tab/Tab";
import Tabs from "@components/tab/Tabs";
import { useTranslation } from 'react-i18next';

const QueueStatusTabs = () => {

  const {t: translate} = useTranslation();

  return (
    <div>
      <Tabs>
        <Tab title={translate('statuses.queuestatus.all_queues')}>{}</Tab>
        <Tab title={translate('statuses.queuestatus.my_queues')}>{}</Tab>
      </Tabs>
    </div>
  );
};

export default QueueStatusTabs;