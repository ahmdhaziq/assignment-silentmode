export interface FileChunkDto {
  fileId: string;
  fileName: string;
  chunkIndex: number;
  totalChunks: number;
  isLastChunk: boolean;
  chunkData: number[];
}
