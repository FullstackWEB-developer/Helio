import { useParams } from 'react-router';
import ConfigurationsMenu from './components/configurations-menu';

const Configurations = () => {
    const {type} = useParams<{type: string}>();
    return (
        <div className="flex flex-col w-full h-full overflow-y-auto">
            <ConfigurationsMenu activeUrl={type}></ConfigurationsMenu>
        </div>
    );
}

export default Configurations;
