import { z } from "zod";
import { zJson } from "./utils/zod";

const EnvSchema = z.object({
  VITE_FIREBASE_CONFIG: zJson(),
});

let env: z.infer<typeof EnvSchema>;
try {
  env = EnvSchema.parse((import.meta as any).env);
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    throw new Error(
      `Error parsing env variable ${error.errors[0]?.path}: "${error.errors[0]?.message}"`
    );
  }
  throw error;
}

export { env };
