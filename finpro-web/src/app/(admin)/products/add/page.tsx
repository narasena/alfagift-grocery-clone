'use client'
import * as React from 'react';
import { Field, Form, Formik } from 'formik';
import apiInstance from '@/services/apiInstance';

export default function AddProductPage() {
  const [productCategories, setProductCategories] = React.useState([]);
  const handleGetProductCategories = async () => {
    try {
      const response = await apiInstance.get('/product-category/subcategories')
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching product categories:', error);
      
    }
  }
  const addProductFields = [
    { name: 'name', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'productCategorySubId', type:'select', options: productCategories}, // This should be populated with categories
  ]
  React.useEffect(() => {
    handleGetProductCategories();
  }, []);
  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          price: 0,
          productCategorySubId: 0
        }}
        onSubmit={()=> console.log('Form submitted')}
      >
        <Form>
          <div>
            {/* {addProductFields.map((field, index) => (
              <div key={index}>
                <label htmlFor={field.name}>{field.name}</label>
                {field.type === 'select' ? (
                  <Field name={field.name} id={field.name} as='select'>
                    {field.options!.map((option, optionIndex) => (
                      <option key={optionIndex} value={option.value}>{option.label}</option>
                    ))}
                  </Field>
                ) : (
                  <Field type={field.type} name={field.name} id={field.name} />
                )}
              </div>
            ))} */}
          </div>
        </Form>

      </Formik>
    </div>
  );
}
