import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll(
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPopularity') minPopularity?: string,
    @Query('maxPopularity') maxPopularity?: string,
  ) {
    // Filtre değerlerini number’a çevir
    const filters = {
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minPopularity: minPopularity ? parseFloat(minPopularity) : undefined,
      maxPopularity: maxPopularity ? parseFloat(maxPopularity) : undefined,
    };

    return this.productsService.getAllProducts(filters);
  }

  @Get(':name')
  getOne(@Param('name') name: string) {
    const product = this.productsService.getProductByName(name);
    if (!product) {
      return { message: 'Ürün bulunamadı' };
    }
    return product;
  }
}
