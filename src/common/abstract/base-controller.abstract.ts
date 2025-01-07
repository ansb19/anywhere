import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { logger } from "../utils/logger";

@Service()
abstract class BaseController { // try catch를 일일히 안하고 코드가 간결해짐

    /**
     * 공통 요청 처리 메서드
     * @param req 요청 객체
     * @param res 응답 객체
     * @param next 다음 미들웨어
     * @param action 비즈니스 로직 함수
     */
    protected async execute(req: Request, res: Response, next: NextFunction, action: Function ): Promise<void> {
        const { method, originalUrl, params, body, query } = req;
        
        logger.info(`Incoming request: ${method} ${originalUrl}`);
        logger.debug(`Request details: params: ${JSON.stringify(params)}, body: ${JSON.stringify(body)}, query: ${JSON.stringify(query)}`);
        
        try {
            const result = await action();

            logger.info(`Request successfully processed: ${method} ${originalUrl}`);
            res.status(result.status).json({
                message: result.message,
                data: result.data
            });
        } catch (error) {
            next(error);
        }
    }
}

export default BaseController;