import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsService } from '../admins/admins.service';
import { Repository } from 'typeorm';
import { Categories } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesResposity: Repository<Categories>,
    private adminService: AdminsService,
  ) {}

  getCategories() {
    try {
      return this.categoriesResposity.find({ order: { categoryDate: 'DESC' } });
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async createCategoty(category: Categories, auth: string) {
    try {
      const admin = await this.adminService.auth(auth);

      if (typeof admin === 'undefined' || typeof auth === 'undefined')
        return { message: 'Not Allowed' };

      if (!category.categoryName) return new BadRequestException();

      const foundCategory = await this.categoriesResposity.findOne({
        categoryName: category.categoryName,
      });

      if (!foundCategory) {
        const newCategory = this.categoriesResposity.create(category);
        await this.categoriesResposity.save(newCategory);

        await this.adminService.createRefAdmin(admin.adminId, [newCategory]);

        return { message: 'Created' };
      } else {
        return {
          message: 'This name is already in use. Try another category name',
          status: 400,
        };
      }
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async updateCategory(category: Categories, auth: string) {
    try {
      if (typeof auth === 'undefined') return { message: 'Not Allowed' };

      const admin = await this.adminService.auth(auth);
      const foundAdmin = await this.adminService.findRefAdmin(admin.adminId);

      const foundCategory = foundAdmin.adminCategories.find(
        (a) => a.categoryId === category.categoryId,
      );

      if (!admin || !foundAdmin || !foundCategory)
        return { message: 'Not Allowed' };

      if (!category.categoryName || !category.categoryId)
        return new BadRequestException();

      foundCategory.categoryName = category.categoryName;
      await this.categoriesResposity.save(foundCategory);
      return { message: 'Updated' };
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async deleteCategory(id: string, auth: string) {
    try {
      if (typeof auth === 'undefined') return { message: 'Not Allowed' };

      const admin = await this.adminService.auth(auth);
      const foundAdmin = await this.adminService.findRefAdmin(admin.adminId);

      const foundCategory = foundAdmin.adminCategories.find(
        (a) => a.categoryId === id,
      );

      if (!admin || !foundAdmin || !foundCategory)
        return { message: 'Not Allowed' };

      if (!id) return new BadRequestException();

      await this.categoriesResposity.remove(foundCategory);
      return { message: 'Deleted' };
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async findCategory(id: any) {
    return this.categoriesResposity.findOne({ categoryId: id });
  }
}
