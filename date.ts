import { periods } from "./config.json";

export const between = (x: Date, min: Date, max: Date) => x >= min && x <= max;

export const next = (x: Date) => new Date(x.getTime() + 24 * 3600 * 1000);

export const today = new Date();

export const [begin, end] = periods.map(date => {
  const localDate = new Date(date);
  localDate.setHours(0);
  return localDate;
});
