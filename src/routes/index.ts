import { Router } from "express";
import userRoutes from './user';
import placeRoutes from './place';
import favoriteRoutes from './favorite';
import reviewRoutes from './review';
import authRouters from './auth';

//최상위 라우터로써 루트 라우터인 '/'

 const router = Router();

router.use('/user', userRoutes);
router.use('/place', placeRoutes);
router.use('/favorite', favoriteRoutes);
router.use('/review', reviewRoutes);
router.use('/auth', authRouters);

export default router;