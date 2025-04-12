// 기존 수질 데이터 인터페이스는 그대로 유지
export interface WaterQualityData {
    FCLT_NAM: string;
    UPDATE_DAT: string;
    HR: string;
    PH: string;
    TDS: string;
    CA: string;
    MG: string;
    SO: string;
    CL: string;
    RC: string;
}

// 수질 데이터 응답에 대한 새로운 인터페이스 (캐시된 형태)
export interface CachedWaterQualityData {
    data: WaterQualityData;
    addressId: string | undefined;
    year: string | undefined;
    month: string | undefined;
}

// API 응답에 대한 인터페이스는 계속 유지
export interface WaterQualityDataResponse {
    message: string;
    data: WaterQualityData;
}
