import { Coffee } from 'lucide-react';
import { RecommendationCardProps } from '../types';

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium flex items-center mb-2 text-sm">
                <Coffee size={16} className="mr-2" />
                추출 조정 추천
            </h4>
            <p className="text-xs text-blue-50 leading-relaxed">{recommendation}</p>
        </div>
    );
};
