import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes
} from '@nestjs/common';

import { fillDto } from '@project/shared-helpers';

import { BlogPostService } from './blog-post.service';
import { BlogPostRdo } from './rdo/blog-post.rdo';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentRdo, CreateCommentDto } from '@project/blog-comment';
import { CreateLikeDto, LikeRdo } from '@project/blog-like';
import { PostValidationPipe } from './pipes/blog-post-validation.pipe';

@Controller('posts')
export class BlogPostController {
  constructor (
    private readonly blogPostService: BlogPostService,
  ) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const post = await this.blogPostService.getPost(id);
    return fillDto(BlogPostRdo, post.toPOJO());
  }

  @Get('/')
  public async index(@Query() query: BlogPostQuery) {
    const postsWithPagination = await this.blogPostService.getAllPosts(query);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO()),
    }
    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @UsePipes(PostValidationPipe)
  @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.blogPostService.deletePost(id);
  }

  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(BlogPostRdo, updatedPost.toPOJO());
  }

  @Post('/:postId/comments')
  public async createComment(@Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const newComment = await this.blogPostService.addComment(postId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @Post('/:postId/likes')
  public async createLike(@Param('postId') postId: string, @Body() dto: CreateLikeDto) {
    const newLike = await this.blogPostService.addLike(postId, dto);
    return fillDto(LikeRdo, newLike.toPOJO());
  }

  @Get(`/:userId/count`)
  public async count(@Param('userId') userId: string) {
    const count = await this.blogPostService.getCount(userId);

    return count;
  }
}
