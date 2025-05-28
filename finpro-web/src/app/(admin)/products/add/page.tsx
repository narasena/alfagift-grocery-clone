'use client';
import * as React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import apiInstance from '@/services/apiInstance';
import { IProductCategory, IProductSubCategory } from '@/types/product.category/product.subcategory.type';
import { addProductSchemas } from '@/features/schemas/addProductSchemas';
import * as Yup from 'yup';
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { toast } from 'react-toastify';

type TAddProductField = {
  name: string;
  title: string;
  type: string;
  options?: IProductSubCategory[];
};

type TProductFormValues = {
  name: string;
  price: number;
  productCategorySubId: number;
  brandId?: string;
  description?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  images: TCloudinaryResult[];
};

type TCloudinaryResult = {
  public_id: string;
  secure_url: string;
  isMainImage: boolean;
};
export default function AddProductPage() {
  const [productCategories, setProductCategories] = React.useState<IProductCategory[]>([]);
  const [productSubCategories, setProductSubCategories] = React.useState<IProductSubCategory[]>([]);
  const [uploadedImages, setUploadedImages] = React.useState<TCloudinaryResult[]>([]);
  const [imageShowing, setImageShowing] = React.useState<TCloudinaryResult|null>(null);
  const handleGetProductCategories = async () => {
    try {
      const categoryResponse = await apiInstance.get('/product-category');
      const subCategoryResponse = await apiInstance.get('/product-category/subcategories');
      setProductCategories(categoryResponse.data.productCategories);
      setProductSubCategories(subCategoryResponse.data.productSubCategories);
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  };
  const addProductFields: TAddProductField[] = [
    { name: 'name', title: 'Product Name', type: 'text' },
    { name: 'price', title: 'Product Price', type: 'number' },
    { name: 'productCategorySubId', title: 'Product Sub Category', type: 'select', options: productSubCategories },
    { name: 'brandId', title: 'Brand', type: 'select', options: [] },
    { name: 'description', title: 'Product Description', type: 'text' },
    { name: 'sku', title: 'SKU', type: 'text' },
    { name: 'barcode', title: 'Barcode', type: 'text' },
    { name: 'weight', title: 'Weight', type: 'number' },
    { name: 'dimensions', title: 'Dimensions', type: 'text' }, // This should be populated with categories
  ];
  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === 'object' && 'public_id' in result.info && 'secure_url' in result.info) {
      const newImage = {
        public_id: result.info.public_id as string,
        secure_url: result.info.secure_url as string,
        isMainImage: false
      };
      setUploadedImages((prevImages) => {
        if (prevImages.length === 0) {
          return [{ ...newImage, isMainImage: true }];
        }
        return [...prevImages, newImage]
      });
      
      toast.success(`Image uploaded successfully!`);
    }
  };
  const handleImageClick = (image: TCloudinaryResult) => {
    setImageShowing(image);
  };
  const handleSetAsMainImage = () => {
    setUploadedImages(prevImages => prevImages.map(image =>
      image.secure_url === imageShowing?.secure_url
        ? { ...image, isMainImage: true }
        : { ...image, isMainImage: false }
    ))
  }

  React.useEffect(() => {
    if(uploadedImages.length > 0) {
      setImageShowing(uploadedImages[0]);
    }
    console.log('Uploaded Images:', uploadedImages);
   }, [uploadedImages]);
  React.useEffect(() => {
    handleGetProductCategories();
  }, []);

  
  return (
    <div>
      <Formik
        initialValues={
          {
            name: '',
            price: 0,
            productCategorySubId: 0,
            brandId: '',
            description: '',
            sku: '',
            barcode: '',
            weight: 0,
            dimensions: '',
            images: [],
          } as TProductFormValues
        }
        validationSchema={addProductSchemas}
        onSubmit={(values, { setSubmitting }) => {
          console.log('Form Values:', values);
          console.log('Is Valid:', addProductSchemas.isValidSync(values));

          try {
            addProductSchemas.validateSync(values, { abortEarly: false });
            console.log('Validation passed!');
            setSubmitting(false);
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              console.log('Validation Errors:', err.errors);        
            }
            setSubmitting(false);
          }
        }}>
        <Form>
          <div className='px-3 w-full flex flex-col justify-center items-center'>
            <label htmlFor='' className='text-gray-700 w-full block mb-2 text-xl font-medium'>
              Product Images:
            </label>
            <div className='size-72 border border-gray-400 rounded-md my-3'>
              {imageShowing && (
                <CldImage
                  width={288}
                  height={288}
                  src={imageShowing.secure_url}
                  alt='Selected Product Image'
                  className='w-full h-full object-cover'
                />
              )}
            </div>
            <div className='flex justify-center'>
              {uploadedImages.length > 0 && imageShowing && imageShowing.isMainImage === false && (
                <button className='my-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md'>
                  Set As Main Image
                </button>
              )}
              {uploadedImages.length > 0 && imageShowing && imageShowing.isMainImage === true && (
                <button className='my-4 px-4 py-2 bg-gray-700 text-white font-semibold text-xl rounded-md'>
                  Main Image
                </button>
              )}
            </div>
            <div className='grid grid-cols-5 gap-2'>
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className='size-18 border border-gray-400 overflow-hidden'
                  onClick={() => handleImageClick(image)}>
                  <CldImage width={72} height={72} src={image.secure_url} alt={`Uploaded Image ${index + 1}`} />
                </div>
              ))}
            </div>
            <CldUploadWidget
              uploadPreset='products-image'
              signatureEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/signed-upload`}
              onSuccess={handleImageUpload}
              options={{
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: 5,
              }}>
              {({ open }) => (
                <button
                  type='button'
                  className='mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md'
                  onClick={() => open?.()}>
                  Upload Images
                </button>
              )}
            </CldUploadWidget>
          </div>
          <div>
            {addProductFields.map((field, index) => (
              <div
                key={index}
                className={
                  'text-gray-700 px-2 w-full ' + (index > 4 ? 'grid grid-cols-[30%_1fr] gap-x-4 items-center my-2' : '')
                }>
                <label htmlFor={field.name} className='block mb-2 text-xl font-medium'>
                  {field.title}
                </label>
                {field.type === 'select' && field.options ? (
                  <Field
                    name={field.name}
                    id={field.name}
                    as='select'
                    className='w-full bg-white border border-gray-300 rounded-md p-2'>
                    {field.name === 'productCategorySubId' &&
                      productCategories.map((category) => (
                        <optgroup key={category.id} label={category.name}>
                          {productSubCategories
                            .filter((subCategory) => subCategory.productCategoryId === category.id)
                            .map((subCategory) => (
                              <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                  </Field>
                ) : (
                  <Field
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    className='w-full bg-white border border-gray-300 rounded-md p-2'
                  />
                )}
                <ErrorMessage name={field.name} component='div' className='text-sm text-red-600' />
              </div>
            ))}
          </div>
          <div className='px-3 w-full'>
            <button
              type='submit'
              className='w-full mt-4 px-4 py-2 bg-red-800 text-white font-semibold text-2xl rounded-md '>
              Add Product
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
