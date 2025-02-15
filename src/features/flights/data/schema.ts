import { z } from 'zod'

// const userStatusSchema = z.union([
//   z.literal('active'),
//   z.literal('inactive'),
//   z.literal('invited'),
//   z.literal('suspended'),
// ])
// export type UserStatus = z.infer<typeof userStatusSchema>

// const userRoleSchema = z.union([
//   z.literal('SUPER_ADMIN'),
//   z.literal('ADMIN'),
//   z.literal('USER'),
// ])

const userRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Define User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(), // Allows `null` values
  lastName: z.string().nullable(),  // Allows `null` values
  password: z.string(),
  createdAt: z.coerce.date(), // Converts to Date if possible
  updatedAt: z.coerce.date(), // Converts to Date if possible
  roleId: z.string(),
  status: z.string().nullable(), // Allows `null` values
  emailVerified: z.boolean(),
  isBanned: z.boolean(),
  isDeleted: z.boolean(),
  fullname: z.string(),
  customerId: z.string().nullable(), // Allows `null` values
  image: z.string().nullable(), // Allows `null` values
  user_role: userRoleSchema,
});

export type User = z.infer<typeof userSchema>
export type UserRoles = z.infer<typeof userRoleSchema>

export const userListSchema = z.array(userSchema)
