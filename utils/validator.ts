import { z } from "zod";

export const ActivationSchema = z.object({
  key: z.string(),
  mac: z.string(),
  clientName: z.string(),
  phoneNumber: z.string(),
});
