import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create( 
    // @UploadedFile() file: Express.Multer.File, 
    @Body() createProductDto: CreateProductDto) {
    // return this.productService.create(file, createProductDto);
    return this.productService.create(createProductDto);

  }

  @Get('get')
  findAll() {
    return this.productService.findAll();
  }

  @Get('get/:id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
