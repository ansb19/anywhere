export const SESSION_CONFIG = {
    email: { prefix: "email-session", ttl: 60 * 10 }, // 10분
    sms: { prefix: "sms-session", ttl: 60 * 5 },    // 5분
    login_web: { prefix: "login-session", ttl: 60 * 60 }, // 60분
    login_app: { prefix: "login-session", ttl: 60 * 60 * 24 * 180 }, // 180일
};

export enum SESSION_TYPE {
    EMAIL = "email",
    SMS = "sms",
    LOGIN_WEB = "login_web",
    LOGIN_APP = "login_app"
}

