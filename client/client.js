const io = require('socket.io-client');
const fs = require('fs');

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB per chunk

async function main() {
  const socket = io('http://localhost:8080');

  await new Promise((resolve) => socket.on('connect', resolve));
  console.log('Connected to server');

   await new Promise((resolve, reject) => {
    socket.emit('REGISTER', { clientId: 'client-001' }, (ack) => {
      if (ack?.error) reject(new Error(ack.error));
      else resolve(ack);
    });
  });
  console.log('Registered with server');

  socket.on('DOWNLOAD', async (data) => {
    console.log('Received download command from server');
    await upload(socket);
  });

  socket.on('UPLOAD_PROGRESS', (data) => {
    if (data.status === 'chunk_saved') {
      console.log(`Chunk ${data.chunkIndex}/${data.totalChunks} saved on server`);
    } else if (data.status === 'upload_complete') {
      console.log(`Upload of ${data.fileName} completed successfully`);
      socket.disconnect();
    }
  });

  socket.on('UPLOAD_COMPLETE', (data) => {
    console.log(`Upload of ${data.fileName} completed successfully`);
    socket.disconnect();
  });

  socket.on('UPLOAD_ERROR', (data) => {
    console.error(`Error uploading chunk ${data.chunkIndex}:`, data.error);
    socket.disconnect();
  });

async function upload(socket) {
  const filePath = './test_100mb.txt';
  const stats = fs.statSync(filePath);

  const fileName = 'test_100mb.txt';
  const fileId = 'file-001';

  const totalChunks = Math.ceil(stats.size / CHUNK_SIZE);

  console.log(`Starting upload of ${fileName} in ${totalChunks} chunks`);

  const readStream = fs.createReadStream(filePath, {
    highWaterMark: CHUNK_SIZE,
  });

  let chunkIndex = 0;

  for await (const chunkData of readStream) {
    await emitChunk(socket, {
      fileId,
      fileName,
      chunkIndex,
      totalChunks,
      isLastChunk: chunkIndex === totalChunks - 1,
      chunkData: Array.from(chunkData),
    });

    chunkIndex++;
  }
}

function emitChunk(socket, payload) {
  return new Promise((resolve, reject) => {
    socket.emit('UPLOAD_CHUNKS', payload, (ack) => {
      if (ack?.error) {
        reject(new Error(ack.error));
      } else {
        resolve();
      }
    });  
});
}

}
main().catch((error) => {
  console.error('Error in client:', error);
});
