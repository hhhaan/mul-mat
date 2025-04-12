import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const BrewingControlChart = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    // 차트 설정 - 세로로 더 길게 설정
    const chartWidth = 360;
    const chartHeight = 480;
    const margin = { top: 40, right: 50, bottom: 50, left: 50 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // 추출률 범위 (x축)
    const extractionMin = 14;
    const extractionMax = 26;

    // TDS 범위 (y축)
    const tdsMin = 0.8;
    const tdsMax = 1.6;

    // 브루잉 비율 데이터 (g/L)
    const brewingRatios = [40, 45, 50, 55, 60, 65, 70];

    // 브루잉 영역
    const regions = [
        { id: 'weak-underdeveloped', x1: 14, x2: 18, y1: 0.8, y2: 1.1, label: 'WEAK\nUNDER-\nDEVELOPED' },
        { id: 'weak', x1: 18, x2: 22, y1: 0.8, y2: 1.1, label: 'WEAK' },
        { id: 'weak-bitter', x1: 22, x2: 26, y1: 0.8, y2: 1.1, label: 'WEAK\nBITTER' },
        { id: 'underdeveloped', x1: 14, x2: 18, y1: 1.1, y2: 1.4, label: 'UNDER-\nDEVELOPED' },
        { id: 'ideal', x1: 18, x2: 22, y1: 1.1, y2: 1.4, label: 'IDEAL\nOPTIMUM\nBALANCE' },
        { id: 'bitter', x1: 22, x2: 26, y1: 1.1, y2: 1.4, label: 'BITTER' },
        { id: 'strong-underdeveloped', x1: 14, x2: 18, y1: 1.4, y2: 1.6, label: 'STRONG\nUNDER-\nDEVELOPED' },
        { id: 'strong', x1: 18, x2: 22, y1: 1.4, y2: 1.6, label: 'STRONG' },
        { id: 'strong-bitter', x1: 22, x2: 26, y1: 1.4, y2: 1.6, label: 'STRONG\nBITTER' },
    ];

    // x 위치 계산 (추출률 → 픽셀)
    const xScale = (extraction) => {
        return ((extraction - extractionMin) / (extractionMax - extractionMin)) * width;
    };

    // y 위치 계산 (TDS → 픽셀)
    const yScale = (tds) => {
        return height - ((tds - tdsMin) / (tdsMax - tdsMin)) * height;
    };

    // 브루잉 비율 라인 생성 함수
    const calculateRatioLine = (ratio) => {
        const points = [];
        for (let extraction = extractionMin; extraction <= extractionMax; extraction += 0.5) {
            const tds = (ratio * extraction) / 10000;
            if (tds >= tdsMin && tds <= tdsMax) {
                points.push({ extraction, tds });
            }
        }
        return points;
    };

    // 브루잉 비율 라인 SVG 경로 생성
    const createRatioPath = (ratio) => {
        const points = calculateRatioLine(ratio);
        if (points.length === 0) return '';

        return points
            .map((pt, i) => {
                return `${i === 0 ? 'M' : 'L'} ${xScale(pt.extraction)} ${yScale(pt.tds)}`;
            })
            .join(' ');
    };

    // 특정 포인트에서 브루잉 비율 레이블 위치 계산
    const getRatioLabelPosition = (ratio) => {
        const points = calculateRatioLine(ratio);
        if (points.length < 2) return { x: 0, y: 0 };

        // 라인의 오른쪽 끝 근처에 레이블 배치
        const point = points[points.length - 2];
        return {
            x: xScale(point.extraction),
            y: yScale(point.tds),
        };
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-4 mb-3 flex items-center justify-between cursor-pointer"
                onClick={toggleExpand}
            >
                <div>
                    <h3 className="text-md font-semibold text-indigo-800">추출 컨트롤 차트 보기</h3>
                    <p className="text-xs text-indigo-600 mt-1">
                        커피 추출의 이상적인 영역과 현재 위치를 확인해 보세요.
                    </p>
                </div>
                {isExpanded ? (
                    <ChevronDown size={20} className="text-indigo-500" />
                ) : (
                    <ChevronRight size={20} className="text-indigo-500" />
                )}
            </div>

            {isExpanded && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300 ease-in-out">
                    <div className="flex justify-center">
                        <svg
                            width={chartWidth}
                            height={chartHeight}
                            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                            className="font-sans"
                        >
                            {/* 배경 및 테두리 */}
                            <rect
                                x={margin.left}
                                y={margin.top}
                                width={width}
                                height={height}
                                fill="white"
                                stroke="#ccc"
                                strokeWidth="1"
                            />

                            {/* 그리드 라인 */}
                            {Array.from({ length: (extractionMax - extractionMin) / 1 + 1 }).map((_, i) => {
                                const extraction = extractionMin + i;
                                return (
                                    <line
                                        key={`grid-x-${i}`}
                                        x1={margin.left + xScale(extraction)}
                                        y1={margin.top}
                                        x2={margin.left + xScale(extraction)}
                                        y2={margin.top + height}
                                        stroke="#ccc"
                                        strokeWidth="1"
                                    />
                                );
                            })}

                            {Array.from({ length: 9 }).map((_, i) => {
                                const tds = tdsMin + (i * (tdsMax - tdsMin)) / 8;
                                return (
                                    <line
                                        key={`grid-y-${i}`}
                                        x1={margin.left}
                                        y1={margin.top + yScale(tds)}
                                        x2={margin.left + width}
                                        y2={margin.top + yScale(tds)}
                                        stroke="#ccc"
                                        strokeWidth="1"
                                    />
                                );
                            })}

                            {/* 추출 영역 */}
                            {regions.map((region) => (
                                <g key={region.id}>
                                    <rect
                                        x={margin.left + xScale(region.x1)}
                                        y={margin.top + yScale(region.y2)}
                                        width={xScale(region.x2) - xScale(region.x1)}
                                        height={yScale(region.y1) - yScale(region.y2)}
                                        fill={region.id === 'ideal' ? 'rgba(255, 235, 178, 0.6)' : 'white'}
                                        stroke="#eee"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={margin.left + xScale((region.x1 + region.x2) / 2)}
                                        y={margin.top + yScale((region.y1 + region.y2) / 2)}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="6"
                                        fill="#444"
                                        style={{ whiteSpace: 'pre' }}
                                    >
                                        {region.label}
                                    </text>
                                </g>
                            ))}

                            {/* 브루잉 비율 라인 */}
                            {brewingRatios.map((ratio) => (
                                <g key={`ratio-${ratio}`}>
                                    <path
                                        d={createRatioPath(ratio)}
                                        transform={`translate(${margin.left}, ${margin.top})`}
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <text
                                        x={margin.left + getRatioLabelPosition(ratio).x}
                                        y={margin.top + getRatioLabelPosition(ratio).y - 10}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="#3b82f6"
                                        fontWeight="bold"
                                    >
                                        {/* {ratio}g */}
                                    </text>
                                </g>
                            ))}

                            {/* X축 (추출률) */}
                            <g transform={`translate(${margin.left}, ${margin.top + height})`}>
                                <line x1="0" y1="0" x2={width} y2="0" stroke="black" strokeWidth="2" />
                                {Array.from({ length: (extractionMax - extractionMin) / 1 + 1 }).map((_, i) => {
                                    const extraction = extractionMin + i;
                                    return (
                                        <g key={`x-axis-${i}`}>
                                            <line
                                                x1={xScale(extraction)}
                                                y1="0"
                                                x2={xScale(extraction)}
                                                y2="5"
                                                stroke="black"
                                                strokeWidth="1"
                                            />
                                            <text x={xScale(extraction)} y="20" textAnchor="middle" fontSize="10">
                                                {extraction}
                                            </text>
                                        </g>
                                    );
                                })}
                                <text x={width / 2} y="40" textAnchor="middle" fontWeight="bold" fontSize="12">
                                    EXTRACTION: Solubles Yield (%)
                                </text>
                            </g>

                            {/* Y축 (TDS) */}
                            <g transform={`translate(${margin.left}, ${margin.top})`}>
                                <line x1="0" y1="0" x2="0" y2={height} stroke="black" strokeWidth="2" />
                                {Array.from({ length: 9 }).map((_, i) => {
                                    const tds = tdsMin + (i * (tdsMax - tdsMin)) / 8;
                                    return (
                                        <g key={`y-axis-${i}`}>
                                            <line
                                                x1="-5"
                                                y1={yScale(tds)}
                                                x2="0"
                                                y2={yScale(tds)}
                                                stroke="black"
                                                strokeWidth="1"
                                            />
                                            <text
                                                x="-10"
                                                y={yScale(tds)}
                                                textAnchor="end"
                                                dominantBaseline="middle"
                                                fontSize="10"
                                            >
                                                {tds.toFixed(2)}
                                            </text>
                                        </g>
                                    );
                                })}
                                <text
                                    transform={`translate(-40, ${height / 2}) rotate(-90)`}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                    fontSize="12"
                                >
                                    STRENGTH: Solubles Concentration
                                </text>
                            </g>

                            {/* 우측 Y축 (브루잉 비율) */}
                            <g transform={`translate(${margin.left + width}, ${margin.top})`}>
                                <line x1="0" y1="0" x2="0" y2={height} stroke="black" strokeWidth="2" />
                                <text
                                    transform={`translate(40, ${height / 2}) rotate(90)`}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                    fontSize="12"
                                >
                                    BREWING RATIO: Grams per Liter
                                </text>
                            </g>
                        </svg>
                    </div>

                    <div className="mt-4 text-xs text-gray-600 p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold">추출 차트 사용 가이드:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>세로축(TDS)은 커피의 강도를 나타냅니다.</li>
                            <li>가로축(추출률)은 원두에서 추출된 고형물의 비율을 나타냅니다.</li>
                            <li>대각선은 브루잉 비율(커피:물 비율)을 나타냅니다.</li>
                            <li>
                                노란색으로 강조된 부분이 일반적으로 이상적인 추출 영역입니다(18-22% 추출률, 1.15-1.35%
                                TDS).
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
