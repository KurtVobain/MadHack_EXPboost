import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';

interface DropdownProps {
  options: string[];
  activeValue: string | null;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, activeValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative rounded shadow-md inline-block text-left w-full text-sm font-medium bg-white text-black">
      <div 
        onClick={handleToggle} 
        className="flex items-center h-full justify-between rounded px-4 py-2 cursor-pointer"
      >
        <span>{options.find(option => option === activeValue) || 'Select'}</span>
        {isOpen ? <IoIosArrowDown /> : <IoIosArrowBack />}
      </div>
      {isOpen && (
        <ul className="absolute w-full bg-white rounded shadow-lg z-10">
          {options.map(option => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-2 hover:bg-gray-200 ${
                activeValue === option ? 'bg-gray-200' : ''
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;