# FE Convention

# 아키텍처 구조

해당 문서에서는 Featured Sliced Design을 기반으로 한 아키텍처 구조를 설명합니다.

레스토랑을 즐겨찾기 하는 예시로 해당 아키텍처를 살펴보겠습니다.

### 요구사항 예시

1. 레스토랑에 대해 즐겨찾기를 누를 수 있어야 함
2. 즐겨찾기한 레스토랑을 구분할 수 있어야 함
3. 즐겨찾기 정보는 마이페이지, 레스토랑 전체 목록, 홈 화면 등에서 사용됨

## [Featured Sliced Design](https://feature-sliced.github.io/documentation/)

### 기본 계층 구조

```jsx
상위 레이어는 하위 레이어에만 의존해야 하며, 반대는 허용되지 않습니다.
```

```jsx
src/
├── app/                # 애플리케이션 초기화, 글로벌 스타일, 프로바이더
├── pages/              # 페이지 레이아웃 및 라우팅
├── widgets/            # 복합 UI 블록
├── features/           # 사용자 인터랙션 기능
├── entities/           # 비즈니스 엔티티
└── shared/             # 공유 유틸리티 및 UI 키트
```

## Layer 별 책임

### App Layer

-   애플리케이션 초기화, 전역 상태 관리, 프로바이더 설정을 담당합니다.

```jsx
// src/app/providers/provider.tsx
import { AuthProvider } from './auth-provider';

export const App = ({ children }) => {
    return <AuthProvider>{children}</AuthProvider>;
};
```

### Pages Layer

-   라우팅 및 레이아웃 관리
-   Widgets, Features의 ui 블록들을 조립해 페이지를 구성합니다.
-   비즈니스 로직이나 상태 관리는 전부 `features` , `entities`, `widgets` 에서 처리되도록 합니다.

```jsx
// src/pages/favorite/index.tsx
import { Layout } from '@/widgets';
import { useUserStore } from '@/entities/user/model/store';
import { useFavoriteToggle, useFavoriteRestaurants } from '@/features/favorite/hooks';
import { RestaurantCard } from '@/widgets/restaurant-card';

export const FavoriteScreen = () => {
    // entities에서 사용자 정보 가져오기
    const userId = useUserStore((state) => state.user?.id);

    // features에서 즐겨찾기 기능 가져오기
    const { toggleFavorite, isProcessing } = useFavoriteToggle();
    const { data: favorites } = useFavoriteRestaurants(userId);

    return (
        <Layout>
            <h1>즐겨찾기한 레스토랑</h1>

            <div>
                {favorites?.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={{ ...restaurant, isFavorite: true }}
                        onFavoriteToggle={() => toggleFavorite(restaurant.id)}
                        isProcessing={isProcessing(restaurant.id)}
                    />
                ))}
            </div>
        </Layout>
    );
};
```

### Widgets Layer

-   특정 도메인의 UI 블록을 조합한 **재사용 가능한 컴포넌트 단위**입니다.
-   `features`, `entities`에서 제공하는 로직 및 데이터를 조합하여 **페이지에서 직접 사용 가능한 시각적 블록**을 구성합니다.
-   예: `Layout`, `RestaurantCard`, `UserProfileCard` 등
-   비즈니스 로직은 `features` 혹은 `entities`에서 처리하고, **widgets는 UI 중심으로 구성**되도록 합니다.

```jsx
// src/widgets/layout/index.tsx
'use client';

import { Navigation } from './ui/navigation';
import { Header } from './ui/header';

/**
 * 애플리케이션의 공통 레이아웃 컴포넌트
 * 헤더, 내비게이션 및 메인 콘텐츠를 포함합니다.
 */
export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="app-container">
            <div className="app-content">
                <Header />
                <main>{children}</main>
                <Navigation />
            </div>
        </div>
    );
};
```

### Features Layer

-   사용자의 인터랙션과 관련된 **단일 기능 단위**를 담당합니다.
-   하나의 목적을 가진 UI, 로직, 상태, API 등을 하나의 슬라이스로 구성합니다.
-   예: 즐겨찾기 토글, 로그인 처리, 검색 기능 등

```jsx
// src/features/favorite/ui/favorite-button/index.tsx

/**
 * 즐겨찾기 버튼 컴포넌트
 * 사용자가 레스토랑을 즐겨찾기에 추가하거나 제거할 수 있는 버튼 UI
 */
import { useCallback } from 'react';
import { Bookmark, Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user/model/store';

/**
 * 컴포넌트 Props 인터페이스
 * @prop isFavorite - 현재 즐겨찾기 상태
 * @prop isProcessing - 처리 중인지 여부 (로딩 상태)
 * @prop onToggle - 즐겨찾기 토글 핸들러 함수
 */
interface FavoriteButtonProps {
    isFavorite: boolean;
    isProcessing: boolean;
    onToggle: () => void;
}

export const FavoriteButton = ({ isFavorite, isProcessing, onToggle }: FavoriteButtonProps) => {
    const { isLoggedIn, redirectToLogin } = useUserStore();

    /**
     * 버튼 클릭 핸들러
     * 1. 이벤트 버블링 방지
     * 2. 로그인 상태 확인
     * 3. 미로그인 시 로그인 페이지로 리다이렉트
     * 4. 로그인 상태면 즐겨찾기 토글 실행
     */
    const handleClick = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            e.stopPropagation();

            if (!isLoggedIn) {
                redirectToLogin();
                return;
            }
            onToggle();
        },
        [onToggle, isLoggedIn, redirectToLogin]
    );

    return (
        <button
            className="favorite-btn"
            onClick={handleClick}
            disabled={isProcessing}
            aria-label={isFavorite ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
        >
            {isProcessing ? (
                <Loader2 className="animate-spin" />
            ) : isFavorite ? (
                <Bookmark className="favorite-active" />
            ) : (
                <Bookmark />
            )}
        </button>
    );
};
```

### Entities Layer

-   도메인 중심의 **비즈니스 엔티티**를 정의하는 레이어입니다.
-   API, 상태, 타입, 유틸리티 등 **특정 도메인(예: User, Restaurant)** 과 직접적으로 연결된 로직을 포함합니다.
-   예: 사용자 정보, 레스토랑 정보, 상품 정보 등
-   상태 관리는 주로 `model/store.ts`에서, 타입은 `model/types.ts` 또는 `types.ts`에서 정의합니다.
-   여러 feature에서 공통으로 사용하는 **핵심 데이터 단위**를 제공하며, 로직의 재사용성과 일관성을 높입니다.

```jsx
entities/restaurant/                # 레스토랑 엔티티
├── api/                            # 레스토랑 관련 API
│   └── index.ts
│
├── model/                          # 레스토랑 관련 모델 정의
│   ├── store.ts                    # 레스토랑 상태 관리 (useRestaurantStore)
│   └── types.ts                    # 레스토랑 타입 정의 (Restaurant 인터페이스)
│
└── lib/                            # 레스토랑 관련 헬퍼 함수
    ├── filters.ts                  # 레스토랑 필터링 함수 (filterByCategory, ...)
    ├── sorters.ts                  # 레스토랑 정렬 함수 (sortByRating, ...)
    ├── formatters.ts               # 레스토랑 데이터 포맷팅 (formatAddress, formatPrice, ...)
    └── index.ts                    # 헬퍼 함수 리익스포트

```

### Shared Layer

-   공유 유틸리티와 UI 키트를 담당합니다. 프로젝트 전체에서 사용되는 공통 기능을 제공합니다.

```jsx
// src/shared/utils/axios/axiosClient.ts
import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
```

## 슬라이스 내부 구조

각 슬라이스는 다음 구조를 따릅니다

```jsx
feature-name/
├── api/            # 외부 API 통신
├── hooks/          # 커스텀 훅
├── lib/            # 헬퍼 함수
├── model/          # 상태 관리
└── ui/             # UI 컴포넌트
```

예시) `features/favorite` 구조

```jsx
favorite/
├── api/
│   └── index.ts
├── hooks/
│   ├── useFavoriteIds.ts
│   ├── useFavoriteRestaurants.ts
│   ├── useFavoriteToggle.ts
│   └── useRestaurantsWithFavorites.ts
├── model/
│   └── quries.ts
└── ui/
    └── favorite-button/
        └── index.tsx
```

# **네이밍 컨벤션**

## 파일 및 폴더 이름 규칙

-   슬라이스 폴더명: `kebab-case` 사용 (예: `user`, `user-settings`)
-   레이어 내부 폴더: 기능이나 도메인을 나타내는 명사로 명명 (예: `auth`, `favorite`)
-   계층을 나타내는 단어(page, widget 등)는 폴더명에 포함하지 않음
-   컴포넌트 파일: `kebab-case` 사용 (예:`favorite-button.tsx` , `restaurant-card.tsx` )
-   기타 파일: `camelCase` 사용 (예: `useFavoriteToggle.ts` )
-   인덱스 파일: `index.ts` 사용

### 컴포넌트 이름 규칙

-   컴포넌트는 항상 명사형의 PascalCase로 명명 (예: `FavoriteButton`, `RestaurantCard`)
-   커스텀 훅은 항상 `use` 접두사로 시작 (예: `useFavoriteToggle`, `useFavoriteRestaurants`)
-   컨텍스트 제공자는 `Provider` 접미사 사용 (예: `AuthProvider`)

예시

```jsx
// src/features/ui/favorite-button.tsx

export const FavoriteButton = () => {
		...
}
```

# 폴더 우선 순위 및 임포트 룰

임포트는 다음 순서를 따릅니다:

1. 외부 라이브러리 (`react`, `axios` 등)
2. 내부 모듈 (상위 계층에서 하위 계층으로)
    - `/app`
    - `/pages`
    - `/widgets`
    - `/features`
    - `/entities`
    - `/shared`

경로 별칭(`@/`)을 사용하여 임포트합니다.

```jsx
// 올바른 예시
import { Layout } from '@/widgets/layout';
import { FavoriteButton } from '@/features/favorite/ui/favorite-button';

// 잘못된 예시
import { Layout } from '../../../widgets/layout';
```
