import React, { useState } from 'react';
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


  const Tag = markdown ? ReactMarkdown : variant;
  return editing ? (
    <InputStyle autoFocus value={value} onChange={(e: any) => onChanged && onChanged(e.target.value.substring(0, maxLength))} onBlur={() => setEditing(false)} />
  ) : (
    <div style={{
        cursor: 'text',
        backgroundColor: value === '' ? 'rgba(0, 0, 0, 0.25)' : undefined,
        padding: value === '' ? '0.5rem' : undefined,
        borderRadius: value === '' ? '0.25rem' : undefined,
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
        {value === '' ? '(Click to edit)' : value}
      </Tag>
    </div>
  );
}

export default EditableText;
