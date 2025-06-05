import { ICloudinaryResult } from '@/types/products/product.image.type';
import { IProductFormValues } from '@/types/products/product.type';
import apiInstance from '@/utils/api/apiInstance';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import * as React from 'react';
import { toast } from 'react-toastify';

export const useProductImagesUpload = () => {
    const [uploadedImages, setUploadedImages] = React.useState<ICloudinaryResult[]>([]);
    const [imageShowing, setImageShowing] = React.useState<ICloudinaryResult | null>(null);
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
          const selectedIndex = prevImages.findIndex((img) => img.secure_url === imageShowing?.secure_url);
          if (selectedIndex === -1) return prevImages;
          const newImages = [...prevImages];
          const selectedImage = { ...newImages[selectedIndex], isMainImage: true };
          newImages.splice(selectedIndex, 1);
          return [selectedImage, ...newImages.map((img) => ({ ...img, isMainImage: false }))];
        });
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
      const handleCreateProduct = async (values: Partial<IProductFormValues>, resetForm: () => void) => {
        try {
          const createProductResponse = await apiInstance.post('/product/create', {
            ...values,
            productSubCategoryId: Number(values.productSubCategoryId),
            brandId: values.brandId || null,
            description: values.description || null,
            sku: values.sku || null,
            barcode: values.barcode || null,
            weight: Number(values.weight) || null,
            dimensions: values.dimensions || null,
            images: uploadedImages,
          });
          console.log('Create Product Response:', createProductResponse.data);
          toast.success('Product created successfully!');
          setUploadedImages([]);
          setImageShowing(null);
          resetForm();
        } catch (error) {
          console.error('Error creating product:', error);
          toast.error('Failed to create product. Please try again.');
        }
      };
    
      React.useEffect(() => {
        if (uploadedImages.length > 0) {
          setImageShowing(uploadedImages[0]);
        }
        console.log('Uploaded Images:', uploadedImages);
      }, [uploadedImages]);


    return {
      imageShowing,
      handleImageClick,
      uploadedImages,
      handleSwapImage,
      handleSetAsMainImage,
      handleImageUpload,
      handleCreateProduct,
    };
}