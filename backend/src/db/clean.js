import neode from "./neode";

export default async function clean() {
  await neode.driver
    .session()
    .writeTransaction((txc) => txc.run("MATCH(n) DETACH DELETE n;"));
}
