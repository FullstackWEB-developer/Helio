import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import DateTimeInput from '../date-time-input/date-time-input';
import Button from '../button/button';
import utils from '../../utils/utils';

interface DateTimeProps extends React.HTMLAttributes<HTMLElement> {
    isVisible: boolean,
    placeholderDate: string,
    placeholderTime: string,
    setDateTime: (dateTime: Date) => void
    setIsVisible: (isVisible: boolean) => void
}

const DateTime = React.forwardRef<HTMLElement, DateTimeProps>(({ isVisible, placeholderDate, placeholderTime, ...props }: DateTimeProps, ref) => {
    const {t} = useTranslation();
    const {handleSubmit, control, errors} = useForm();
    const [visible, setVisible] = useState(false);

    useEffect(() => {

        setVisible(isVisible);
    }, [isVisible]);

    const onSubmit = async (formData: any) => {
        if (!formData) {
            return;
        }

        const dateTime = utils.getDateTime(formData.date, formData.time);
        if (dateTime) {
            props.setDateTime(dateTime.toDate());
        }
    }

    const resetForm = () => {
        props.setIsVisible(false);
    }

    return (
        <Fragment>
            {visible &&
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='date'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <DateTimeInput
                            {...props}
                            type='date'
                            data-test-id={'datetime-date'}
                            className={'w-full border-none h-14'}
                            placeholder={t(placeholderDate)}
                            error={errors.date?.message}
                        />
                    )}
                />
                <Controller
                    type='text'
                    name='time'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <DateTimeInput
                            {...props}
                            type='time'
                            data-test-id={'datetime-time'}
                            className={'w-full border-none h-14'}
                            placeholder={t(placeholderTime)}
                            value={props.value}
                            error={errors.time?.message}
                        />
                    )}
                />
                <div className='flex flex-row space-x-4 justify-end bg-secondary-50 mt-2'>
                    <div className='flex items-center'>
                        <Button data-test-id='datetime-cancel-button'
                                type={'button'}
                                buttonType='secondary'
                                label={'common.cancel'}
                                onClick={() => resetForm()}
                        />
                    </div>
                    <div>
                        <Button data-test-id='datetime-save-button'
                                type={'submit'}
                                buttonType='small'
                                label={'common.save'}/>
                    </div>
                </div>
            </form>
            }
        </Fragment>
    );
})

export default DateTime;
