import common from "@tools/common";

export const LastSeveralDays = function (days, endDate = 0) {
    const start = new Date();
    const end = new Date();
    const startOffset = endDate + days - 1;
    start.setTime(start.getTime() - 3600 * 1000 * 24 * startOffset);
    end.setTime(end.getTime() - 3600 * 1000 * 24 * endDate);
    return [start, end];
};

export const CurWeek = function () {
    const end = new Date();
    const start = new Date();
    const startOffset = end.getDay() > 0 ? end.getDay() - 1 : 6;
    start.setTime(start.getTime() - 3600 * 1000 * 24 * startOffset);
    return [start, end];
};

export const LastWeek = function () {
    const end = new Date();
    const start = new Date();
    const startOffset = end.getDay();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * (startOffset + 6));
    end.setTime(end.getTime() - 3600 * 1000 * 24 * startOffset);
    return [start, end];
};

export const CurMonth = function () {
    const end = new Date();
    const start = new Date();
    const startOffset = end.getDate() - 1;
    start.setTime(start.getTime() - 3600 * 1000 * 24 * startOffset);
    return [start, end];
};

export const LastMonth = function () {
    const end = new Date();
    const startOffset = end.getDate();
    const year = end.getFullYear() - (end.getMonth() > 0 ? 0 : 1);
    const month = (end.getMonth() + 11) % 12;
    const start = new Date(year, month, 1);
    end.setTime(end.getTime() - 3600 * 1000 * 24 * startOffset);
    return [start, end];
};

export const AllDate = {
    "yesterday": {
        label: "昨日消耗",
        legend: "前日环比",
        handler: LastSeveralDays,
        params: [1, 1]
    },
    "lastSeven": {
        label: "近七日消耗",
        legend: "上一周期环比",
        handler: LastSeveralDays,
        params: [7, 1]
    },
    "thisWeek": {
        label: "本周消耗",
        legend: "上一周环比",
        handler: CurWeek
    },
    "thisMonth": {
        label: "本月消耗",
        legend: "上月环比",
        handler: CurMonth
    },
}

export const GetCurDates = function (date) {
    const obj = AllDate[date];
    const params = obj.params ? obj.params : [];
    let dates = obj.handler(...params);
    dates = dates.map(item => common.getNewDay(item));
    return dates;
};
