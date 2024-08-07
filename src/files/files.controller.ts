import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { editorFileName } from 'src/utils/file-helper';
import { ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';

@ApiTags('Files')
@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editorFileName,
      }),
    }),
  )
  async create(
    @Body() formData: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return file;
  }
}
