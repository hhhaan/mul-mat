'use client';
import { Layout } from '@/src/widgets/layout';
import { Droplet, Coffee, Droplets, AlertTriangle } from 'lucide-react';
import { SearchContainer } from '@/src/widgets/search-container';
import { Header } from '@/src/widgets/header';
import { useQuery } from '@tanstack/react-query';
import { estimateSOCL } from '@/src/features/water-quality/lib/estimate-SO-CL';
import { WaterQualityData } from '@/src/features/water-quality/types';
import { Address } from '@/src/features/address-search/types';

// 수질 상태 평가 함수
const getQualityStatus = (value: number | undefined, min?: number, max?: number) => {
    let status = '확인 필요';
    let bgColor = 'bg-gray-100';
    let color = 'text-gray-800';
    let forCoffee = '정보가 부족합니다';

    if (value !== undefined && value !== null) {
        if (min !== undefined && max !== undefined) {
            if (value >= min && value <= max) {
                status = '적정';
                bgColor = 'bg-green-100';
                color = 'text-green-800';
                forCoffee = '적합한 수준입니다';
            } else {
                status = '부적정';
                bgColor = 'bg-red-100';
                color = 'text-red-800';
                forCoffee = '부적합한 수준입니다';
            }
        } else if (value > 0) {
            status = '적정';
            bgColor = 'bg-green-100';
            color = 'text-green-800';
            forCoffee = '적합한 수준입니다';
        } else {
            status = '부적정';
            bgColor = 'bg-red-100';
            color = 'text-red-800';
            forCoffee = '부적합한 수준입니다';
        }
    }

    return {
        status,
        bgColor,
        color,
        forCoffee,
    };
};

export const HomeScreen = () => {
    // 캐시된 결과 데이터 조회 - 쿼리 키 추가
    const { data: cachedResult, isLoading } = useQuery<{ data: WaterQualityData; address?: Address }>({
        queryKey: ['waterQualityResult'], // 쿼리 키 추가
        queryFn: () => Promise.resolve({ data: {} as WaterQualityData }),
        enabled: false,
        staleTime: Infinity,
    });
    if (cachedResult) {
        console.log('from home screen', cachedResult);
    }

    // 로딩 처리
    if (isLoading) {
        return (
            <Layout>
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Header />
            <SearchContainer />

            <div className="px-4 pb-4 flex-1">
                {/* 수질 정보 카드 */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">수질 정보</h2>
                            <p className="text-xs text-gray-500">
                                {cachedResult?.data?.UPDATE_DAT
                                    ? `최종 업데이트: ${cachedResult.data.UPDATE_DAT}`
                                    : '데이터를 불러오세요'}
                            </p>
                        </div>
                        {cachedResult?.data?.FCLT_NAM && (
                            <div className="bg-blue-50 text-blue-700 py-1 px-2 rounded-full text-xs font-medium">
                                {cachedResult.data.FCLT_NAM}
                            </div>
                        )}
                    </div>

                    {!cachedResult?.data?.HR ? (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-gray-500">주소를 검색하고 수질 데이터를 조회해 보세요.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {/* 경도 */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-blue-500 mr-1" />}
                                    title="경도 (Hardness)"
                                    value={cachedResult?.data?.HR}
                                    unit="mg/L"
                                    statusInfo={getQualityStatus(
                                        cachedResult?.data?.HR ? Number(cachedResult.data.HR) : undefined,
                                        17,
                                        85
                                    )}
                                    scaTarget="68 mg/L"
                                    scaRange="17-85 mg/L"
                                />

                                {/* pH */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-purple-500 mr-1" />}
                                    title="pH (수소이온농도)"
                                    value={cachedResult?.data?.PH}
                                    unit=""
                                    statusInfo={getQualityStatus(
                                        cachedResult?.data?.PH ? Number(cachedResult.data.PH) : undefined,
                                        6.5,
                                        7.5
                                    )}
                                    scaTarget="7.0"
                                    scaRange="6.5-7.5"
                                />

                                {/* TDS */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-green-500 mr-1" />}
                                    title="TDS (증발잔류물)"
                                    value={cachedResult?.data?.TDS}
                                    unit="mg/L"
                                    statusInfo={getQualityStatus(
                                        cachedResult?.data?.TDS ? Number(cachedResult.data.TDS) : undefined,
                                        75,
                                        250
                                    )}
                                    scaTarget="150 mg/L"
                                    scaRange="75-250 mg/L"
                                />

                                {/* 잔류 염소 */}
                                <WaterQualityCard
                                    icon={<Droplet size={16} className="text-red-500 mr-1" />}
                                    title="잔류 염소 (Residual Chlorine)"
                                    value={cachedResult?.data?.RC}
                                    unit="mg/L"
                                    statusInfo={getQualityStatus(
                                        cachedResult?.data?.RC
                                            ? Number(cachedResult.data.RC) === 0
                                                ? 1
                                                : Number(cachedResult.data.RC)
                                            : undefined,
                                        0,
                                        0
                                    )}
                                    scaTarget="0 mg/L"
                                    scaRange="0 mg/L"
                                />
                            </div>

                            {/* 미네랄 성분 */}
                            <MineralsSection
                                HR={cachedResult?.data?.HR}
                                SO={cachedResult?.data?.SO}
                                CL={cachedResult?.data?.CL}
                            />

                            {/* 카페 필터 정보 */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                                <div className="border-b border-gray-100 pb-2 mb-3">
                                    <h2 className="text-lg font-bold text-gray-800">카페 필터 시스템 관리</h2>
                                </div>

                                <FilterManagementAlert HR={cachedResult?.data?.HR} />
                                <Disclaimer />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ContactUs />
        </Layout>
    );
};

const WaterQualityCard = ({
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

const MineralCard = ({
    title,
    value,
    description,
}: {
    title: string;
    value: string | undefined;
    description: string;
}) => {
    return (
        <div className="bg-white/70 rounded-lg p-3 shadow-sm">
            <div className="text-xs text-indigo-700 font-medium mb-1">{title}</div>
            <div className="text-lg font-bold text-gray-800">
                {value || '-'} <span className="text-xs font-normal text-gray-500">mg/L</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">{description}</div>
        </div>
    );
};

const MineralsSection = ({
    HR,
    SO,
    CL,
}: {
    HR: string | undefined;
    SO: string | undefined;
    CL: string | undefined;
}) => {
    const { estimatedCalcium, estimatedMagnesium } = estimateSOCL(HR ? Number(HR) : 0);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-indigo-700 flex items-center">
                    <Droplets size={16} className="mr-1" />
                    미네랄 성분 분석
                </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <MineralCard title="칼슘(추정)" value={`${estimatedCalcium}`} description="바디감과 단맛에 영향" />
                <MineralCard
                    title="마그네슘(추정)"
                    value={`${estimatedMagnesium}`}
                    description="산미와 추출 효율에 영향"
                />
                <MineralCard title="황산염" value={SO} description="쓴맛 완화, 밸런스" />
                <MineralCard title="염소이온" value={CL} description="부식 가능성, 쓴맛 강조" />
            </div>
        </div>
    );
};

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

// 정보 고지사항 컴포넌트
export const Disclaimer = () => {
    return (
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="mb-1">
                * 해당 정보는 공공데이터 기반으로 제공되며, 정확한 수질 확인을 위해서는 현장 테스트를 권장합니다.
            </p>
            <p>* 지역별 수돗물 기준 정보이며, 건물 배관 상태에 따라 차이가 있을 수 있습니다.</p>
        </div>
    );
};

export const ContactUs = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
            <h2 className="text-lg font-bold text-gray-800">문의하기</h2>
            <p className="text-sm text-gray-500">문의 사항이 있으시면 아래 연락처로 문의해주세요.</p>
            <p>hhanheon@gmail.com</p>
        </div>
    );
};
