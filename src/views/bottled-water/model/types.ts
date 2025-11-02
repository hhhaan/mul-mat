export interface BottledWater {
    id: number;
    name: string;
    source: string;
    description2?: string;
    pH: string;
    hardness: string;
    calcium: string;
    magnesium: string;
    potassium: string;
    sodium: string;
    gradient: string;
    textColor: string;
    bgColor: string;
    lightBg: string;
    darkBg: string;
    borderColor: string;
    priority: number;
    // 정적 분류 데이터
    hardnessClass: string;
    pHClass: string;
    waterType: string;
}
