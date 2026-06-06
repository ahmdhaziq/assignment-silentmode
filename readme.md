# File Transfer Demo: WebSocket Chunked Upload

A demonstration of a full-duplex file transfer system using NestJS for the server and a Node.js client. This demo showcases how to handle large file transfers (~100mb) when server prompted the download from a client that is not directly accessible through the internet client.

---

## 📁 Directory Structure

- `/server` — A NestJS application handling WebSocket connections, client registration, and file assembly.
- `/client` — A lightweight Node.js script that registers with the server and streams a 100MB file in chunks upon request.

---

## 🚀 How to Run the Demo

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Step 1: Set up the Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server in development mode:
   ```bash
   npm run start:dev
   ```

   The server listens for WebSockets on port `8080` and HTTP on `3000`.

### Step 2: Set up the Client

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the client:
   ```bash
   node client.js
   ```

### Step 3: Trigger API in Terminal

1. Navigate to client directory
  ```bash
  cd client
  ```
2. Trigger API to simulate the download
  ```bash
  curl -X POST http://localhost:3000/download/client-001
  ```

---

## 🛠 How it Works (Workflow)

1. **Registration** — When the client starts, it connects to the server and emits a `REGISTER` event with a unique `clientId` (e.g., `client-001`).
2. **Trigger** — The server triggers a transfer by emitting a `DOWNLOAD` event to the specific client.
3. **Chunking** — The client reads the local `test_100mb.txt` file and breaks it into 1MB chunks.
4. **Streaming** — Each chunk is sent via the `UPLOAD_CHUNKS` WebSocket event.
5. **Acknowledgement** — The server saves the chunk and sends an `UPLOAD_PROGRESS` update back to the client.
6. **Completion** — Once the last chunk is received, the server notifies the client that the upload is successful.

---

## ⚠️ Limitations & Constraints

- **Hardcoded Values** — The demo is configured specifically for a file named `test_100mb.txt`. You must ensure this file exists in the client directory for the demo to work.
- **Client ID** — The `clientId` is hardcoded as `client-001`. Multiple clients with the same ID may cause conflicts.
- **Port Dependencies** — Requires ports `3000` and `8080` to be open.
- **No Resume Logic** — If the connection drops mid-transfer, the process must be restarted from the beginning (no partial resume).
- **Security** — This is a demo environment; it does not include authentication, rate limiting, or file type validation.
- **Environment** — Designed for local development (`localhost`). Network latency in production may require adjusting the `CHUNK_SIZE`.