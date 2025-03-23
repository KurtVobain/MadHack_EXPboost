import React, { useRef } from 'react';

interface MultiToggleProps {
    options: {
        value: any;
        title: string;
    }[];
    activeOption: any;
    reverse?: boolean;
    handleChange: (option: any) => void;
    isLoading?: boolean;
}

const MultiToggle: React.FC<MultiToggleProps> = ({ options, activeOption, reverse, handleChange, isLoading = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className={`relative flex bg-[#2C3039] rounded-2xl p-1 border border-purple`}>
            {options.map((option, index) => (
                <React.Fragment key={option.value}>
                    <button
                        onClick={() => !isLoading && handleChange(option.value)}  // Disable clicks if isLoading is true
                        className={`flex-1 py-2 px-4 text-sm font-medium text-center rounded-xl
              ${option.value === activeOption ? "bg-purple text-white" : ""}
              ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
                        disabled={isLoading}  // Disable the button if isLoading is true
                    >
                        {option.title}
                    </button>
                    {index < options.length - 1 && (
                        <div className="w-px bg-[#d7dbe3] my-2"></div>  // Vertical line between options
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default MultiToggle;
