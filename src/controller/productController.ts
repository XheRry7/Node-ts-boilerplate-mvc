import { Request, Response } from 'express';
import { product, deleteProduct, addProducts, update, getSingleProduct } from '../services/product_Service';
import { IProducts } from '../interfaces/products';
import { uploadImage } from '../s3';

enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface ApiResponse<T> {
  statusCode: HttpStatus;
  data?: T;
  message?: string;
}

export const getProducts = async (_req: Request, res: Response): Promise<Response<ApiResponse<IProducts[]>>> => {
  try {
    const productData = await product();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: productData,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

export const getProductByID = async (req: Request, res: Response): Promise<Response<ApiResponse<IProducts>>> => {
  const { id } = req.params;

  if (!id) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'ID is required in parameters',
    });
  }

  try {
    const productData = await getSingleProduct(id);

    if (!productData) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found',
      });
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: productData,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

export const createProduct = async (req: any, res: Response) => {
  if (!req.files?.length) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'No images found',
    });
  }

  try {
    await uploadImage(req.files);

    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const imagePaths: string[] = req.files.map((file: { originalname: string }) => `${basePath}${file.originalname}`);

    const productData: IProducts = {
      ...req.body,
      images: imagePaths,
    };

    const newProduct = await addProducts(productData);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: newProduct,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<Response<ApiResponse<void>>> => {
  const { id } = req.query;
  const data: IProducts = req.body;

  if (!id || Object.keys(data).length === 0) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'ID and update data are required',
    });
  }

  try {
    await update(id.toString(), data);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Data updated successfully',
    });
  } catch (error) {
    const err = error as Error;
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

export const delProduct = async (req: Request, res: Response): Promise<Response<ApiResponse<void>>> => {
  const { id } = req.query;

  if (!id) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'ID is required in parameters',
    });
  }

  try {
    await deleteProduct(id.toString());
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    const err = error as Error;
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
