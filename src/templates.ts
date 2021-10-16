export const templates = [
  [
    [0.15, 0.3],
    [0.85, 0.7],
    [0.05, 0.8],
    [0.8, 0.1],
  ],
].map((template) =>
  template.map(([x, y]) => ({ x: x * 100 * 0.6, y: y * 100 * 0.7 }))
);
