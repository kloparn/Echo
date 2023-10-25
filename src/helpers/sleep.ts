export default async (timer: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, timer);
  });
};
