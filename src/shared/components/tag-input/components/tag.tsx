import SvgIcon, {Icon} from '@components/svg-icon';
import React from 'react';

interface TagProps {
    value: string;
    index: number;
    remove: (i: number) => void;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(({ value, index, ...props }: TagProps, ref) => {
    const remove = () => props.remove(index);
    return (
        <div className='flex flex-row items-center pl-6 pr-4 py-2 tag-input__tag '>
            <label className='tag-input__tag-content mr-4 body2'>{value}</label>
            <SvgIcon type={Icon.Close} wrapperClassName='cursor-pointer' className='icon-small' fillClass='rgba-05-fill' onClick={remove}/>
        </div>
    );
})

export default Tag;
