"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    async execute(req, res, action) {
        try {
            const result = await action();
            res.status(result.status).json({
                message: result.message,
                data: result.data
            });
        }
        catch (error) {
            console.log("요청 에러 발생: " + error);
            res.status(500).json({ message: 'Controller 서버 에러: ', error });
        }
    }
}
exports.default = Controller;
