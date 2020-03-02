"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const chalk_1 = require("chalk");
const config_json_1 = require("./config.json");
const login = async ({ username, password }) => {
    const secret = Buffer.from(`${username}:${password}`).toString("base64");
    const resp = await (await node_fetch_1.default("https://api.github.com/", {
        headers: { Authorization: `Basic ${secret}` }
    })).json();
    if (resp.message) {
        throw Error(resp.message);
    }
};
const getUserRepoLatestCommit = async ({ user, repo }) => {
    const resp = await (await node_fetch_1.default(`https://api.github.com/repos/${user}/${repo}/commits`)).json();
    if (resp.message) {
        throw Error(resp.message);
    }
    const { message, committer } = resp[0].commit;
    return { message, committer };
};
(async () => {
    await login(config_json_1.auth);
    const today = new Date().toLocaleDateString();
    config_json_1.users.forEach(async (user) => {
        {
            try {
                const { message, committer } = await getUserRepoLatestCommit(user);
                const date = new Date(committer.date);
                const log = `${user.name}(${user.user}): ${message} ${chalk_1.blue(date.toLocaleString())}`;
                console.log(date.toLocaleDateString() === today ? chalk_1.green(log) : log);
            }
            catch (err) {
                console.log(chalk_1.red(`${user.name}(${user.user}): ${err}`));
            }
        }
    });
})();
