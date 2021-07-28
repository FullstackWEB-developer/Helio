import SvgIcon, {Icon} from "@components/svg-icon";
import Tooltip from '@components/tooltip/tooltip';
import {useComponentVisibility} from "@shared/hooks";
import {Trans} from "react-i18next";
import './provider-mapping-tool-tip.scss';

const ProviderMappingToolTip = () => {
    const [isToolTipVisible, setToolTipVisible, containerRef] = useComponentVisibility<HTMLDivElement>(false);

    return (
        <div ref={containerRef}
            className='provider-mapping-tool-tip'
            onClick={() => setToolTipVisible(!isToolTipVisible)}
        >
            <SvgIcon
                type={Icon.ErrorFilled}
                fillClass='rgba-05-fill'
                className='cursor-pointer icon'
            />
            <Tooltip
                targetRef={containerRef}
                isVisible={isToolTipVisible}
                placement='bottom-start'
            >
                <div className="flex flex-col p-6 body2 w-80">
                    <Trans i18nKey="users.provider_tooltip" >
                        <span></span>
                        <span></span>
                    </Trans>
                </div>
            </Tooltip>
        </div>
    );
}

export default ProviderMappingToolTip
