// useAddressSearch.js - 주소 검색 관련 기능만 담당
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAddressData } from '../hooks';
import { Address } from '../types';

export const useAddressSearch = () => {
    // 검색 관련 상태
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showResult, setShowResult] = useState(false);

    const suggestionsRef = useRef<HTMLDivElement | null>(null);
    const { loading: dataLoading, getSuggestion, getMatchingAddress } = useAddressData();

    /**
     * 검색어 변경 시 추천 목록 업데이트
     */
    const handleSearchChange = useCallback(
        (query: string) => {
            setQuery(query);

            if (query.trim() === '') {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            const filteredSuggestions = getSuggestion(query);
            setSuggestions(filteredSuggestions);
            setShowSuggestions(filteredSuggestions.length > 0);
        },
        [getSuggestion]
    );

    /**
     * 추천 항목 클릭 시 처리
     * todo 여기서 정수장 받을 필요있는지 생각해보기
     */
    const handleSuggestionClick = useCallback((suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
    }, []);

    /**
     * 검색 버튼 클릭 시 실행되는 검색 함수
     */
    const handleSearch = useCallback(() => {
        if (query.trim() === '') return;

        // 단일 결과 가져오기
        const matchingRow = getMatchingAddress(query);

        if (!matchingRow) {
            setSelectedAddress(null);
            setShowResult(true);
            console.log('일치하는 데이터가 없습니다.');
            return;
        }

        console.log('검색 결과:', matchingRow);
        setSelectedAddress(matchingRow);
        setShowResult(true);
    }, [query, getMatchingAddress]);

    /**
     * 외부 클릭 이벤트 핸들러
     */
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    }, []);

    // 외부 클릭 이벤트 리스너 설정
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleFocus = useCallback(() => {
        setIsSearchFocused(true);
        if (query.trim() !== '' && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    }, [query, suggestions]);

    const handleBlur = useCallback(() => {
        setIsSearchFocused(false);
    }, []);

    const resetSearch = useCallback(() => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedAddress(null);
        setShowResult(false);
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

        // 로딩 상태
        isLoading: dataLoading,

        // 이벤트 핸들러
        handleSearchChange,
        handleSuggestionClick,
        handleSearch,
        handleFocus,
        handleBlur,
        resetSearch,
    };
};
