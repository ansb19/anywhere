import { Request, Response, NextFunction } from "express";
import { AppError } from "./app.errors";


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

    console.error(`[Error]: ${err.message}`);

    if (err instanceof AppError) {
        // 사용자 정의 에러 처리
        res.status(err.status_code).json({
            error: {
                name: err.name,
                message: err.message,
                cause: err.cause || null,
            },
        });
    }

    // 예상치 못한 에러 처리
    res.status(500).json({
        error: {
            name: "InternalServerError",
            message: "서버 내부 오류가 발생했습니다.",
        },
    });
};
