export const arrayWith = (size: number, valueOrPredicate: any): Array<any> => {
  if (typeof valueOrPredicate === "number")
    return new Array(size).fill(valueOrPredicate);
  const arr = [];
  for (let i = 0; i < size; i++) arr.push(valueOrPredicate(i));
  return arr;
};

export const randomInt = (from: number, to: number): number =>
  from + Math.floor(Math.random() * to - from);
