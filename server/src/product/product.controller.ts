import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  // @UseInterceptors(FileInterceptor('file'))
  async create(@Req() req: Request & { user?: any },
    // @UploadedFile() file: Express.Multer.File, 
    @Body() createProductDto: CreateProductDto) {
      const sellerId = (req.user && ((req.user.userId as number) || (req.user.sub as any) || req.user.id)) as number;
    // return this.productService.create(file, createProductDto);
    return this.productService.create({...createProductDto}, sellerId);

  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  findAll() {
    console.log("called");
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSellerProducts')
  findBySellerId(@Req() req: Request & { user?: any }) {
    const sellerId = (req.user && ((req.user.userId as number) || (req.user.sub as any) || req.user.id)) as number;
    return this.productService.findBySellerId(sellerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

}
