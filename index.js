import { createServer } from "http";
import app from "./app.js";
const server = createServer(app);
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
