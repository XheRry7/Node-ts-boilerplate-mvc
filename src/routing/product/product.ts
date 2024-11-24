import { AsyncRouter } from 'express-async-router';
import { withAuth } from '../../middleware/withAuth';
import {
  getProducts,
  createProduct,
  updateProduct,
  delProduct,
  getProductByID,
} from '../../controller/productController';
import multer from 'multer';
import { storage } from '../../middleware/imageuploader/imageuploader';

const upload = multer({ storage: storage });

const router = AsyncRouter();

router.get('/getProduct', withAuth, getProducts);
router.post('/createProduct', withAuth, upload.array('pictures', 10), createProduct);
router.put('/updateProduct', withAuth, upload.array('pictures', 10), updateProduct);
router.get('/getProductByID/:id', withAuth, getProductByID);
router.delete('/deleteProduct', withAuth, delProduct);

export default router;
