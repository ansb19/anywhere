import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';

import { User } from '../entity/User';

export const create_user = async (req: Request, res: Response) => {
    try {
        const user_repository = AppDataSource.getRepository(User);
    } catch (error) {

    }
}