export const templates = (
  [
    [
      [0.15, 0.3, 1.1],
      [0.85, 0.7, 0.7],
      [0.05, 0.8, 1],
      [0.8, 0.1, 1.3],
    ],
  ] as const
).map((template) =>
  template.map(([x, y, scale]) => ({
    x: x * 100 * 0.6,
    y: y * 100 * 0.7,
    scale: scale,
  }))
);
