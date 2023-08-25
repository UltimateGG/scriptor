import { TextField } from '@ultimategg/jetdesign';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface EditableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  value: string;
  maxLength?: number;
  markdown?: boolean;
  onChanged?: (value: string) => void;
  disabled?: boolean;
}

const EditableText = ({ variant = 'p', value, maxLength, markdown, onChanged, disabled, ...rest }: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);


  useEffect(() => setVal(value), [value]);

  useEffect(() => {
    const onClick = (e: any) => {
      if (e.target.tagName !== 'TEXTAREA') setEditing(false);
    }

    const onKeyDown = (e: any) => {
      if (e.key === 'Escape') setEditing(false);
    }

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKeyDown);
    }
  }, []);

  const Tag = markdown ? ReactMarkdown : variant;
  return editing ? (
    <TextField multiline className="editable-text" autoFocus value={val} onChange={str => {
      str = str.substring(0, maxLength || 100_000);
      setVal(str);
      onChanged && onChanged(str);
    }} onBlur={() => setEditing(true)} />
  ) : (
    <div style={{
        cursor: 'text',
        backgroundColor: val === '' ? 'rgba(0, 0, 0, 0.25)' : undefined,
        padding: val === '' ? '0.5rem' : undefined,
        borderRadius: val === '' ? '0.25rem' : undefined,
      }}
      onClick={() => !disabled && setEditing(true)}
    >
      <Tag
        contentEditable={!disabled}
        suppressContentEditableWarning={true}
        {...rest}
        onFocus={() => !disabled && setEditing(true)}
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
