import seed from "../seed";
import neode from "../neode";

(async () => {
  await seed();
  await neode.driver.close();
})();
