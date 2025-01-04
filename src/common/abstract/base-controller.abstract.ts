import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

@Service()
abstract class BaseController { // try catch를 일일히 안하고 코드가 간결해짐
    protected async execute(req: Request, res: Response, next: NextFunction, action: Function ): Promise<void> {
        try {
            const result = await action();
            res.status(result.status).json({
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.error("요청 에러 발생: ", error);
            next(error);
        }
    }
}

export default BaseController;