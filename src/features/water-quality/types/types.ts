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

export interface WaterQualityDataResponse {
    message: string;
    data: WaterQualityData;
}
