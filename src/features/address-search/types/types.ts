// 주소 데이터 타입 정의
export interface Address {
    idx: string;
    full_address: string;
}

// API 응답 타입 정의
export interface AddressSuggestion {
    data: Address;
}
