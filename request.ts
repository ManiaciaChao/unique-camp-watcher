import fetch from "node-fetch";

interface IUser {
  name: string;
  user: string;
  repo: string;
}

interface IAuth {
  username: string;
  password: string;
}

interface Resp extends Array<{ commit: ICommit }> {
  message?: string;
}

interface ICommit {
  message: string;
  committer: {
    name: string;
    email: string;
    date: string;
  };
}

export const login = async ({ username, password }: IAuth) => {
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

export const getUserRepoCommits = async ({ user, repo }: IUser) => {
  const resp = (await (
    await fetch(`https://api.github.com/repos/${user}/${repo}/commits`)
  ).json()) as Resp;
  if (resp.message) {
    throw Error(resp.message);
  }
  return resp.map(ele => ele.commit);
};
