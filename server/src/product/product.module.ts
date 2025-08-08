import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UploadService } from 'src/upload/upload.service';

@Module({
  // imports: [UploadService],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
