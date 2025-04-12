import React from 'react';
import { Box } from '@/src/shared/ui';
import { InputFieldProps } from '../types';

export const InputField: React.FC<InputFieldProps> = ({ label, icon, placeholder, value, onChange, name, unit }) => {
    return (
        <Box>
            <div className="flex items-center mb-2">
                {icon}
                <label className="text-gray-700 text-sm font-medium ml-1">{label}</label>
            </div>
            <div className="flex items-center justify-between">
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                    placeholder={placeholder}
                />
                {unit && <span className="text-xs text-gray-500 ml-2">{unit}</span>}
            </div>
        </Box>
    );
};
