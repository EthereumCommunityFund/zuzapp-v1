
export const formatTimestamp = (date: number) => {
    if (typeof (date) !== "number") return;
    return new Date(date).toISOString();
}