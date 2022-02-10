import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Posts } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }

  @Get(':category')
  getByCategory(@Param('category') category: string) {
    return this.postService.getByCategory(category);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  createPost(
    @Body() posts: Posts,
    @UploadedFiles() file: Express.Multer.File,
    @Headers('Authorization') auth: string,
  ) {
    return this.postService.createPost(posts, file, auth);
  }

  @Put()
  @UseInterceptors(FilesInterceptor('file'))
  updatePost(
    @Body() posts: Posts,
    @UploadedFiles() file: Express.Multer.File,
    @Headers('Authorization') auth: string,
  ) {
    return this.postService.updatePost(posts, file, auth);
  }

  @Delete()
  deletePost(
    @Body('postId') postId: string,
    @Headers('Authorization') auth: string,
  ) {
    return this.postService.deletePost(postId, auth);
  }
}
