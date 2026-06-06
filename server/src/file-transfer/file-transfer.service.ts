import { BadRequestException, Injectable } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import { FileChunkDto } from './file-transfer.dto';

@Injectable()
export class FileTransferService {
  private readonly tempDir = path.join(process.cwd(), 'tmp', 'uploads');

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async handleFileChunk(data: FileChunkDto) {
    const buffer = Buffer.isBuffer(data.chunkData)
      ? data.chunkData
      : Buffer.from(data.chunkData);
    const fileDir = path.join(this.tempDir, data.fileId);

    // Ensure file directory exists
    await fs.promises.mkdir(fileDir, { recursive: true });

    const chunkPath = path.join(fileDir, `${data.chunkIndex}.chunk`);
    await fs.promises.writeFile(chunkPath, buffer);

    if (data.isLastChunk) {
      const totalChunks = Number(data.chunkIndex) + 1;
      const finalPath = await this.assembleChunks(
        fileDir,
        totalChunks,
        data.fileName,
      );
      await this.cleanup(fileDir);
      return { status: 'complete', filePath: finalPath };
    }
    return {
      status: 'chunk_received',
      chunkIndex: data.chunkIndex,
      totalChunks: data.totalChunks,
      fileName: data.fileName,
    };
  }

  private async assembleChunks(
    fileDir: string,
    totalChunks: number,
    fileName: string,
  ): Promise<string> {
    const outputPath = path.join(this.tempDir, fileName);
    const writeStream = fs.createWriteStream(outputPath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(fileDir, `${i}.chunk`);
      if (!fs.existsSync(chunkPath)) {
        throw new BadRequestException(`Missing chunk ${i}`);
      }

      const chunkBufferData = await fs.promises.readFile(chunkPath);
      await new Promise<void>((resolve, reject) => {
        writeStream.write(chunkBufferData, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    await new Promise<void>((resolve) => writeStream.end(resolve));
    return outputPath;
  }

  private async cleanup(fileDir: string) {
    await fs.promises.rm(fileDir, { recursive: true, force: true });
  }
}
