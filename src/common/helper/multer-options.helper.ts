import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from 'src/exception/custom-http.exception';
import { StatusCodesList } from '../constants/status-codes-list.constants';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const multerOptionsHelper = (
  destinationPath: string,
  maxFileSize: number,
) => ({
  limits: {
    fileSize: +maxFileSize,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new CustomHttpException(
          'unsupportedFileType',
          HttpStatus.BAD_REQUEST,
          StatusCodesList.UnsupportedFileType,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      if (!existsSync(destinationPath)) {
        mkdirSync(destinationPath);
      }
      cb(null, destinationPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
});
