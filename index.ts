import fetch from "node-fetch";
import { green, red } from "chalk";
import { auth, users } from "./config.json";

interface IUser {
  name: string;
  user: string;
  repo: string;
}

interface IAuth {
  username: string;
  password: string;
}

interface ICommit {
  message: string;
  committer: {
    name: string;
    email: string;
    date: string;
  };
}

const getDate = (ISOString: string) =>
  (ISOString.match(/(.*)(?=T)/g) as string[])[0];

const login = async ({ username, password }: IAuth) => {
  const secret = Buffer.from(`${username}:${password}`).toString("base64");
  const resp = await (
    await fetch("https://api.github.com/", {
      headers: { Authorization: `Basic ${secret}` }
    })
  ).json();
  if (resp.message) {
    throw Error(resp.message);
  }
};

const getUserRepoLatestCommit = async ({ user, repo }: IUser) => {
  const resp = await (
    await fetch(`https://api.github.com/repos/${user}/${repo}/commits`)
  ).json();
  if (resp.message) {
    throw Error(resp.message);
  }
  const { message, committer } = resp[0].commit;
  return { message, committer } as ICommit;
};

(async () => {
  await login(auth);
  const today = getDate(new Date(Date.now()).toISOString());
  for (const user of users as IUser[]) {
    try {
      const {
        message,
        committer: { date }
      } = await getUserRepoLatestCommit(user);
      const log = `${user.name}(${user.user}): ${message} at ${date}`;
      console.log(getDate(date) === today ? green(log) : log);
    } catch (err) {
      console.log(red(`${user.name}(${user.user}): ${err}`));
    }
  }
})();
