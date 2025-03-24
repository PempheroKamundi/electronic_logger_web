import React from 'react'

interface SubmitButtonProps {
    label?: string
    disabled?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
    label = 'Submit',
    disabled = false,
}) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className={`w-full py-2 px-4 rounded transition duration-150 ${
                disabled
                    ? 'bg-gray-400 cursor-not-allowed text-gray-100'
                    : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
        >
            {label}
        </button>
    )
}

export default SubmitButton
