import { red, blue, green, gray } from "chalk";
import { auth, users, fill } from "./config.json";
import { login, getUserRepoCommits } from "./request";
import { between, next, begin, end, today } from "./date";

(async () => {
  if (auth.need) {
    await login(auth);
  }
  users.forEach(async user => {
    {
      try {
        const commits = await getUserRepoCommits(user);
        const commitDates = new Set<string>();
        commits
          .map(({ committer: { date } }) => new Date(date))
          .filter(date => between(date, begin, next(end)))
          .forEach(date => commitDates.add(date.toLocaleDateString()));

        const status = [];
        for (let day = begin; day <= end; day = next(day)) {
          if (day >= today) {
            status.push(gray(fill));
            continue;
          }
          status.push(
            commitDates.has(day.toLocaleDateString()) ? green(fill) : red(fill)
          );
        }

        const latestCommit = commits[0];
        const {
          message,
          committer: { date }
        } = latestCommit;

        console.log(
          `${user.name}\t${status.join("")}\t${blue(
            new Date(date).toLocaleString()
          )}\t${message.trim()}`
        );
      } catch (err) {
        console.log(red(`${user.name}(${user.user}/${user.repo}): ${err}`));
      }
    }
  });
})();
