import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../label/label';
import Tag from './components/tag'
import './tag-input.scss';
import List from '../list/list';
import {Option} from '../option/option';

interface TagInputProps extends React.HTMLAttributes<HTMLSelectElement> {
    label?: string,
    tagOptions: Option[],
    setSelectedTags: (tags: string[]) => void;
}

const TagInput = React.forwardRef<HTMLSelectElement, TagInputProps>(({ label, tagOptions, ...props }: TagInputProps, ref) => {
    const { t } = useTranslation();
    const [isTagsVisible, setIsTagsVisible] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    const handleChangeTags = (option: Option) => {
        if (!tags.includes(option.label)){
            setTags([...tags, option.label]);
            props.setSelectedTags([...tags, option.label]);
        }
    }

    const removeTag = (i: number) => {
        const tagsNew = [ ...tags ];
        tagsNew.splice(i, 1);
        setTags(tagsNew);
        props.setSelectedTags(tagsNew);
    }
    let filteredOptions = [...tagOptions];

    tags.forEach(tag => {
        filteredOptions = filteredOptions.filter(a => a.label !== tag);
    });

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
                    <List
                        options={filteredOptions}
                        onSelect={(option: Option) => {
                            handleChangeTags(option);
                        }}
                    />
                </div>
            }
        </Fragment>
    );
})

export default TagInput;


