import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService,
    //  readonly upload: UploadService
  ) { }

  // async create(file: Express.Multer.File, createProductDto: CreateProductDto) {
  async create(createProductDto: CreateProductDto) {

    // const uploaded = await this.upload.uploadToCloudinary(file);
    // console.log("file upload response", uploaded)
    const product = await this.prisma.product.create({
      data: {
        title: createProductDto.title,
        quantity: createProductDto.quantity,
        description: createProductDto.description || "",
        price: createProductDto.price,
        category: createProductDto.category || "",
        sellerId: createProductDto.sellerId,
        // ...createProductDto,
        // imageUrl: uploaded.secure_url
      }
    })
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      sellerId: product.sellerId,
      image: product.imageUrl,
    };
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const productExist = await this.prisma.product.findUnique({
      where: { id }
    })
    if (!productExist)
      throw new NotFoundException("Product Doesn't exist");
    return productExist
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productExist = await this.prisma.product.findUnique({
      where: { id }
    })
    if (!productExist)
      throw new NotFoundException(" Product Doesn't exist");

    return await this.prisma.product.update({
      data: {
        title: updateProductDto.title,
        quantity: updateProductDto.quantity,
        price: updateProductDto.price,
        description: updateProductDto.description,
        category: updateProductDto.category,
      },
      where: { id }
    })
  }

  async remove(id: number) {
    const productExist = await this.prisma.product.findUnique({
      where: { id }
    })
    if (!productExist)
      throw new NotFoundException(" Product Doesn't exist");

    return await this.prisma.product.delete({
      where: { id }
    })
  }
}
