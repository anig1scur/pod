import { useState } from 'react'

export type DropdownProps<T> = {
  options: T[];
  selected: T;
  onSelect: (option: T) => void;
}

const Dropdown = <T,>(props: DropdownProps<T>) => {
  const {
    options,
    selected,
    onSelect
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='dropdown'>
      <div className='selected' onClick={ () => setIsOpen(!isOpen) }>
        { selected as string }
      </div>
      { isOpen && <div className='options' onBlur={ () => setIsOpen(false)}>
        { options.map((option, index) => (
          <div
            key={ index }
            className='option'
            onClick={ () => {
              onSelect(option)
              setIsOpen(false)
            } }
          >
            { option as string }
          </div>
        )) }
      </div> }
    </div>
  )
}

export default Dropdown;
