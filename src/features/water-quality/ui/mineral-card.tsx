export const MineralCard = ({
    title,
    value,
    description,
}: {
    title: string;
    value: string | undefined;
    description: string;
}) => {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-sky-600 font-medium mb-1">{title}</div>
            <div className="text-lg font-bold text-gray-800">
                {value || '-'} <span className="text-xs font-normal text-gray-500">mg/L</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">{description}</div>
        </div>
    );
};
