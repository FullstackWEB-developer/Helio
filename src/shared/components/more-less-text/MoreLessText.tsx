import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './more-less-text.scss';

export interface MoreLessTextProp {
  characterLimit: number;
  text: string;
  className?: string;
}

const MoreLessText: FC<MoreLessTextProp> = ({ characterLimit, text, className }) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);

  const handleShowMoreClick = () => {
    setShowMore(prev => !prev);
  };

  return (
    <div className='more-less-text'>
      <p className={className}>
        {showMore && t(text)}
        {!showMore && t(text).substring(0, characterLimit)}
      </p>
      <span role='button' className='body3-Medium cursor-pointer' onClick={handleShowMoreClick}>
        {!showMore ? t('common.see_more') : t('common.see_less')}
      </span>
    </div>
  );
};

export default MoreLessText;
