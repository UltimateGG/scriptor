import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../Jet';


const InputStyle = styled.input`
  width: 100%;
  border: none;
  border-radius: 0.25rem;
  background-color: rgba(0, 0, 0, 0.25);
  color: ${theme.colors.text};
  outline: none;
  transition: background-color 0.2s ease-in-out;
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;

interface EditableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  value: string;
  maxLength?: number;
  onChanged?: (value: string) => void;
}

const EditableText = ({ variant = 'p', value, maxLength, onChanged, ...rest }: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [styles, setStyles] = useState<any>({});
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const style = window.getComputedStyle(el, null);
    setStyles({ fontSize: style.fontSize, lineHeight: style.lineHeight, margin: style.margin });
  }, [ref]);

  const Tag = variant;
  return editing ? (
    <InputStyle type="text" autoFocus value={value} onChange={(e: any) => onChanged && onChanged(e.target.value.substring(0, maxLength))} onBlur={() => setEditing(false)} style={{...styles}} />
  ) : (
    <div style={{
      cursor: 'text',
      backgroundColor: value === '' ? 'rgba(0, 0, 0, 0.25)' : undefined,
      padding: value === '' ? '0.5rem' : undefined,
      borderRadius: value === '' ? '0.25rem' : undefined,
    }}>
      <Tag
        contentEditable={true}
        suppressContentEditableWarning={true}
        {...rest}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        ref={ref}
      >
        {value === '' ? <small>Click to edit</small> : value}
      </Tag>
    </div>
  );
}

export default EditableText;
