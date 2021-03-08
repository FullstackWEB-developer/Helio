import React from 'react';

interface TagProps {
    value: string;
    index: number;
    remove: (i: number) => void;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(({ value, index, ...props }: TagProps, ref) => {
    const remove = () => props.remove(index);
    return (
        <div className='tag-input__tag'>
            <div className='tag-input__tag-content'>{value}</div>
            <div className='tag-input__tag-remove' onClick={remove}/>
        </div>
    );
})

export default Tag;
