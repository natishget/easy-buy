import { Injectable } from '@nestjs/common';
import cloudinary from './config/cloudinary'; // ✅ use correct path

@Injectable()
export class UploadService {
  async uploadToCloudinary(file: Express.Multer.File) {
    return await cloudinary.uploader.upload(file.path); // ✅ works now
  }
}
