import type { RegisterCredentials, RegisterResponse } from '../models/register.types';

class RegisterService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          username: credentials.username,
          password: credentials.password,
          first_name: credentials.firstName || '',
          last_name: credentials.lastName || '',
        }),
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const htmlText = await response.text();
          console.error('Received HTML instead of JSON:', htmlText);
          throw new Error('Server error. Please check if the Django server is running properly.');
        }
        
        // Handle field-specific errors from Django
        if (response.status === 400 && errorData) {
          const errors: string[] = [];
          
          if (errorData.error) {
            errors.push(errorData.error);
          }
          if (errorData.email) {
            errors.push(`Email: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`);
          }
          if (errorData.username) {
            errors.push(`Username: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}`);
          }
          if (errorData.password) {
            errors.push(`Password: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}`);
          }
          if (errorData.non_field_errors) {
            errors.push(Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors);
          }
          
          throw new Error(errors.length > 0 ? errors.join('. ') : 'Registration failed');
        }
        
        throw new Error(errorData?.message || errorData?.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Transform the Django response to match the expected RegisterResponse format
      return {
        user: {
          id: '1',
          email: credentials.email,
          username: credentials.username,
          firstName: credentials.firstName || '',
          lastName: credentials.lastName || '',
          fullName: `${credentials.firstName || ''} ${credentials.lastName || ''}`.trim(),
        },
        message: data.message || 'User created successfully'
      };
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please try again.');
    }
  }

  async checkEmailAvailability(_email: string): Promise<boolean> {
    try {
      // Temporarily disabled - endpoint not implemented in Django backend yet
      // You can implement this later by adding a check-email endpoint to your Django backend
      console.warn('Email availability check is disabled - endpoint not implemented');
      return true; // Assume available for now
    } catch (error) {
      console.warn('Email availability check failed:', error);
      return true; // Assume available if check fails
    }
  }

  async checkUsernameAvailability(_username: string): Promise<boolean> {
    try {
      // Temporarily disabled - endpoint not implemented in Django backend yet
      // You can implement this later by adding a check-username endpoint to your Django backend
      console.warn('Username availability check is disabled - endpoint not implemented');
      return true; // Assume available for now
    } catch (error) {
      console.warn('Username availability check failed:', error);
      return true; // Assume available if check fails
    }
  }

  // Utility method to validate email format on client side
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Utility method to validate username format on client side
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }
}

export const registerService = new RegisterService();