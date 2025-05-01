'use client';

interface InputFieldProps {
    icon: React.ReactNode;
    label: string;
    name: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    unit: string;
    className?: string;
}

export const InputField = ({
    icon,
    label,
    name,
    value,
    onChange,
    placeholder,
    unit,
    className = '',
}: InputFieldProps) => {
    return (
        <div className={`p-4 ${className}`}>
            <div className="flex items-center mb-2">
                {icon}
                <label className="text-gray-700 font-medium">{label}</label>
            </div>
            <div className="flex items-center">
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700"
                    placeholder={placeholder}
                />
                <span className="text-sm text-right text-gray-500 ml-2 min-w-3">{unit}</span>
            </div>
        </div>
    );
};
