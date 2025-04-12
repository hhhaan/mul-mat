import { Coffee } from 'lucide-react';

export const WaterQualityCard = ({
    icon,
    title,
    value,
    unit,
    statusInfo,
    scaTarget,
    scaRange,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | undefined;
    unit: string;
    statusInfo: {
        status: string;
        bgColor: string;
        color: string;
        forCoffee: string;
    };
    scaTarget: string;
    scaRange: string;
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    {icon}
                    <span className="text-gray-700 text-sm font-medium">{title}</span>
                </div>
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                    {statusInfo.status}
                </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
                {value || '-'} {value && unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
            </div>
            <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center">
                    <Coffee size={12} className="text-gray-600 mr-1" />
                    <span className="text-xs text-gray-600">{statusInfo.forCoffee}</span>
                </div>
                <div>
                    <span className="text-xs text-gray-500 font-medium">
                        SCA 기준: {scaTarget} ({scaRange})
                    </span>
                </div>
            </div>
        </div>
    );
};
