import { ICloudinaryResult, IProductImage } from "../../types/product.type";

export class EditProductImageService {
  private existingImages: IProductImage[];
  private editedImages: IProductImage[];
  private newUploads?: ICloudinaryResult[];

  constructor(existingImages: IProductImage[], editedImages: IProductImage[], newUploads?: ICloudinaryResult[]) {
    this.existingImages = existingImages;
    this.editedImages = editedImages;
    this.newUploads = newUploads;
  }

  // Determine which images to delete (existing images that are not in edited images)
  getImagesToDelete(): IProductImage[] {
    return this.existingImages.filter((existingImage) => {
      return !this.editedImages.some((editedImage) => editedImage.id === existingImage.id);
    });
  }

  // Determine if main image has changed
  getMainImageChange(): { oldMain?: IProductImage; newMain?: IProductImage } {
    const oldMain = this.existingImages.find((img) => img.isMainImage === true);
    const newMain = this.editedImages.find((img) => img.isMainImage === true);
    if ((oldMain && !newMain) || (newMain && oldMain?.cldPublicId !== newMain.cldPublicId)) {
      return { oldMain, newMain };
    }
    return {};
  }

  // Check if order changed by comparing positions
  isOrderChanged(): boolean {
    if (this.existingImages.length !== this.editedImages.length) return true;
    for (let i = 0; i < this.editedImages.length; i++) {
      if (this.existingImages[i].cldPublicId !== this.editedImages[i].cldPublicId) return true;
    }
    return false;
  }

  getNewUploads(): ICloudinaryResult[] {
    return this.newUploads || [];
  }

  get mainImageFromNewUploads() {
    return this.newUploads?.find((img) => (img as ICloudinaryResult).isMainImage);
  }
}
