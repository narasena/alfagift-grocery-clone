import { useProductImageShowing } from '@/hooks/products/useProductImageShowing';
import { ICloudinaryResult } from '@/types/products/product.image.type';
import { IProductFormValues } from '@/types/products/product.type';
import apiInstance from '@/utils/api/apiInstance';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import * as React from 'react';
import { toast } from 'react-toastify';
import { setAsMainImage, swapImages } from '@/utils/products/product.image.helpers';

export const useProductImagesUpload = () => {

    const [uploadedImages, setUploadedImages] = React.useState<ICloudinaryResult[]>([]);
    const {imageShowing, setImageShowing, handleImageClick} = useProductImageShowing()
    const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
        if (result.info && typeof result.info === 'object' && 'public_id' in result.info && 'secure_url' in result.info) {
          const newImage = {
            public_id: result.info.public_id as string,
            secure_url: result.info.secure_url as string,
            isMainImage: false,
          };
          setUploadedImages((prevImages) => {
            if (prevImages.length === 0) {
              return setAsMainImage([newImage], newImage);
            }
            return setAsMainImage([...prevImages, newImage], newImage); 
          });
    
          toast.success(`Image uploaded successfully!`);
        }
      };
      const handleSetAsMainImage = () => {
        if (!imageShowing) return;
        setUploadedImages((prevImages) => 
          setAsMainImage(prevImages, imageShowing as ICloudinaryResult)
        );
      };
      const handleSwapImage = (index1: number, index2: number) => {
        setUploadedImages((prevImages) => {
          return swapImages(prevImages, index1, index2);
        });
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
      setUploadedImages,
      handleSwapImage,
      handleSetAsMainImage,
      handleImageUpload
    };
}