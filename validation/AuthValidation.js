import vine from "@vinejs/vine";
// import { ComparisonOperators } from "@vinejs/vine/build/src/types.js";

export const registerSchema = vine.object({
  name: vine.string(),
  profile:vine.string(),
  email: vine.string().email(),
  password: vine
  .string()
  .minLength(8)
  .maxLength(32)
  .confirmed(),

})

export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(8),
})
//updateuser Schema

// Update user schema with fields that can be optional
export const updateUserSchema = vine.object({
  name: vine.string().optional(),  // Optional name field
  profile: vine.string().optional(), // Optional profile field
  email: vine.string().email().optional(), // Optional email field
  password: vine
    .string()
    .minLength(8)
    .maxLength(32)
    .confirmed()
    .optional(),  // Optional password field
});
