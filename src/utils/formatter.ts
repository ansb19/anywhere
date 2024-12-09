
// 휴대폰 "+82 10-2563-8995" -> 01025638995
export function formatPhoneNumber(phone: string): string {
    return phone.replace(/^\+82\s?/, "0").replace(/[-\s]/g, "");
}
