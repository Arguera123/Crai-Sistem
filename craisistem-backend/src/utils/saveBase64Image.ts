import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

export const saveBase64Image = (
  base64: string,
  folder = 'uploads/users'
): string => {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);

  if (!matches) {
    throw new Error('Formato Base64 inválido');
  }

  const ext = matches[1].split('/')[1]; 
  const data = matches[2];

  const buffer = Buffer.from(data, 'base64');

  const fileName = `${uuid()}.${ext}`;
  const uploadPath = path.join(process.cwd(), folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const filePath = path.join(uploadPath, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/${folder}/${fileName}`; // 👈 lo que guardas en DB
};
