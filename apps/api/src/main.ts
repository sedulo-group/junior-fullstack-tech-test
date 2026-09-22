import { createApp } from "./app.js";

const app = await createApp();
const port = Number(process.env.PORT ?? 4000);
app.enableShutdownHooks();
await app.listen(port, "127.0.0.1");
console.log(`Task API ready at http://127.0.0.1:${port}/tasks`);
