"use client"
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import SIGNUP_MUTATION from '../../src/graphql/signup';
import { signupValidation } from '../auth/auth';
//import { createSession } from '../auth/session';

const Signup = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Use the signup mutation
  const [signUp] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setFormErrors({});

    // Create a FormData object
    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);

    console.log(formData, 'formData')

    // Call the signup validation function
    const result = await signupValidation(formData);

    console.log(result, 'RESULT VALIDATION ERRORS [SIGNUP]')

    if (result.errors) {
      // Set form errors to display in the form
      setFormErrors(result.errors);
      setLoading(false);
      return;
    }

    // Call the GraphQL mutation
    try {
      const { data } = await signUp({
        variables: {
          name: result.validatedFields?.name || '',
          email: result.validatedFields?.email || '' ,
          password: result.hashedPassword,
        },
      });

      const userId = data.user.id; 
      //await createSession(userId);

      // Handle successful signup (e.g., store the token, redirect, etc.)
      console.log('Signup successful:', data);
      setGeneralError(null)
    } catch (err) {
      setGeneralError('Signup failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 mt-2 border ${
                formErrors?.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Enter your name"
              required
            />
            {formErrors?.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 mt-2 border ${
                formErrors?.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Enter your email"
              required
            />
            {formErrors?.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 mt-2 border ${
                formErrors?.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Enter your password"
              required
            />
            {formErrors?.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        {generalError && <p className="text-red-500 mt-4">{generalError}</p>}
      </div>
    </div>
  );
};

export default Signup;
