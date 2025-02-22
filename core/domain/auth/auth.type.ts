import { z } from 'zod';

import { LoginFormSchema, RegisterFormSchema } from '@/core/domain/auth/auth.schema';

export type LoginPayload = z.infer<typeof LoginFormSchema>;
export type RegisterPayload = z.infer<typeof RegisterFormSchema>;
