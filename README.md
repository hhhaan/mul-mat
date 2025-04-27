# Mul-Mat Project

## 프로젝트 소개

이 프로젝트는 Next.js 15를 기반으로 한 웹 애플리케이션입니다. Feature-Sliced Design 아키텍처를 적용하여 확장 가능하고 유지보수가 용이한 구조로 설계되었습니다.

커피의 98%는 물로 이루어져 있으며, 이는 커피의 맛에 결정적인 영향을 미칩니다. 바리스타로 일하며 여러 매장에서 변화하는 수질로 인해 커피의 일관성을 유지하기 어려워하는 상황을 목격했습니다. 이를 해결하기 위해 공공데이터 기반 지역별 취정수장의 월별 수질 정보를 제공하는 서비스를 만들었습니다. 결과적으로 타겟층이 명확한 카테고리 킬링 서비스를 구현했습니다.

🌐 **서비스 도메인**: [https://mulmat.site](https://mulmat.site)

## 기술 스택

### Frontend

-   **Framework**: Next.js 15.2.2
-   **Language**: TypeScript
-   **UI Library**: React 19
-   **State Management**:
    -   Zustand (클라이언트 상태 관리)
    -   TanStack Query (서버 상태 관리)

### Backend Integration

-   **Database**: Supabase

### Development Tools

-   **Styling**: TailwindCSS
-   **PWA Support**: next-pwa

## 주요 기능

-   PWA (Progressive Web App) 지원
-   모바일 최적화 디자인 시스템
-   서버 사이드 렌더링 (Next.js)
-   공공데이터 기반 지역별 취정수장 수질 정보 제공
-   커피 추출에 최적화된 물 정보 분석

## 프로젝트 구조 (FSD 아키텍처)

````
mul-mat/
├── app/          # 페이지 및 라우팅
├── src/
│ ├── shared/     # 공통 유틸리티, UI 키트, API
│ ├── entities/   # 비즈니스 엔티티 (사용자, 상품 등)
│ ├── features/   # 비즈니스 기능 구현
│ ├── widgets/    # 복합 UI 컴포넌트
│ └── pages/      # 페이지 컴포넌트
├── public/       # 정적 파일
├── public/ # 정적 파일
└── ...
### FSD 레이어 설명

- **shared**: 공통으로 사용되는 UI 컴포넌트, 유틸리티 함수, API 클라이언트
- **entities**: 핵심 비즈니스 엔티티 모델 및 관련 로직
- **features**: 사용자 시나리오 및 비즈니스 기능 구현
- **widgets**: 여러 features를 조합한 복합 UI 블록
- **pages**: 최종 페이지 컴포넌트

## 시작하기

1. 프로젝트 설치

```bash
npm install
````

2. 환경 변수 설정
   `.env.local` 파일을 생성하고 필요한 환경 변수를 설정합니다.

3. 개발 서버 실행

```bash
npm run dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속

## 빌드 및 배포

프로덕션 빌드:

```bash
npm run build
```

프로덕션 서버 실행:

```bash
npm run start
```
