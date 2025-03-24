import React from 'react'

interface CycleUsageInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CycleUsageInput: React.FC<CycleUsageInputProps> = ({
    value,
    onChange,
}) => {
    return (
        <div>
            <label
                htmlFor="currentCycleUsed"
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                Current Cycle Used (Hrs)
            </label>
            <input
                type="text"
                pattern="[0-9]*\.?[0-9]*"
                id="currentCycleUsed"
                name="currentCycleUsed"
                value={value}
                onChange={onChange}
                placeholder="Enter hours"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            />
        </div>
    )
}

export default CycleUsageInput
