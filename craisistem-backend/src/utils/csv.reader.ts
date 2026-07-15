import fs from 'fs/promises';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

export class CsvReader {
  static async readAndDelete(filePath: string): Promise<any[]> {
    const records = await CsvReader.read(filePath);
    await fs.unlink(filePath); // responsabilidad separada pero explícita
    return records;
  }

  private static read(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const records: any[] = [];
      createReadStream(filePath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on('data', (row) => records.push(row))
        .on('end', () => resolve(records))
        .on('error', (err) => reject(err));
    });
  }
}

