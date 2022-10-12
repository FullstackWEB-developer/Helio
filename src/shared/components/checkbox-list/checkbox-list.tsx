import React, { useState, useEffect } from 'react';
import { TicketOptionsBase } from '@pages/tickets/models/ticket-options-base.model';
import { Control, Controller } from 'react-hook-form';
import Checkbox, { CheckboxCheckEvent } from '@components/checkbox/checkbox';
import { useTranslation } from 'react-i18next';

interface CheckboxProps {
    name: string;
    items: TicketOptionsBase[];
    control: Control;
    label?: (key: string) => string;
    resetDateTime?: Date;
    defaultValues?: boolean[];
}

const CheckboxList = ({ name, items, control, label, resetDateTime, defaultValues }: CheckboxProps) => {
    const { t } = useTranslation();
    const [selectedKeys, setSelectedKeys] = useState<boolean[]>(defaultValues ?? new Array(items.length).fill(false));
    const allKey = '0';

    const isAllListSelected = () => {
        return selectedKeys.filter(x => x).length === (items.length);
    }
    
    const updatedCheckedState = (position) => {
        setSelectedKeys(selectedKeys.map((item, index) => index === position ? !item : item));
    }

    useEffect(() => {
        setSelectedKeys(new Array(items.length).fill(false));
    }, [resetDateTime]);

    useEffect(() => {
        setSelectedKeys(defaultValues ?? new Array(items.length).fill(false));
    }, [defaultValues]);

    return <div>
        <Controller
            control={control}
            name={`${name}[${parseInt(allKey) + 1000}]`}
            defaultValue=''
            key={allKey}
            render={(props) => {
                return (
                    <Checkbox
                        name={`${name}[${allKey}]`}
                        ref={props.ref}
                        checked={isAllListSelected()}
                        truncate={true}
                        label={t('common.all')}
                        data-test-id={`${name}-checkbox-${allKey}`}
                        data-testid={`${name}-checkbox-${allKey}`}
                        value={allKey}
                        onChange={(e: CheckboxCheckEvent) => {
                            if(e.checked){
                                setSelectedKeys(new Array(items.length).fill(true));
                                items.forEach((item) => {
                                    let value: CheckboxCheckEvent = {
                                        value: item.key,
                                        checked:  true
                                    };
                                    let name2 = `${name}[${parseInt(item.key) + 1000}]`;
                                    control.setValue(name2, value, {
                                        shouldValidate: true
                                    });
                                });
                            } else {
                                setSelectedKeys(new Array(items.length).fill(false));
                                items.forEach((item) => {
                                    let value: CheckboxCheckEvent = {
                                        value: item.key,
                                        checked:  false
                                    };
                                    let name2 = `${name}[${parseInt(item.key) + 1000}]`;
                                    control.setValue(name2, value, {
                                        shouldValidate: true
                                    });
                                });
                            }
                        }}
                    />
                )
            }}
        />
        
        {
            items.map((item, index) => {
                return <Controller
                    control={control}
                    name={`${name}[${parseInt(item.key) + 1000}]`}
                    defaultValue=''
                    key={item.key}
                    render={(props) => {
                        return (
                            <Checkbox
                                name={`${name}[${item.key}]`}
                                ref={props.ref}
                                checked={selectedKeys[index]}
                                truncate={true}
                                label={label ? label(item.key) : item.value}
                                data-test-id={`${name}-checkbox-${item.key}`}
                                data-testid={`${name}-checkbox-${item.key}`}
                                value={item.key}
                                onChange={(e: CheckboxCheckEvent) => {
                                    updatedCheckedState(index);
                                    props.onChange(e);
                                    control.setValue(name, e, {shouldValidate: true});
                                }}
                            />
                        )
                    }}
                />
            })
        }
    </div>
};

export default CheckboxList;
