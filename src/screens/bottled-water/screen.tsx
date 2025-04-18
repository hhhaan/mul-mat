'use client';

import { useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { Droplet, TrendingUp, Info, ChevronLeft, Activity } from 'lucide-react';

import { Layout } from '@/src/widgets/page-layout';

// --- Type Definitions ---

// Interface for the structure of bottled water data
interface BottledWater {
    id: number;
    name: string;
    source: string;
    description2?: string; // Optional description
    pH: string; // Can be single value or range "7.7~8.3"
    hardness: string; // Can be single value or range "19.5~78"
    calcium: string; // Range "2.2~3.6"
    magnesium: string; // Range "1.0~2.8"
    potassium: string; // Range "1.5~3.4"
    sodium: string; // Range "4.0~7.2"
    gradient: string; // CSS class for gradient background
    textColor: string; // CSS class for text color
    bgColor: string; // CSS class for background color
    lightBg: string; // CSS class for light background
    darkBg: string; // CSS class for dark background
    borderColor: string; // CSS class for border color
    priority: number; // Priority for ordering
}

// Interface for props of the SimpleIndicator component
interface SimpleIndicatorProps {
    title: string;
    value: string; // The display value (can be range or single)
    unit: string;
    min: number;
    max: number;
    icon: ReactNode; // Icon component (e.g., Lucide icon instance)
    color: string; // CSS class for the progress bar color
}

// Interface for props of the AnimatedIndicator component
interface AnimatedIndicatorProps {
    label: string;
    value: number | null; // Expects a processed numerical value or null
    maxValue: number;
    textColor: string; // CSS class
    bgColor: string; // CSS class
    unit: string;
}

// Interface for props of the MineralsRadarChart component
interface MineralsRadarChartProps {
    water: BottledWater; // Requires the full BottledWater object
}

// Interface for props of the WaterSelectionTabs component
interface WaterSelectionTabsProps {
    bottledWaterData: BottledWater[];
    selectedWaterId: number;
    setSelectedWaterId: Dispatch<SetStateAction<number>>; // Type for useState setter function
}

// --- Helper Function ---

/**
 * Parses a string that might be a single number or a range (e.g., "2.2~3.6")
 * and returns the average if it's a range, the number if single, or null if invalid.
 * @param valueStr The string to parse. Can be string, undefined, or null.
 * @returns The average/parsed number, or null if parsing fails or format is incorrect.
 */
const parseAndAverage = (valueStr: string | undefined | null): number | null => {
    // Return null immediately if input is null, undefined, or not a string
    if (valueStr === null || valueStr === undefined || typeof valueStr !== 'string') {
        return null;
    }

    // Trim whitespace from the input string
    const trimmedStr = valueStr.trim();

    // Check for range format (e.g., "2.2~3.6") using includes()
    if (trimmedStr.includes('~')) {
        // Split the string by '~', trim parts, and parse them as floats
        const parts = trimmedStr.split('~').map((v) => parseFloat(v.trim()));
        // Check if splitting resulted in two valid numbers
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            // Return the average of the two numbers
            return (parts[0] + parts[1]) / 2;
        }
    } else {
        // If not a range, try parsing as a single number
        const num = parseFloat(trimmedStr);
        // Check if parsing resulted in a valid number
        if (!isNaN(num)) {
            return num;
        }
    }

    // Return null if parsing failed or the format was incorrect
    return null;
};

// --- Components ---

// Main screen component, using the Layout
export const BottledWaterScreen = () => {
    return (
        <Layout>
            <WaterQualityApp />
        </Layout>
    );
};

// Header component for the app
const AppHeader = () => {
    return (
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
                {/* Back button - Consider adding navigation logic */}
                <button className="mr-2 text-gray-500 hover:text-gray-700" aria-label="뒤로 가기">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold text-gray-800">생수 수질 정보</h1>
            </div>
        </div>
    );
};

// Component to display a single indicator with an animated progress bar
const SimpleIndicator = ({ title, value, unit, min, max, icon, color }: SimpleIndicatorProps) => {
    // State to manage the animated width of the progress bar
    const [width, setWidth] = useState<number>(0);

    // Effect to calculate and animate the progress bar width on mount and updates
    useEffect(() => {
        // Calculate the numerical value from the input string (handles ranges)
        const numericValue = parseAndAverage(value);

        let percentage = 0; // Default percentage
        // Calculate percentage only if value is valid and min/max range exists
        if (numericValue !== null && !isNaN(numericValue) && max > min) {
            // Clamp the value within the min/max bounds
            const clampedValue = Math.max(min, Math.min(numericValue, max));
            // Calculate the percentage relative to the min/max range
            const calculatedPercentage = ((clampedValue - min) / (max - min)) * 100;
            // Ensure the percentage is strictly between 0 and 100
            percentage = Math.min(Math.max(calculatedPercentage, 0), 100);
        }

        // Set a timeout to apply the width after a short delay, allowing for animation
        const timer = setTimeout(() => {
            setWidth(percentage);
        }, 100); // 100ms delay for animation effect

        // Cleanup function to clear the timeout if the component unmounts or dependencies change
        return () => clearTimeout(timer);
        // Dependencies for the effect: recalculate if these values change
    }, [value, min, max]);

    return (
        <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm relative overflow-hidden">
            {/* Indicator Title and Icon */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <span className="pr-1.5 pl-0">{icon}</span>
                    <span className="text-sm font-medium text-gray-700">{title}</span>
                </div>
            </div>
            {/* Indicator Value and Unit */}
            <div className="flex items-baseline mb-2">
                {/* Display the original value string or 'N/A' if null/undefined */}
                <span className="text-xl font-bold text-gray-800 mr-1">{value ?? 'N/A'}</span>
                <span className="text-xs text-gray-500">{unit}</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                    style={{ width: `${width}%` }} // Apply animated width
                    role="progressbar"
                    aria-valuenow={width}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>

            {/* Min/Max Labels for the progress bar */}
            <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{min}</span>
                <span className="text-xs text-gray-400">{max}</span>
            </div>
        </div>
    );
};

// Component for displaying individual mineral levels with an animated bar
const AnimatedIndicator = ({ label, value, maxValue, textColor, bgColor, unit }: AnimatedIndicatorProps) => {
    // State for the animated width of the bar
    const [width, setWidth] = useState<number>(0);

    // Effect to calculate and animate the width based on the value
    useEffect(() => {
        // Use the provided value, defaulting to 0 if null
        const numericValue = value ?? 0;
        // Calculate percentage, ensuring maxValue is positive to avoid division by zero
        const percentage = maxValue > 0 ? Math.min((numericValue / maxValue) * 100, 100) : 0;

        // Set a timeout for the animation effect
        const timer = setTimeout(() => {
            // Ensure width is not negative and apply the calculated percentage
            setWidth(percentage < 0 ? 0 : percentage);
        }, 100); // 100ms delay

        // Cleanup timeout on unmount or dependency change
        return () => clearTimeout(timer);
    }, [value, maxValue]); // Recalculate if value or maxValue changes

    // Format the display value (show 'N/A' if null, otherwise format to 1 decimal place)
    const displayValue = value !== null ? value.toFixed(1) : 'N/A';

    return (
        <div className="mb-4 relative">
            {/* Label and Value Display */}
            <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{label}</span>
                <span className={`text-xs font-semibold ${textColor}`}>
                    {displayValue} {unit}
                </span>
            </div>
            {/* Background of the bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative">
                {/* Animated foreground of the bar */}
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out absolute top-0 left-0 ${bgColor}`}
                    style={{ width: `${width}%` }} // Apply animated width
                    role="progressbar"
                    aria-valuenow={width}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
        </div>
    );
};

// Component displaying mineral profile using AnimatedIndicator components
const MineralsRadarChart = ({ water }: MineralsRadarChartProps) => {
    // Parse and average mineral values from the water data, handling potential nulls
    const calciumAvg = parseAndAverage(water.calcium);
    const magnesiumAvg = parseAndAverage(water.magnesium);
    const sodiumAvg = parseAndAverage(water.sodium);
    const potassiumAvg = parseAndAverage(water.potassium);

    // Define maximum values for scaling the bars (ADJUSTED based on user request and data analysis)
    const maxCalcium = 25; // Adjusted max value for Calcium
    const maxMagnesium = 6; // Adjusted max value for Magnesium
    const maxSodium = 12; // Adjusted max value for Sodium
    const maxPotassium = 6; // Adjusted max value for Potassium

    return (
        // Container with themed background color
        <div className={`rounded-xl ${water.lightBg} p-4 mx-4 mb-4 relative border ${water.borderColor}`}>
            <h3 className={`text-sm font-medium mb-3 ${water.textColor}`}>미네랄 프로필</h3>
            {/* Grid layout for mineral indicators */}
            <div className="grid grid-cols-2 gap-3 relative">
                <AnimatedIndicator
                    label="칼슘"
                    value={calciumAvg}
                    maxValue={maxCalcium} // Use adjusted max value
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
                <AnimatedIndicator
                    label="마그네슘"
                    value={magnesiumAvg}
                    maxValue={maxMagnesium} // Use adjusted max value
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
                <AnimatedIndicator
                    label="나트륨"
                    value={sodiumAvg}
                    maxValue={maxSodium} // Use adjusted max value
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
                <AnimatedIndicator
                    label="칼륨"
                    value={potassiumAvg}
                    maxValue={maxPotassium} // Use adjusted max value
                    textColor={water.textColor}
                    bgColor={water.bgColor}
                    unit="mg/L"
                />
            </div>
        </div>
    );
};

// Component for rendering selectable tabs for different water brands
const WaterSelectionTabs = ({ bottledWaterData, selectedWaterId, setSelectedWaterId }: WaterSelectionTabsProps) => {
    // Inline style to hide the scrollbar (cross-browser approach)
    const styles: { [key: string]: React.CSSProperties } = {
        hideScrollbar: {
            msOverflowStyle: 'none', // IE and Edge
            scrollbarWidth: 'none', // Firefox
            // For Webkit (Chrome, Safari), use ::-webkit-scrollbar pseudo-element in CSS
        },
    };

    return (
        <div className="px-4 pt-4 pb-2">
            {/* Horizontal scroll container for tabs */}
            <div
                className="flex overflow-x-auto gap-2 pb-1"
                style={styles.hideScrollbar}
                // Add CSS class for Webkit scrollbar hiding if needed:
                // className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar-webkit"
            >
                {bottledWaterData.map((water) => (
                    <button
                        key={water.id}
                        onClick={() => setSelectedWaterId(water.id)}
                        // Apply dynamic classes based on selection state
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                            selectedWaterId === water.id
                                ? `${water.bgColor} text-white shadow-md` // Selected state
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Default state
                        }`}
                        aria-pressed={selectedWaterId === water.id} // Accessibility
                    >
                        {water.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Main application component orchestrating the UI
const WaterQualityApp = () => {
    // Static bottled water data - typed with the BottledWater interface
    // In a real app, this might come from an API
    const bottledWaterData: BottledWater[] = [
        {
            id: 1,
            name: '제주 삼다수',
            source: '제주시 조천읍 교래리',
            description2: '클린한 커피를 마시고 싶다면',
            pH: '7.8', // example single value
            hardness: '22', // example single value (considered soft)
            calcium: '2.2~3.6',
            magnesium: '1.0~2.8',
            potassium: '1.5~3.4',
            sodium: '4.0~7.2',
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-600',
            lightBg: 'bg-blue-50',
            darkBg: 'bg-blue-500',
            borderColor: 'border-blue-200',
            priority: 3,
        },
        {
            id: 2,
            name: '평창수',
            source: '강원도 평창군',
            description2: '커피의 단맛을 원한다면.',
            pH: '7.8', // Example value, source might provide a range
            hardness: '19.5~78', // Moderately hard range
            calcium: '5.8~9.3',
            magnesium: '1.0~1.9',
            potassium: '0.3~1.4',
            sodium: '3.5~7.5',
            gradient: 'bg-gradient-to-br from-emerald-500 to-green-400',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-600',
            lightBg: 'bg-emerald-50',
            darkBg: 'bg-emerald-500',
            borderColor: 'border-emerald-200',
            priority: 1,
        },
        {
            id: 3,
            name: '아이시스 8.0',
            source: '경북 청도 / 충북 청주',
            description2: '커피의 화사함과 밝은 산미를 원한다면',
            pH: '7.7~8.3', // Alkaline range
            hardness: '64', // Example value (moderately hard)
            calcium: '5.0~20.0', // Note: Original was '5~20.0', ensure consistent format
            magnesium: '0.3~3.6',
            potassium: '0.3~1.5',
            sodium: '2.0~4.0',
            gradient: 'bg-gradient-to-br from-purple-500 to-violet-400',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-600',
            lightBg: 'bg-purple-50',
            darkBg: 'bg-purple-500',
            borderColor: 'border-purple-200',
            priority: 2,
        },
        {
            id: 4,
            name: '백산수',
            source: '백두산 내두천',
            description2: '균형잡힌 맛을 원한다면',
            pH: '7.2~7.4', // Near neutral
            hardness: '30', // Example value (soft)
            calcium: '3.0~5.8',
            magnesium: '2.1~5.4',
            potassium: '1.4~5.3',
            sodium: '4.0~12.0',
            gradient: 'bg-gradient-to-br from-amber-500 to-yellow-400',
            textColor: 'text-amber-600',
            bgColor: 'bg-amber-600',
            lightBg: 'bg-amber-50',
            darkBg: 'bg-amber-500',
            borderColor: 'border-amber-200',
            priority: 3,
        },
    ];

    // State to track the currently selected water ID
    // Initialize with the ID of the first item, or a default ID if the array could be empty
    const [selectedWaterId, setSelectedWaterId] = useState<number>(bottledWaterData[0]?.id ?? 1);

    // Find the full data object for the selected water ID
    // Provide a fallback to the first item if the find operation fails (e.g., invalid ID)
    const selectedWater = bottledWaterData.find((w) => w.id === selectedWaterId) ?? bottledWaterData[0];

    // Guard clause: Render a loading/error message if data somehow fails to load or select
    if (!selectedWater) {
        return <div className="p-4 text-red-600">오류: 생수 데이터를 불러올 수 없습니다.</div>;
    }

    // Parse hardness and pH for the summary section, providing defaults if parsing fails
    const hardnessValue = parseAndAverage(selectedWater.hardness) ?? 0; // Default to 0 if null
    const pHValue = parseAndAverage(selectedWater.pH) ?? 7.0; // Default to neutral (7.0) if null

    // Hardness classification based on common standards (mg/L as CaCO3)
    const getHardnessClass = (hardness: number): string => {
        if (hardness < 60) return '연수 (Soft)';
        if (hardness < 120) return '약경수 (Moderately Hard)';
        if (hardness < 180) return '경수 (Hard)';
        return '강경수 (Very Hard)';
    };

    // pH classification
    const getPHClass = (ph: number): string => {
        if (ph < 6.5) return '산성 (Acidic)';
        if (ph < 7.0) return '약산성 (Slightly Acidic)';
        if (ph <= 7.5) return '중성 (Neutral)';
        if (ph < 8.5) return '약알칼리성 (Slightly Alkaline)';
        return '알칼리성 (Alkaline)';
    };

    return (
        // Main container for the app UI
        <div className="w-full">
            {/* Application Header */}
            <AppHeader />

            {/* Water Selection Tabs */}
            <WaterSelectionTabs
                bottledWaterData={bottledWaterData}
                selectedWaterId={selectedWaterId}
                setSelectedWaterId={setSelectedWaterId}
            />

            {/* Header section displaying selected water name and source */}
            <div className={`relative ${selectedWater.gradient} mx-4 p-5 mb-6 overflow-hidden shadow-md rounded-xl`}>
                {/* Decorative SVG Background Wave */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" />
                    </svg>
                </div>

                {/* Content within the header */}
                <div className="relative flex justify-between items-center">
                    <div className="text-white z-10">
                        <h2 className="text-2xl font-bold mb-1">{selectedWater.name}</h2>
                        {/* Source information tag */}
                        <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full mt-2">
                            {selectedWater.source}
                        </div>
                    </div>
                    {/* Decorative Droplet Icon */}
                    <div className="w-16 h-20 relative flex items-center justify-center z-10">
                        <Droplet size={36} className="text-white/80" />
                    </div>
                </div>
            </div>

            {/* Water Description Section */}
            <div className="px-4 mb-6 relative">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedWater.description2}</p>
            </div>

            {/* Key Water Quality Indicators Section */}
            <div className="px-4 mb-6 relative">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">주요 수질 지표</h3>
                <div className="grid grid-cols-2 gap-3">
                    {/* pH Indicator */}
                    <SimpleIndicator
                        title="pH (산도)"
                        value={selectedWater.pH} // Display original string (e.g., "7.7~8.3")
                        unit=""
                        min={6.0} // Typical acceptable range min for drinking water
                        max={9.0} // Typical acceptable range max
                        icon={<Droplet size={16} className={`${selectedWater.textColor}`} />}
                        color={selectedWater.bgColor}
                    />
                    {/* Hardness Indicator - ADJUSTED MAX VALUE */}
                    <SimpleIndicator
                        title="경도 (Hardness)"
                        value={selectedWater.hardness} // Display original string
                        unit="mg/L"
                        min={0} // Soft water starts near 0
                        max={100} // ADJUSTED: Define a reasonable max for visualization
                        icon={<TrendingUp size={16} className={`${selectedWater.textColor}`} />}
                        color={selectedWater.bgColor}
                    />
                </div>
            </div>

            {/* Mineral Analysis Section - Uses adjusted maxValues */}
            <MineralsRadarChart water={selectedWater} />

            {/* Water Characteristics Summary Section */}
            <div
                className={`mx-4 p-4 rounded-xl ${selectedWater.lightBg} border ${selectedWater.borderColor} relative`}
            >
                <h3 className={`text-sm font-medium mb-3 flex items-center ${selectedWater.textColor}`}>
                    <Activity size={16} className="mr-1.5" />
                    수질 특성 요약
                </h3>

                {/* Summary Tags Grid */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { title: '물 타입', value: getHardnessClass(hardnessValue) },
                        { title: '산도', value: getPHClass(pHValue) },
                        { title: '브루잉 선호도', value: selectedWater.priority },
                    ].map((tag, index) => (
                        <div
                            key={index}
                            className="bg-white/60 rounded-lg p-2 text-center text-xs flex flex-col h-full"
                        >
                            <span className={`block font-medium ${selectedWater.textColor}`}>{tag.title}</span>
                            <div className="flex items-center justify-center flex-1">
                                <p className="font-semibold text-gray-800">{tag.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Notice Section */}
            <div className="bg-gray-100 px-4 py-3 text-xs text-gray-500 border-t border-gray-200 rounded-b-xl relative mt-4">
                <p className="flex items-center">
                    <Info size={12} className="mr-1 flex-shrink-0" />
                    <span>
                        이 데이터는 공시된 수질 검사 결과 등을 참고하여 작성되었으며, 실제 제품 및 시점에 따라 차이가
                        있을 수 있습니다. 참고용으로만 활용해주세요.
                    </span>
                </p>
            </div>
        </div>
    );
};
