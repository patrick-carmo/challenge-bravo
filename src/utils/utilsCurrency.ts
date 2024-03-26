function formatNumber(value: number): number {
    const index = value.toString().search("[1-9]");
    const formatted = value.toFixed(index === -1 ? 0 : index + 4);
    return Number(formatted);
}

export const utilsCurrency = {
    formatNumber,
};
