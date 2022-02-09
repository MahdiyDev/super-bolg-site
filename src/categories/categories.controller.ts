import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
} from '@nestjs/common';
import { Categories } from './categories.entity';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get()
  getCategory() {
    return this.categoryService.getCategories();
  }

  @Post()
  createCategoty(
    @Body() categories: Categories,
    @Headers('Authorization') auth: string,
  ) {
    return this.categoryService.createCategoty(categories, auth);
  }

  @Put()
  updateCategory(
    @Body() categories: Categories,
    @Headers('Authorization') auth: string,
  ) {
    return this.categoryService.updateCategory(categories, auth);
  }

  @Delete()
  deleteCategory(
    @Body('categoryId') categoryId: string,
    @Headers('Authorization') auth: string,
  ) {
    return this.categoryService.deleteCategory(categoryId, auth);
  }
}
