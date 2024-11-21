import { Request, Response } from "express";

abstract class Controller { // try catch를 일일히 안하고 코드가 간결해짐
    protected async execute(req: Request, res: Response, action: Function): Promise<void> {
        try {
            const result = await action();
            res.status(result.status).json({
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.log("요청 에러 발생" + error);
            res.status(500).json({ message: 'Controller 서버 에러: ', error })
        }
    }
}
export default Controller;