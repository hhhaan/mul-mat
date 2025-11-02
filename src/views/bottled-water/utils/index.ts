export const parseAndAverage = (valueStr: string | undefined | null): number | null => {
    if (valueStr === null || valueStr === undefined || typeof valueStr !== 'string') {
        return null;
    }

    const trimmedStr = valueStr.trim();

    if (trimmedStr.includes('~')) {
        const parts = trimmedStr.split('~').map((v) => parseFloat(v.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return (parts[0] + parts[1]) / 2;
        }
    } else {
        const num = parseFloat(trimmedStr);
        if (!isNaN(num)) {
            return num;
        }
    }

    return null;
};
