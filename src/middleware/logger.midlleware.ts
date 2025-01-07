// src/middleware/logger.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "@/common/utils/logger";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const message = `${method} ${url}`;

    logger.info(message);

    res.on("finish", () => {
        const { statusCode } = res;
        logger.info(`Response: ${statusCode} ${url}`);
    });

    next();
};
