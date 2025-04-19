// export function estimateSOCL(hardness: number, ratio = 3) {
//     const x = hardness / (2.5 + 4.1 / ratio);
//     return {
//         estimatedCalcium: x.toFixed(1),
//         estimatedMagnesium: (x / ratio).toFixed(1),
//     };
// }

/**
 * 물의 경도를 기반으로 칼슘과 마그네슘 함량을 추정합니다.
 * @param hardness 총 경도 (mg/L as CaCO₃)
 * @returns 추정된 칼슘과 마그네슘 농도 (mg/L)
 */
export function estimateSOCA(hardness: number) {
    const ratio = 3;
    // 칼슘과 마그네슘의 당량 계수
    const Ca_FACTOR = 2.497;
    const Mg_FACTOR = 4.118;

    // 총 경도 방정식: hardness = Ca_FACTOR * [Ca²⁺] + Mg_FACTOR * [Mg²⁺]
    // ratio = [Ca²⁺] / [Mg²⁺] 이므로 [Mg²⁺] = [Ca²⁺] / ratio

    // 방정식 풀이:
    // hardness = Ca_FACTOR * [Ca²⁺] + Mg_FACTOR * ([Ca²⁺] / ratio)
    // hardness = [Ca²⁺] * (Ca_FACTOR + Mg_FACTOR / ratio)
    // [Ca²⁺] = hardness / (Ca_FACTOR + Mg_FACTOR / ratio)

    const calciumConcentration = hardness / (Ca_FACTOR + Mg_FACTOR / ratio);
    const magnesiumConcentration = calciumConcentration / ratio;

    return {
        estimatedCalcium: calciumConcentration.toFixed(1),
        estimatedMagnesium: magnesiumConcentration.toFixed(1),
    };
}
