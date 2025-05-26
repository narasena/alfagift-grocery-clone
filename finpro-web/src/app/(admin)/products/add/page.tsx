'use client';
import * as React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import apiInstance from '@/services/apiInstance';
import { IProductCategory, IProductSubCategory } from '@/types/product.category/product.subcategory.type';

type TAddProductField = {
  name: string;
  title: string;
  type: string;
  options?: IProductSubCategory[];
};

type TProductFormValues = {
  name: string
  price: number;
  productCategorySubId: number;
  brandId?: number;
  description?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string; 
}
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
        initialValues={{
          name: '',
          price: 0,
          productCategorySubId: 0,
          brandId: undefined,
          description: '',
          sku: '',
          barcode: '',
          weight: undefined,
          dimensions: '',
        } as TProductFormValues}
        onSubmit={() => console.log('Form submitted')}>
        <Form>
          <div>
            {addProductFields.map((field, index) => (
              <div key={index} className='text-gray-700 px-2 w-full'>
                <label htmlFor={field.name} className='block mb-2 text-2xl font-medium'>
                  {field.title}
                </label>
                {field.type === 'select' && field.options ? (
                  <Field
                    name={field.name}
                    id={field.name}
                    as='select'
                    className='w-full bg-white border border-gray-300 rounded-md p-2'>
                    {productCategories.map((category) => (
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
        </Form>
      </Formik>
    </div>
  );
}
