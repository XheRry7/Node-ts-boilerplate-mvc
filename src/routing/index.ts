import { AsyncRouter } from 'express-async-router';
import userRoutes from './user/userRoutes';
import productRoutes from './product/product';

const router = AsyncRouter();

router.use('/user', userRoutes);
router.use('/product', productRoutes);

export default router;
