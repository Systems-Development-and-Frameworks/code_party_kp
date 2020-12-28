import clean from "../clean";
import neode from "../neode";

(async () => {
  await clean();
  await neode.driver.close();
})();
