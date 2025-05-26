'use client';
import * as React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import apiInstance from '@/services/apiInstance';
import { IProductCategory, IProductSubCategory } from '@/types/product.category/product.subcategory.type';
import { addProductSchemas } from '@/features/schemas/addProductSchemas';
import * as Yup from 'yup';


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
  brandId?: number;
  description?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
};
export default function AddProductPage() {
  const [productCategories, setProductCategories] = React.useState<IProductCategory[]>([]);
  const [productSubCategories, setProductSubCategories] = React.useState<IProductSubCategory[]>([]);
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
            brandId: 0,
            description: '',
            sku: '',
            barcode: '',
            weight: 0,
            dimensions: '',
          } as TProductFormValues
        }
        validationSchema={addProductSchemas}
        onSubmit={(values, { setSubmitting }) => {
          console.log('Form Values:', values);
          console.log('Is Valid:', addProductSchemas.isValidSync(values));

          try {
            // Manually validate with Yup
            addProductSchemas.validateSync(values, { abortEarly: false });
            console.log('Validation passed!');

            // Continue with form submission
            // apiInstance.post('/products', values)...

            setSubmitting(false);
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              console.log('Validation Errors:', err.errors);
              // You can also set errors manually if needed
              // const errorMessages = {};
              // err.inner.forEach(e => { errorMessages[e.path] = e.message; });
              // setErrors(errorMessages);
            }
            setSubmitting(false);
          }
        }}>
        <Form>
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

// Prevent Next.js from trying to prerender this page during build
export const dynamic = 'force-dynamic';