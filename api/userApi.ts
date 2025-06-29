import { capitalizeFirstLetter } from '@/components/utils';
import apiClient from './apiClient';

export const login = async (
  email: string,
  password: string
): Promise<{
  firstName?: string;
  email?: string;
  success: boolean;
  error?: string;
}> => {
  console.log('Logging in with email:', email);
  try {
    const response = await apiClient.post('/users/login', { email, password });
    return {
      firstName: response.data.firstName,
      email: response.data.email,
      success: true
    };
  } catch (error) {
    console.log(
      'Login error:',
      (error as { response: { data: { message: string } } }).response.data
        .message ?? error
    );
    return {
      success: false,
      error:
        (error as { response: { data: { message: string } } }).response.data
          .message ?? error
    };
  }
};

export const signup = async (
  firstName: string,
  email: string,
  password: string
): Promise<{
  firstName?: string;
  email?: string;
  success: boolean;
  error?: string;
}> => {
  try {
    if (!firstName || !email || !password) {
      throw new Error('All fields are required for signup.');
    }

    const response = await apiClient.post('/users/signup', {
      name: firstName,
      email,
      password
    });
    return {
      firstName: capitalizeFirstLetter(response.data.name, 'User'),
      email: response.data.email,
      success: true
    };
  } catch (error) {
    console.log(
      'Signup error:',
      (error as { response: { data: { message: string } } }).response.data
        .message ?? error
    );
    return {
      success: false,
      error:
        (error as { response: { data: { message: string } } }).response.data
          .message ?? error
    };
  }
};
