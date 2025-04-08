export interface WaterQualityItem {
    // 기본 정보
    RNUM: string; // 순번
    FCLT_NAM: string; // 정수장명
    REGN_CTY: string; // 관리기관명
    BRTC_NM: string; // 시도명
    SIGNGU_NM: string; // 시군구명
    TELNO?: string; // 관리기관전화번호
    COLL_DAT?: string; // 채수일자
    INORG_NAM?: string; // 검사기관명
    UPDATE_DAT?: string; // 데이터기준일자

    // 미생물 관련 항목
    TCC?: string; // 일반세균
    TC?: string; // 총대장균군
    EFC?: string; // 대장균/분원성대장균군

    // 무기물질 관련 항목
    PB?: string; // 납
    FL?: string; // 불소
    AS?: string; // 비소
    SE?: string; // 셀레늄
    HG?: string; // 수은
    CN?: string; // 시안
    CR?: string; // 크롬
    NHN?: string; // 암모니아성질소
    NON?: string; // 질산성질소
    CD?: string; // 카드뮴
    BOR?: string; // 붕소
    BRO?: string; // 브롬산염
    'D-URNM'?: string; // 우라늄

    // 유기물질 관련 항목
    PHEN?: string; // 페놀
    DIA?: string; // 다이아지논
    PARA?: string; // 파라티온
    PENI?: string; // 페니트로티온
    CBR?: string; // 카바릴
    TCE?: string; // 1_1_1-트리클로로에탄
    TTCE?: string; // 테트라클로로에틸렌
    TCF?: string; // 트리클로로에틸렌
    CC?: string; // 사염화탄소
    DDE?: string; // 1_1-디클로로에틸렌
    DCM?: string; // 디클로로메탄
    BZ?: string; // 벤젠
    TOL?: string; // 톨루엔
    EB?: string; // 에틸벤젠
    XYL?: string; // 크실렌
    DBCP?: string; // 1_2-디브로모-3-클로로프로판
    DIOX?: string; // 1_4-다이옥산

    // 소독제 및 소독부산물 관련 항목
    RC?: string; // 잔류염소
    THMS?: string; // 총트리할로메탄
    CF?: string; // 클로로포름
    BDCM?: string; // 브로모디클로로메탄
    DBCM?: string; // 디브로모클로로메탄
    CH?: string; // 클로랄하이드레이트
    DIT?: string; // 디브로모아세토니트릴
    TRT?: string; // 디클로로아세토니트릴
    TRL?: string; // 트리클로로아세토니트릴
    HAS?: string; // 할로아세틱에시드
    FOAH?: string; // 포름알데히드

    // 심미적 영향물질 관련 항목
    HR?: string; // 경도
    KMN?: string; // 과망간산칼륨소비량
    ODOR?: string; // 냄새
    TW?: string; // 맛
    CU?: string; // 동
    CW?: string; // 색도
    DTG?: string; // 세제
    PH?: string; // 수소이온농도
    ZN?: string; // 아연
    CL?: string; // 염소이온
    RE?: string; // 증발잔류물
    FE?: string; // 철
    MN?: string; // 망간
    TU?: string; // 탁도
    SO?: string; // 황산이온
    AL?: string; // 알루미늄
}
