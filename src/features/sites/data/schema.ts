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

const siteRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
})

// Define User schema
export const siteSchema =  z.object({
  id: z.string(),
  name: z.string(),
  description: z.null(), // If always null, use `z.null()`
  subdomain: z.string(),
  email: z.string(),
  bucketKey: z.string(),
  isPrivate: z.boolean(),
  customDomainUrl: z.null(), // If always null, use `z.null()`
  customDomainId: z.null(), // If always null, use `z.null()`
  isDomainVerified: z.boolean(),
  isBanned: z.boolean(),
  thumbnail: z.null(), // If always null, use `z.null()`
  createdAt: z.date(),
  updatedAt: z.date(),
  projectSize: z.null(), // If always null, use `z.null()`
  homePage: z.string(),
  createdBy: z.string(),
});

export type SiteI = z.infer<typeof siteSchema>
export type SiteRolesI = z.infer<typeof siteRoleSchema>

export const siteListSchema = z.array(siteSchema)
