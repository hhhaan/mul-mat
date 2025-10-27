import { AlertTriangle } from 'lucide-react';

// 필터 관리 알림 컴포넌트
export const FilterManagementAlert = ({ HR }: { HR: string | undefined }) => {
    const hardnessLevel = HR ? Number(HR) : 0;
    const filterRecommendation =
        hardnessLevel > 150
            ? '이 지역의 경도가 높아 필터 사용을 권장하며, 3개월마다 교체를 고려해주세요.'
            : '이 지역의 경도는 적절한 수준입니다.';
    const roRecommendation =
        hardnessLevel > 100 ? '정수 시스템을 사용 중이라면 역삼투압(RO) 시스템에 미네랄 재첨가 기능이 권장됩니다.' : '';

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 rounded-lg mb-3">
            <h4 className="font-medium flex items-center mb-1 text-sm text-amber-800">
                <AlertTriangle size={16} className="mr-1 text-amber-600" />
                필터 관리 알림
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
                {filterRecommendation} {roRecommendation}
            </p>
        </div>
    );
};
