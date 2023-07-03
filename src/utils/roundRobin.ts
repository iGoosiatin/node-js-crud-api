export const createRoundRobin = (max: number) => {
  let count = 0;
  return () => {
    count = count % max;
    return (count += 1);
  };
};
