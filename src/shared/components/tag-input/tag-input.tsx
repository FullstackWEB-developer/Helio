import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../label/label';
import Tag from './components/tag'
import './tag-input.scss';

interface TagInputProps extends React.HTMLAttributes<HTMLSelectElement> {
    label?: string,
    tagOptions: Option[],
    setSelectedTags: (tags: string[]) => void;
}

export interface Option {
    value: string,
    label: string
}

const TagInput = React.forwardRef<HTMLSelectElement, TagInputProps>(({ label, tagOptions, ...props }: TagInputProps, ref) => {
    const { t } = useTranslation();
    const [isTagsVisible, setIsTagsVisible] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    const handleChangeTags = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation();
        const selectedTag =
            tagOptions ? tagOptions.find((o: Option) => o.value.toString() === event.target.value) : {} as any;

        if (!tags.includes(selectedTag.label)){
            setTags([...tags, selectedTag.label]);
            props.setSelectedTags([...tags, selectedTag.label]);
        }
    }

    const removeTag = (i: number) => {
        const tagsNew = [ ...tags ];
        tagsNew.splice(i, 1);
        setTags(tagsNew);
        props.setSelectedTags(tagsNew);
    }

    return (
        <Fragment>
            {label && <Label text={label} className='body-medium' />}
            {
                !isTagsVisible &&
                <span className='pl-4 h8 cursor-pointer' onClick={() => setIsTagsVisible(true)}>
                    {t('tag_input.add_tag')}
                </span>
            }
            {
                isTagsVisible &&
                <div className='tag-input'>
                    {tags.map((tag: string, i: number ) => (
                        <Tag
                            key={i}
                            value={tag}
                            index={i}
                            remove={removeTag}
                        />
                    ))}
                    <select
                        ref={ref}
                        className={'p-2 border '}
                        onChange={(event) => {
                            handleChangeTags(event);
                        }}
                    >
                        {
                            tagOptions?.map((option: Option, index) => (
                                <option value={option.value} key={index}>{option.label}</option>
                            ))
                        }
                    </select>
                </div>
            }
        </Fragment>
    );
})

export default TagInput;


