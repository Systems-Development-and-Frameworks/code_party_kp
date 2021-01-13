import Neode from "neode";
import "../config";

const dir = `${__dirname}/models`;
const instance = new Neode.fromEnv().withDirectory(dir);
export default instance;
