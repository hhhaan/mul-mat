import React from 'react';
import { ResultCardProps } from '../types';

export const ResultCard: React.FC<ResultCardProps> = ({ title, value, description, status, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    {icon}
                    <span className="text-gray-700 text-sm font-medium ml-1">{title}</span>
                </div>
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === 'optimal'
                            ? 'bg-green-100 text-green-800'
                            : status === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : status === 'low'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {status === 'optimal' ? '최적' : status === 'high' ? '높음' : status === 'low' ? '낮음' : '계산 중'}
                </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
                {value} <span className="text-xs font-normal text-gray-500">%</span>
            </div>
            <div className="mt-1 text-xs text-gray-600">{description}</div>
        </div>
    );
};
