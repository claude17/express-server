import app from "./app";
import config from "./config";
import { initDB } from "./db";

const port = config.port;
initDB();
const main = () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();
