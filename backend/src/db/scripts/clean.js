import { clean, close } from "../db";

(async () => {
  await clean();
  await close();
})();
