import * as path from 'path';

export const editorFileName = (req: any, file: any, cb: any) => {
  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
};
