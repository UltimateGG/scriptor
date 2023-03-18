import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { TextArea, theme } from '../Jet';


const InputStyle = styled(TextArea)`
  &, & textarea {
    width: 100%;
    padding: 0;
    min-height: 1rem;
    border: none !important;
    background-color: rgba(0, 0, 0, 0.25) !important;
    border-radius: 0.25rem;
    color: ${theme.colors.text};
    outline: none;
    transition: background-color 0.2s ease-in-out;
    
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
`;

interface EditableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  value: string;
  maxLength?: number;
  markdown?: boolean;
  onChanged?: (value: string) => void;
}

const EditableText = ({ variant = 'p', value, maxLength, markdown, onChanged, ...rest }: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);


  useEffect(() => setVal(value), [value]);

  useEffect(() => {
    const onClick = (e: any) => {
      if (e.target.tagName !== 'TEXTAREA') setEditing(false);
    }

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const Tag = markdown ? ReactMarkdown : variant;
  return editing ? (
    <InputStyle autoFocus value={val} onChanged={str => {
      str = str.substring(0, maxLength || 100_000);
      setVal(str);
      onChanged && onChanged(str);
    }} onBlur={() => setEditing(false)} />
  ) : (
    <div style={{
        cursor: 'text',
        backgroundColor: val === '' ? 'rgba(0, 0, 0, 0.25)' : undefined,
        padding: val === '' ? '0.5rem' : undefined,
        borderRadius: val === '' ? '0.25rem' : undefined,
      }}
      onClick={() => setEditing(true)}
    >
      <Tag
        contentEditable={true}
        suppressContentEditableWarning={true}
        {...rest}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        {...(markdown ? { remarkPlugins: [remarkGfm], linkTarget: '_blank' } : {})}
        className="markdown-body"
      >
        {val === '' ? '(Click to edit)' : val}
      </Tag>
    </div>
  );
}

export default EditableText;
