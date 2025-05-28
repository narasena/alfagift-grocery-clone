'use client';
import * as React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import apiInstance from '@/services/apiInstance';
import { IProductCategory, IProductSubCategory } from '@/types/products/product.subcategory.type';
import { addProductSchemas } from '@/features/schemas/addProductSchemas';
import * as Yup from 'yup';
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { toast } from 'react-toastify';
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from 'react-icons/tb';
import { IAddProductField, ICloudinaryResult, IProductFormValues } from '@/types/products/product.type';

export default function AddProductPage() {
  const [productCategories, setProductCategories] = React.useState<IProductCategory[]>([]);
  const [productSubCategories, setProductSubCategories] = React.useState<IProductSubCategory[]>([]);
  const [uploadedImages, setUploadedImages] = React.useState<ICloudinaryResult[]>([]);
  const [imageShowing, setImageShowing] = React.useState<ICloudinaryResult | null>(null);
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
  const addProductFields: IAddProductField[] = [
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
        isMainImage: false,
      };
      setUploadedImages((prevImages) => {
        if (prevImages.length === 0) {
          return [{ ...newImage, isMainImage: true }];
        }
        return [...prevImages, newImage];
      });

      toast.success(`Image uploaded successfully!`);
    }
  };
  const handleImageClick = (image: ICloudinaryResult) => {
    setImageShowing(image);
  };
  const handleSetAsMainImage = () => {
    if (!imageShowing) return;
    
    setUploadedImages((prevImages) => {
      const selectedIndex = prevImages.findIndex(img => img.secure_url === imageShowing?.secure_url)
      if (selectedIndex === -1) return prevImages;
      const newImages = [...prevImages];
      const selectedImage = { ...newImages[selectedIndex], isMainImage: true }
      newImages.splice(selectedIndex, 1)
      return[selectedImage, ...newImages.map((img) => ({ ...img, isMainImage: false }))];
    })
  };
  const handleSwapImage = (index1: number, index2: number) => {
    setUploadedImages((prevImages) => {
      const newUpdloadedImages = [...prevImages];
      const temp = newUpdloadedImages[index1];
      newUpdloadedImages[index1] = newUpdloadedImages[index2];
      newUpdloadedImages[index2] = temp;
      if (index1 === 0 || index2 === 0) {
        return newUpdloadedImages.map((img, indx) => ({
          ...img,
          isMainImage: indx === 0,
        }));
      }
      return newUpdloadedImages;
    });
  };

  React.useEffect(() => {
    if (uploadedImages.length > 0) {
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
          } as IProductFormValues
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
            <label className='text-gray-700 w-full block mb-2 text-xl font-medium'>Product Images:</label>
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
                <button
                  className='my-4 px-4 py-2 bg-red-800 text-white font-semibold text-xl rounded-md'
                  onClick={handleSetAsMainImage}>
                  Set As Main Image
                </button>
              )}
              {uploadedImages.length > 0 && imageShowing && imageShowing.isMainImage === true && (
                <button className='my-4 px-4 py-2 bg-gray-700 text-white font-semibold text-xl rounded-md'>
                  Main Image
                </button>
              )}
            </div>
            <div className='flex justify-center gap-2'>
              {uploadedImages.map((image, index) => (
                <div key={index} className='relative'>
                  <div
                    className='size-18 border border-gray-400 overflow-hidden'
                    onClick={() => handleImageClick(image)}>
                    <CldImage width={72} height={72} src={image.secure_url} alt={`Uploaded Image ${index + 1}`} />
                    {index === 0 && (
                      <div className='absolute top-0 left-0 bg-red-600 text-white text-xs px-1'>Main</div>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-1 mt-1'>
                    <div className='col-start-1 flex-1'>
                      {index > 0 && (
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwapImage(index, index - 1);
                          }}
                          className='bg-gray-700 text-gray-200 w-full flex items-center justify-center text-2xl rounded-sm'>
                          <TbArrowBigLeftLinesFilled />
                        </button>
                      )}
                    </div>
                    <div className='col-start-2 flex-1'>
                      {index < uploadedImages.length - 1 && (
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwapImage(index, index + 1);
                          }}
                          className='bg-gray-200 text-gray-700 w-full flex items-center justify-center text-2xl rounded-sm'>
                          <TbArrowBigRightLinesFilled />
                        </button>
                      )}
                    </div>
                  </div>
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
