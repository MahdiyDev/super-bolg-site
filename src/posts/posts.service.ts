import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsService } from '../admins/admins.service';
import { CategoriesService } from '../categories/categories.service';
import { Repository } from 'typeorm';
import { Posts } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsResposity: Repository<Posts>,
    private adminService: AdminsService,
    private categoryService: CategoriesService,
  ) {}

  async getPosts() {
    try {
      return await this.postsResposity.find({
        relations: ['postCategory', 'postOwner'],
      });
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async createPost(post: Posts, file: any, auth: string) {
    try {
      const admin = await this.adminService.auth(auth);

      if (typeof admin === 'undefined' || typeof auth === 'undefined')
        return { message: 'Not Allowed' };

      if (
        !post.postTitle ||
        !post.postContent ||
        !post.postCategory.length ||
        !file.length
      )
        return new BadRequestException();

      const foundPost = await this.postsResposity.findOne(
        { postTitle: post.postTitle },
        { relations: ['postCategory'] },
      );

      if (!foundPost) {
        let categoryArr = [];
        const newPost = this.postsResposity.create(post);

        for (let i = 0; i < post.postCategory.length; i++) {
          const id = post.postCategory[i];
          const foundCategory = await this.categoryService.findCategory(id);
          categoryArr.push(foundCategory);
        }

        newPost.postImage = file[0].filename;
        newPost.postCategory = [...categoryArr];
        newPost.postOwner = admin.adminId;
        await this.postsResposity.save(newPost);
        categoryArr = [];
        return { message: 'Created' };
      } else {
        return {
          message: 'This title is already in use. Try another post title',
          status: 400,
        };
      }
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async updatePost(post: Posts, file: any, auth: string) {
    try {
      if (typeof auth === 'undefined') return { message: 'Not Allowed' };

      const admin = await this.adminService.auth(auth);

      const foundPost = await this.postsResposity.findOne(
        { postOwner: admin },
        { relations: ['postOwner', 'postCategory'] },
      );
      console.log(foundPost);

      const categoryArr = [];

      for (let i = 0; i < post.postCategory.length; i++) {
        const id = post.postCategory[i];
        const foundCategory = await this.categoryService.findCategory(id);
        categoryArr.push(foundCategory);
      }

      if (file[0].filename) foundPost.postImage = file[0].filename;
      if (post.postTitle) foundPost.postTitle = post.postTitle;
      if (post.postContent) foundPost.postContent = post.postContent;
      if (post.postCategory.length)
        foundPost.postCategory = [...categoryArr, ...foundPost.postCategory];

      await this.postsResposity.save(foundPost);

      return { message: 'Updated' };
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async deletePost(postId: string, auth: string) {
    try {
      const admin = await this.adminService.auth(auth);

      if (typeof admin === 'undefined' || typeof auth === 'undefined')
        return { message: 'Not Allowed' };

      const foundPost = await this.postsResposity.findOne({ postId });

      await this.postsResposity.remove(foundPost);

      return { message: 'Deleted' };
    } catch (_) {
      return new InternalServerErrorException();
    }
  }
}
