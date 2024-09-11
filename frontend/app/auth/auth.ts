'use server';

import {
  FormState,
  LoginFormSchema,
  SignupFormSchema,
} from './definitions';
import { createSession, deleteSession } from './session';
//import bcrypt from 'bcrypt';

export async function signupValidation(
 formData: FormData
): Promise<{ validatedFields?: { name: string, email: string, password: string }; hashedPassword?: string; errors?: any }> {
 // Validate form fields
 const validatedFields = SignupFormSchema.safeParse({
   name: formData.get('name'),
   email: formData.get('email'),
   password: formData.get('password'),
 });

 console.log(validatedFields, 'VALIDATED FIELDS [SIGNUP]')

 if (!validatedFields.success) {
   return {
    errors: validatedFields.error.flatten().fieldErrors,
  };
 }

 // Hash the password
 //const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

 return {
   validatedFields: validatedFields.data,
   hashedPassword: validatedFields.data.password,
 };

 
}

export async function login(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  const errorMessage = { message: 'Invalid login credentials.' };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }



  // 4. If login successful, create a session for the user and redirect
  const userId = ' ';
  await createSession(userId);
}

export async function logout() {
  deleteSession();
}
