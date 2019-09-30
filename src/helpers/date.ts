export const dateToString = (date: Date) => new Date(date).toISOString();

export const toDate = (date: string) => new Date(date);

export const compareDates = (a: Date, b: Date) => {
    const aModified = a.setHours(0, 0, 0, 0);
    const bModified = b.setHours(0, 0, 0, 0);

    if (aModified > bModified) {
        return 1;
    }
    if (aModified < bModified) {
        return -1;
    }

    return 0;
};
