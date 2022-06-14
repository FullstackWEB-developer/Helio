import Confirmation from '@components/confirmation/confirmation'
import { useEffect, useState } from 'react'
import { Location } from 'history';
import { Prompt } from 'react-router-dom'
interface RouteLeavingGuardProps {
    when?: boolean | undefined;
    navigate: (path: string) => void;
    shouldBlockNavigation?: (location: Location) => boolean;
}
const RouteLeavingGuard = ({
    when,
    navigate,
    shouldBlockNavigation = (_) => true,
}: RouteLeavingGuardProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [lastLocation, setLastLocation] = useState<Location | null>(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);
    const handleBlockedNavigation = (nextLocation: Location): boolean => {
        if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
            setModalVisible(true);
            setLastLocation(nextLocation);
            return false;
        }
        return true;
    };
    const handleConfirmNavigationClick = () => {
        setModalVisible(false);
        setConfirmedNavigation(true);
    };
    useEffect(() => {
        if (confirmedNavigation && lastLocation) {
            navigate(lastLocation.pathname);
        }
    }, [confirmedNavigation, lastLocation]);
    return (
        <>
            <Prompt when={when} message={handleBlockedNavigation} />
            <Confirmation title={'common.route_leaving_confirmation_message'}
                okButtonLabel={'common.route_leaving_leave_button'}
                isOpen={modalVisible}
                onOk={handleConfirmNavigationClick} onCancel={() => setModalVisible(false)} onClose={() => setModalVisible(false)}
                closeableOnEscapeKeyPress={true} />
        </>
    );
};
export default RouteLeavingGuard