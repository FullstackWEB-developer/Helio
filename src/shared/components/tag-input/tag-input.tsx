import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Label from '../label/label';
import Tag from './components/tag'
import './tag-input.scss';
import {Option} from '../option/option';
import classnames from 'classnames';
import SearchInputField from '@components/search-input-field/search-input-field';

interface TagInputProps extends React.HTMLAttributes<HTMLSelectElement> {
    label?: string,
    tagOptions: Option[],
    initialTags?: string[],
    initialIsListVisible?: boolean,
    setSelectedTags: (tags: string[]) => void,
    tagHolderClassName?: string,
}

const TagInput = React.forwardRef<HTMLSelectElement, TagInputProps>(({
    label,
    tagOptions,
    initialTags,
    tagHolderClassName ='pb-5',
    ...props
}: TagInputProps, ref) => {
    const {t} = useTranslation();
    const [searchTag, setSearchTag] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        setTags(initialTags || []);

    }, [initialTags]);

    const addTag = (option: Option) => {
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

    const getOptionFiltered = () => {
        return tagOptions.filter(opt =>
            opt.label.toLowerCase().includes(searchTag.toLowerCase()) &&
            !tags.some(tag => opt.label === tag)
        );
    }

    const onSearchInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && tags.length > 0 && !searchTag) {
            removeTag(tags.length - 1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const firstOption = getOptionFiltered()[0];
            if (firstOption) {
                addTag(firstOption);
                setSearchTag('');
            }
        }
    }

    return (
        <>
            <div className={classnames('flex flex-col', tagHolderClassName)}>
                {label && <Label text={t(label)} className='body2' />}
            </div>
            <div>
                {
                    tags.length > 0 &&
                    <div className={'tag-input mb-4'}>
                        {tags.map((tag: string, i: number) => (
                            <Tag
                                key={i}
                                value={tag}
                                index={i}
                                remove={removeTag}
                            />
                        ))}
                    </div>
                }
                <SearchInputField
                    placeholder={t('tickets.search_tag')}
                    autosuggestDropdown
                    autosuggestOptions={getOptionFiltered()}
                    onKeyDown={onSearchInputKeyDown}
                    value={searchTag}
                    suggestionsPlaceholder={t('tickets.tag_suggestion_placeholder')}
                    onChange={(e) => setSearchTag(e)}
                    onDropdownSuggestionClick={addTag}
                />
            </div>
        </>
    );
})

export default TagInput;
