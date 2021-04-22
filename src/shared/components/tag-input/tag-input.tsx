import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../label/label';
import Tag from './components/tag'
import './tag-input.scss';
import List from '../list/list';
import { Option } from '../option/option';

export enum TagInputLabelPosition {
    Vertical,
    Horizontal
};
interface TagInputProps extends React.HTMLAttributes<HTMLSelectElement> {
    label?: string,
    tagOptions: Option[],
    labelPosition?: TagInputLabelPosition
    initialTags?: string[],
    initialIsListVisible?: boolean,
    setSelectedTags: (tags: string[]) => void
}

const TagInput = React.forwardRef<HTMLSelectElement, TagInputProps>(({ label, tagOptions, initialTags, initialIsListVisible = false, labelPosition, ...props }: TagInputProps, ref) => {
    const { t } = useTranslation();
    const [isTagsVisible, setIsTagsVisible] = useState(false);
    const [isTagsListVisible, setIsTagsListVisible] = useState(initialIsListVisible);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        setTags(initialTags || []);

        if ((initialTags && initialTags.length > 0) || initialIsListVisible) {
            setIsTagsVisible(true);
        }
    }, [initialIsListVisible, initialTags]);

    const handleAddTagClick = () => {
        setIsTagsVisible(true);
        setIsTagsListVisible(true);
    }

    const handleChangeTags = (option: Option) => {
        if (!tags.includes(option.label)) {
            setTags([...tags, option.label]);
            props.setSelectedTags([...tags, option.label]);
        }
    }

    const removeTag = (i: number) => {
        const tagsNew = [...tags];
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
            <div className={`flex ${labelPosition === TagInputLabelPosition.Horizontal ? "flex-row" : "flex-col"}`}>
                <div>{label && <Label text={t(label)} className='body-medium pr-4' />}</div>
                <div>
                    {
                        !isTagsListVisible &&
                        <span className='h8 cursor-pointer' onClick={() => handleAddTagClick()}>
                            {t('tag_input.add_tag')}
                        </span>
                    }
                </div>
            </div>
            <div>
                {
                    isTagsVisible &&
                    <div className='tag-input'>
                        {tags.map((tag: string, i: number) => (
                            <Tag
                                key={i}
                                value={tag}
                                index={i}
                                remove={removeTag}
                            />
                        ))}
                        {isTagsListVisible && <List
                            options={filteredOptions}
                            onSelect={(option: Option) => {
                                handleChangeTags(option);
                            }}
                        />}
                    </div>
                }
            </div>
        </Fragment>
    );
})
TagInput.defaultProps = {
    labelPosition: TagInputLabelPosition.Horizontal
}

export default TagInput;
