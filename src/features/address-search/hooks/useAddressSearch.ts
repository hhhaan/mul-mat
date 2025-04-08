import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAddressSuggestions } from '@/src/features/address-search/api';
import { AddressSuggestion } from '@/src/features/address-search/types';

interface SelectedAddress {
    idx: string;
    full_address: string;
}

export const useAddressSearch = () => {
    // 검색 관련 상태
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 상태 관리 개선을 위한 추가 플래그들
    const [justSelected, setJustSelected] = useState(false); // suggestion 선택 직후 상태

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionsRef = useRef<HTMLDivElement | null>(null);
    const preventFocusRef = useRef<boolean>(false); // useRef를 사용하여 포커스 이벤트 순서 문제 방지

    // 검색어 변경에 따른 자동완성 처리
    useEffect(() => {
        // 방금 선택했다면 API 호출 건너뛰기
        if (justSelected) {
            setJustSelected(false);
            return;
        }

        // 검색어가 비어있으면 추천 목록 초기화
        if (query.length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // 이전 타이머 취소
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // 디바운스 적용 (300ms)
        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                const results = await fetchAddressSuggestions(query);
                setSuggestions(results);
                // 포커스 상태인 경우만 결과 표시
                if (isSearchFocused && results.length > 0) {
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('자동완성 오류:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setIsLoading(false);
            }
        };

        debounceTimerRef.current = setTimeout(fetchSuggestions, 300);

        // 클린업 함수
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [query, isSearchFocused, justSelected]);

    // 외부 클릭 처리를 위한 이벤트 리스너
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 검색어 입력 처리
    const handleQueryChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setQuery(newValue);

            // 검색어가 변경되면 선택된 주소 초기화
            if (selectedAddress && newValue !== selectedAddress.full_address) {
                setSelectedAddress(null);
            }
        },
        [selectedAddress]
    );

    // 추천 항목 클릭 처리 - 완전히 재작성
    const handleSuggestionClick = useCallback((suggestion: AddressSuggestion) => {
        // 상태 업데이트 전에 플래그 설정
        preventFocusRef.current = true;
        setJustSelected(true);

        // 필요한 상태 업데이트
        setQuery(suggestion.data.full_address);
        setSelectedAddress(suggestion.data);
        setShowSuggestions(false);

        // 포커스 관련 핸들링
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // 지연 시간 후 플래그 초기화 (React 이벤트 시스템에서 이벤트 버블링이 모두 완료된 후)
        setTimeout(() => {
            preventFocusRef.current = false;
        }, 100);
    }, []);

    const handleFocus = useCallback(() => {
        // 제안 항목을 방금 클릭한 경우 포커스 이벤트 무시
        if (preventFocusRef.current) {
            return;
        }

        setIsSearchFocused(true);

        // 검색어가 있고 이미 로드된 제안이 있는 경우에만 제안 목록 표시
        if (query.trim() !== '' && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    }, [query, suggestions.length]);

    // 블러 처리
    const handleBlur = useCallback(() => {
        // 제안 항목을 방금 클릭한 경우 블러 이벤트 처리에서 제안 목록 닫기 방지
        if (preventFocusRef.current) {
            setIsSearchFocused(false);
            return;
        }

        setIsSearchFocused(false);

        // 약간의 지연 후 제안 목록 닫기 (클릭 이벤트가 먼저 처리되도록)
        setTimeout(() => {
            if (!preventFocusRef.current) {
                setShowSuggestions(false);
            }
        }, 150);
    }, []);

    // 검색 초기화
    const resetSearch = useCallback(() => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedAddress(null);
        setShowResult(false);
        preventFocusRef.current = false;
        setJustSelected(false);
    }, []);

    return {
        // 상태
        query,
        suggestions,
        showSuggestions,
        isSearchFocused,
        selectedAddress,
        showResult,
        suggestionsRef,
        isLoading,

        // 이벤트 핸들러
        handleQueryChange,
        handleSuggestionClick,
        // handleSearch,
        handleFocus,
        handleBlur,
        // handleKeyDown,
        resetSearch,

        // setter 함수들 (필요한 경우에만 노출)
        setQuery,
        setSelectedAddress,
        setShowResult,
    };
};
