export const YIELD_THRESHOLDS = {
    LOW: 18,
    HIGH: 22,
};

export const STATUS_MESSAGES = {
    LOW: {
        status: 'low' as const,
        description: '추출이 덜 된 상태입니다. 더 강한 풍미를 원한다면 추출 시간을 늘려보세요.',
        recommendation: '더 곱게 분쇄하거나, 추출 시간을 늘려보세요. 원두 대비 물의 온도를 조금 높여볼 수도 있습니다.',
    },
    HIGH: {
        status: 'high' as const,
        description: '과추출 상태입니다. 쓴맛이 강할 수 있습니다.',
        recommendation: '더 굵게 분쇄하거나, 추출 시간을 줄여보세요. 물의 온도를 조금 낮추는 것도 도움이 됩니다.',
    },
    OPTIMAL: {
        status: 'optimal' as const,
        description: 'SCA 권장 수율 범위 내에 있습니다.',
        recommendation:
            '현재 추출 방식이 좋은 결과를 내고 있습니다. 미세한 조정을 원한다면, 취향에 따라 위해 추출 온도를 1-2°C 조절해 보세요.',
    },
};
