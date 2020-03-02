"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const chalk_1 = require("chalk");
const config_json_1 = require("./config.json");
const getDate = (ISOString) => ISOString.match(/(.*)(?=T)/g)[0];
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
    const today = getDate(new Date(Date.now()).toISOString());
    for (const user of config_json_1.users) {
        try {
            const { message, committer: { date } } = await getUserRepoLatestCommit(user);
            const log = `${user.name}(${user.user}): ${message} at ${date}`;
            console.log(getDate(date) === today ? chalk_1.green(log) : log);
        }
        catch (err) {
            console.log(chalk_1.red(`${user.name}(${user.user}): ${err}`));
        }
    }
})();
