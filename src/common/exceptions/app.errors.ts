
// ValidationError: 입력값 검증 실패
// NotFoundError: 리소스가 존재하지 않음
// UnauthorizedError: 인증 실패
// ForbiddenError: 권한 부족
// DatabaseError: 데이터베이스 관련 에러
// ExternalApiError: 외부 API 호출 실패

export class AppError extends Error {
    public status_code: number = 500;
    public cause?: Error;

    constructor(message: string, status_code: number, cause?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.status_code = status_code;
        this.cause = cause;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class MissingEnvironmentVariableError extends AppError {
    constructor(variableName: string, cause?: Error) {
        super(`환경 변수 "${variableName}"을 찾을 수 없습니다.`, 404, cause);
    }
}

export class InvalidEnvironmentVariableError extends AppError {
    constructor(variableName: string, expectedType: string, cause?: Error) {
        super(`환경 변수 "${variableName}"은 ${expectedType}타입이여야합니다.`, 404, cause);
    }
}

export class ValidationError extends AppError {
    constructor(message = "입력값 검증 실패", cause?: Error) {
        super(message, 400, cause);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "리소스가 존재하지 않음", cause?: Error) {
        super(message, 404, cause);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "인증 실패", cause?: Error) {
        super(message, 401, cause);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "권한 부족", cause?: Error) {
        super(message, 403, cause);
    }
}

export class DatabaseError extends AppError {
    constructor(message = "데이터베이스 관련 에러", cause?: Error) {
        super(message, 500, cause);
    }
}

export class ExternalApiError extends AppError {
    constructor(message = "외부 api 호출 실패", cause?: Error) {
        super(message, 502, cause);
    } 
}

export class TransactionError extends AppError {
    constructor(message = "트랜젝션 에러 발생", cause?: Error) {
        super(message, 500, cause);
    }
}
