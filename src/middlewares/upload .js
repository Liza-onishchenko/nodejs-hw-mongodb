import multer from 'multer';
import createError from 'http-errors';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  // destination:(req,file,cb) => {
  //     cb(new Error('Cannot upload file'));
  //     cb(null, TEMP_UPLOAD_DIR);
  // }
  destination: TEMP_UPLOAD_DIR, //де зберігатимуться файли
  filename: (req, file, cb) => {
    //як буде називатися файл
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  //обмеження
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  //не стандартні обмеження
  const extention = file.originalname.split('.').pop(); //не прийма з розшир-ням .ехе
  if (extention === 'exe') {
    return cb(createError(400, 'file with .exe extention not allow'));
  }
  cb(null, true); //зберіга без розширення .ехе
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
