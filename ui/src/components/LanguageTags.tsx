import React from 'react';
import { Button } from '@mui/joy';

const languages = ['Java', 'JavaScript', 'Python'];

interface Props {
  onSelect: (language: string) => void;
}

const LanguageTags: React.FC<Props> = ({ onSelect }) => {
  return (
    <div>
      {languages.map((language) => (
        <Button key={language} onClick={() => onSelect(language)}>
          {language}
        </Button>
      ))}
    </div>
  );
};

export default LanguageTags;
