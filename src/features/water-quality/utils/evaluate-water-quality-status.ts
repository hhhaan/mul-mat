// 수질 상태 평가 함수
export const evaluateWaterQualityStatus = (value: number | undefined, min?: number, max?: number) => {
    let status = '확인 필요';
    let bgColor = 'bg-gray-100';
    let color = 'text-gray-800';
    let forCoffee = '정보가 부족합니다';

    if (value !== undefined && value !== null) {
        if (min !== undefined && max !== undefined) {
            if (value >= min && value <= max) {
                status = '적정';
                bgColor = 'bg-green-100';
                color = 'text-green-800';
                forCoffee = '적합한 수준입니다';
            } else {
                status = '부적정';
                bgColor = 'bg-red-100';
                color = 'text-red-800';
                forCoffee = '부적합한 수준입니다';
            }
        } else if (value > 0) {
            status = '적정';
            bgColor = 'bg-green-100';
            color = 'text-green-800';
            forCoffee = '적합한 수준입니다';
        } else {
            status = '부적정';
            bgColor = 'bg-red-100';
            color = 'text-red-800';
            forCoffee = '부적합한 수준입니다';
        }
    }

    return {
        status,
        bgColor,
        color,
        forCoffee,
    };
};
