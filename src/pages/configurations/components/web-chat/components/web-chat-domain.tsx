import { Control, Controller } from "react-hook-form";
import SvgIcon, { Icon } from "@components/svg-icon";
import { ControlledInput } from "@components/controllers";
import './web-chat-domain.scss';
const WebChatDomain = ({ index, control, defaultValue, onRemove }: { index: number, control: Control, defaultValue?: string, onRemove(index: number)}) => {

    return (
        <div className="flex flex-row body2 items-center">
            <div className="web-chat-input-row mx-6 pt-4">
                <ControlledInput name={`webChat.${index}.domain`}
                    errorMessage={!!control.formState.errors.webChat ? control.formState.errors.webChat[index]?.domain?.message : ''}
                    control={control}
                    label='configuration.web_chat.domain'
                    type='website'
                    required={true}
                    defaultValue={defaultValue}
                    onChange={(e) => control.setValue(`webChat.${index}.domain`, e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true
                    })}
                />
            </div>
            <SvgIcon dataTestId={`${index}-close-icon`} type={Icon.Close} className={`icon-medium-18 rgba-038-fill cursor-pointer`} onClick={() => onRemove(index)} />
        </div>
    )
}
export default WebChatDomain;
