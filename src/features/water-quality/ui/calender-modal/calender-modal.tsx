import { ChevronLeft, ChevronRight, Calendar, X, AlertCircle } from 'lucide-react';
import { useCalendarModal } from '../../model';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CalendarModal = ({ isOpen, onClose }: CalendarModalProps) => {
    const {
        selectedYear,
        selectedMonth,
        latestYear,
        latestMonth,
        latestDate,
        monthNames,
        setSelectedMonth,
        handlePrevYear,
        handleNextYear,
        isFutureDate,
        applySelectedDate,
    } = useCalendarModal();

    // 모달 외부 클릭 시 닫기
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // latestDate가 null이면 아무것도 렌더링하지 않음
    if (!latestDate || !isOpen || !latestYear || !latestMonth) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden transform transition-all">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Calendar size={18} className="mr-2 text-sky-600" />
                        날짜 선택
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-200"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 연도 선택 헤더 */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                    <button
                        className="p-1 rounded-full text-sky-600 hover:bg-sky-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                        onClick={() => {
                            handlePrevYear();
                        }}
                        disabled={selectedYear === latestYear - 3}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-medium text-gray-800">{selectedYear}년</span>
                    <button
                        className="p-1 rounded-full text-sky-600 hover:bg-sky-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                        disabled={selectedYear === latestYear}
                        onClick={() => {
                            handleNextYear();
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* 알림 메시지 */}
                <div className="bg-amber-50 text-amber-800 text-xs p-2 flex items-center justify-center">
                    <AlertCircle size={14} className="mr-1 text-amber-600" />
                    {selectedYear === latestYear - 3
                        ? '최대 3년까지 조회 가능합니다.'
                        : `${latestDate} 이후의 데이터는 아직 없습니다`}
                </div>

                {/* 월 그리드 */}
                <div className="grid grid-cols-3 gap-2 p-4">
                    {monthNames.map((name, idx) => {
                        const isSelected = idx === selectedMonth;
                        const isFuture = isFutureDate(idx);

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (!isFuture) {
                                        setSelectedMonth(idx);
                                    }
                                }}
                                className={`
                    flex items-center justify-center p-3 rounded-lg transition-colors
                    ${isSelected ? 'bg-sky-600 text-white' : ''}
                    ${!isSelected && !isFuture ? 'text-black bg-gray-100' : ''}
                    ${
                        isFuture
                            ? 'opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed filter blur-[0.5px]'
                            : 'cursor-pointer hover:bg-sky-50'
                    }
                  `}
                            >
                                {name}
                            </div>
                        );
                    })}
                </div>

                {/* 푸터 */}
                <div className="border-t border-gray-200 px-4 py-3 flex justify-end space-x-2 bg-gray-50">
                    <button className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className="px-4 py-2 text-sm rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                        onClick={() => {
                            applySelectedDate();
                            onClose();
                        }}
                    >
                        현재 선택: {selectedYear}년 {selectedMonth + 1}월
                    </button>
                </div>
            </div>
        </div>
    );
};
