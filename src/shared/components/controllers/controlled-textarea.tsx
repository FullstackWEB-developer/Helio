import { Icon } from '@components/svg-icon/icon';
import { Control } from 'react-hook-form/dist/types/form';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TextArea from '@components/textarea/textarea';

interface ControlledTextAreaProps {
    id?: string;
    name: string;
    control: Control;
    defaultValue?: unknown;
    value?: string;
    label?: string;
    required?: boolean;
    error?: string;
    htmlFor?: string;
    hasBorder?: boolean;
    resizable?: boolean;
    textareaContainerClasses?: string,
    overwriteDefaultContainerClasses?: boolean,
    onChange?: (message: string) => void,
    icon?: Icon,
    iconOnClick?: () => void,
    isLoading?: boolean,
    iconClassNames?: string,
    iconFill?: string,
    iconContainerClassName?: string,
    maxLength?: number;
    className?: string;
    placeholder?: string;
    maxLengthClassName?: string;
    disabled?: boolean;
    showFormatting?: boolean;
    minRows?: number;
    maxRows?: number;
    rows?: number;
    showSendIconInRichTextMode?: boolean,
    refObject?: React.RefObject<HTMLTextAreaElement>,
    toggleRichTextMode?: boolean;
    hyperLinkButton?: boolean;
    hideFormattingButton?: boolean;
}
const ControlledTextArea = ({
    control,
    id,
    name,
    value,
    label,
    className,
    disabled,
    error,
    defaultValue,
    hasBorder,
    htmlFor,
    icon,
    iconClassNames,
    iconContainerClassName,
    iconFill,
    isLoading,
    maxLength,
    maxLengthClassName,
    maxRows,
    minRows,
    overwriteDefaultContainerClasses,
    placeholder,
    required,
    resizable,
    rows,
    showFormatting,
    textareaContainerClasses,
    showSendIconInRichTextMode,
    refObject,
    toggleRichTextMode,
    hyperLinkButton,
    hideFormattingButton,
    ...props
}: ControlledTextAreaProps) => {
    const { t } = useTranslation();
    const requiredText = t('common.required');

    const onChanged = (message: string, controller: ControllerRenderProps<Record<string, any>>) => {
        controller.onChange(message);
        props.onChange?.(message);
    }
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: required ? requiredText : '' }}
            defaultValue={defaultValue}
            render={(controllerProps) => {
                return (
                    <TextArea
                        {...controllerProps}
                        id={id}
                        name={name}
                        className={className}
                        disabled={disabled}
                        error={error}
                        hasBorder={hasBorder}
                        htmlFor={htmlFor}
                        icon={icon}
                        iconClassNames={iconClassNames}
                        iconContainerClassName={iconContainerClassName}
                        iconFill={iconFill}
                        iconOnClick={props.iconOnClick}
                        isLoading={isLoading}
                        label={label}
                        maxLength={maxLength}
                        maxLengthClassName={maxLengthClassName}
                        maxRows={maxRows}
                        minRows={minRows}
                        onChange={(event) => onChanged(event, controllerProps)}
                        required={required}
                        overwriteDefaultContainerClasses={overwriteDefaultContainerClasses}
                        placeHolder={placeholder}
                        resizable={resizable}
                        rows={rows}
                        showFormatting={showFormatting}
                        textareaContainerClasses={textareaContainerClasses}
                        value={controllerProps.value}
                        showSendIconInRichTextMode={showSendIconInRichTextMode}
                        ref={refObject}
                        hyperLinkButton={hyperLinkButton}
                        toggleRichTextMode={toggleRichTextMode}
                        hideFormattingButton={hideFormattingButton}
                    />

                );
            }}
        />

    )

}

export default ControlledTextArea;
