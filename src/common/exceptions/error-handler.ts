import { Request, Response, NextFunction } from "express";
import { AppError } from "./app.errors";
import { logger } from "../utils/logger";


export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // 이미 응답이 전송된 경우 처리 중단
    if (res.headersSent) {
        return next(err);
    }

    // 요청 정보와 에러 메시지 로깅
    logger.error(`[Error]: ${err.message}`, {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    // 사용자 정의 에러 처리
    if (err instanceof AppError) {
        logger.warn(`[AppError]: ${err.name} - ${err.message}`, {
            cause: err.cause || "No cause provided",
        });

        res.status(err.status_code).json({
            error: {
                name: err.name,
                message: err.message,
                cause: err.cause || null,
            },
        });
        return;
    }

    // 예상치 못한 에러 처리

    logger.error("[InternalServerError]: Unexpected error occurred", err);
    
    res.status(500).json({
        error: {
            name: "InternalServerError",
            message: "서버 내부 오류가 발생했습니다.",
        },
    });
};
