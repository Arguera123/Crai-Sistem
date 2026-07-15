import { z } from "zod";

const LibrarianSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

const DeviceSchema = z.object({
  id: z.string(),
});

const LockerSchema = z.object({
  id: z.string(),
  location: z.string().optional(),
});

const ChargeSchema = z.object({
  startTime: z.string(), 
  librarian: LibrarianSchema,
});

const ReleaseSchema = z.object({
  endTime: z.string(),
  librarian: LibrarianSchema,
});

const DeviceLoanSchema = z.object({
  id: z.string(),
  date: z.string(),
  user: UserSchema,
  device: DeviceSchema,
  charge: ChargeSchema,
  release: ReleaseSchema.nullable(), 
});

const LockerLoanSchema = z.object({
  id: z.string(),
  date: z.string(),
  user: UserSchema,
  locker: LockerSchema,
  charge: ChargeSchema,
  release: ReleaseSchema.nullable(),
});

const LoanSchema = z.union([DeviceLoanSchema, LockerLoanSchema]);

export const LoanApiResponseSchema = z.object({
  data: z.array(LoanSchema),
  total: z.number(),
  page: z.number(),
  lastPage: z.number(),
});

export type Loan = z.infer<typeof LoanSchema>;
export type LoanApiResponse = z.infer<typeof LoanApiResponseSchema>;
