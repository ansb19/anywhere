

/**
 * 휴대폰 형식 포맷
 * @param phone +82 10-2563-8995
 * @returns 01025638995
 */
export function formatPhoneNumber(phone: string): string {
    return phone.replace(/^\+82\s?/, "0").replace(/[-\s]/g, "");
}

/**
 * 날짜에 특정 시간 추가
 * @param date 입력할 날짜
 * @param months 달
 * @param days 일
 * @param hours 시간
 * @param minutes 분
 * @param seconds 초
 * @returns 추가 입력된 날짜짜
 */
export function AddDate(date: Date, months: number = 0, days: number = 0,
    hours: number = 0, minutes: number = 0, seconds: number = 0): Date {

    const newDate = new Date(date);
    // 월 추가
    if (months) {
        newDate.setMonth(newDate.getMonth() + months);
    }

    // 일 추가
    if (days) {
        newDate.setDate(newDate.getDate() + days);
    }

    // 시간 추가
    if (hours) {
        newDate.setHours(newDate.getHours() + hours);
    }

    // 분 추가
    if (minutes) {
        newDate.setMinutes(newDate.getMinutes() + minutes);
    }

    // 초 추가
    if (seconds) {
        newDate.setSeconds(newDate.getSeconds() + seconds);
    }

    return newDate;
}