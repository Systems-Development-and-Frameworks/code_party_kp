import { seed, close } from "../db";

(async () => {
  await seed();
  await close();
})();
