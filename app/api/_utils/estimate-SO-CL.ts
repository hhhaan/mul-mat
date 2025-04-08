export function estimateSOCL(hardness: number, ratio = 3) {
    const x = hardness / (2.5 + 4.1 / ratio);
    return {
        estimatedCalcium: x.toFixed(1),
        estimatedMagnesium: (x / ratio).toFixed(1),
    };
}
