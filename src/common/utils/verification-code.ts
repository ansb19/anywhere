
/**
 * email, sms 인증에 사용
 * @returns 6자리 랜덤숫자 리턴
 */
export function generateVerificationCode(): string {
    //여섯자리 랜덤 숫자
    const cert_number: string = Math.floor(Math.random() * 900000 + 100000).toString();
    return cert_number;

}