import { z } from "zod";

export function zJson() {
  return z.string().transform((s, ctx) => {
    let res: object;
    try {
      res = JSON.parse(s);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Failed to parse JSON",
        fatal: true,
      });
      res = {};
    }
    return res;
  });
}
