import { z } from "zod";

const createBusiness = z.object({
  body: z.object({
    alias: z.string({
      required_error: "Business Alias is required",
      invalid_type_error: "Business Alias must be a string",
    }),
  }),
});

export default { createBusiness };
