import dayjs from "dayjs";

export const FORMAT_DATE = "MM/DD/YYYY";

export const dateRangeValidate = (dateRange: any) => {
    if(!dateRange) return undefined;
    const startDate = dayjs(dateRange[0], FORMAT_DATE).toDate();
    const endDate = dayjs(dateRange[1], FORMAT_DATE).toDate();

    return [startDate, endDate]
}