import _ from "lodash";
import { sha256 } from "./utils";

const padding = 0.25;
export const templates = _.times(10, (i) => generateTemplate(i)).map(
  (template) =>
    template.map(([x, y, scale, rotation]) => ({
      x: `${((padding + x) / (1 + padding * 2)) * 100}%`,
      y: `${((padding + y) / (1 + padding * 2)) * 100}%`,
      scale: `${scale}`,
      rotation: `${rotation}deg`,
    }))
);

function generateTemplate(seed: number) {
  const randScale = (i: number) => (sha256(`${seed}|${i}`) % 5) / 10 + 0.6;
  const randRotation = (i: number) => sha256(`${seed}|${i}`) % 360;
  return [
    [0.5, 0.5, randScale(-1), randRotation(-1)],
    ..._.times(
      7,
      (i) =>
        [
          (1 + Math.cos((Math.PI * 2 * i + Math.PI / 2) / 7)) / 2,
          (1 + Math.sin((Math.PI * 2 * i + Math.PI / 2) / 7)) / 2,
          randScale(i),
          randRotation(i),
        ] as const
    ),
  ];
}
