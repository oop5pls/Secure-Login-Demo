import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInput.css';

type UserDetails = {
  firstName: string;
  surname: string;
  password: string;
  email: string;
};

const apiUrl = 'http://localhost:3000/';
const initialDetails: UserDetails = { firstName: '', surname: '', password: '', email: '' };

export function UserInput() {
  const navigate = useNavigate();
  const [details, setDetails] = useState<UserDetails>(initialDetails);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLoginPage() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error();
        await response.json();
        if (isMounted) setIsReady(true);
      } catch {
        if (isMounted) setError('Could not load the login page. Make sure the Nest backend is running.');
      }
    }

    void loadLoginPage();
    return () => { isMounted = false; };
  }, []);

  function updateField(field: keyof UserDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(apiUrl + 'login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: details.firstName,
          surname: details.surname,
          password: details.password,
          email: details.email,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message ?? 'Invalid credentials');
      }

      const data = await response.json();

      navigate(data.role === 'admin' ? '/admin' : '/welcome');
    } catch (err) {
      console.error('Login error:', err);
      navigate('/');
    }
  }

  async function handleRegistration() {
    navigate('/registration');
  }

  async function handleGoogleLogin() {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  return (
    <main className="page">
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="heading">
          <p className="eyebrow">Profile</p>
          <h1>Tell us about yourself</h1>
          <p>Enter your basic details to get started.</p>
        </div>

        <div className="fields">
          <label>First name<input value={details.firstName} onChange={(event) => updateField('firstName', event.target.value)} autoComplete="given-name" required /></label>
          <label>Surname<input value={details.surname} onChange={(event) => updateField('surname', event.target.value)} autoComplete="family-name" required /></label>
          <label>Password<input type="password" value={details.password} onChange={(event) => updateField('password', event.target.value)} autoComplete="new-password" required /></label>
          <label>Email<input type="email" value={details.email} onChange={(event) => updateField('email', event.target.value)} autoComplete="email" required /></label>
        </div>

        <button type="submit" disabled={!isReady}>{isReady ? 'Log In' : 'Loading...'}</button>

        <button type="button" className="secondary-button" onClick={handleGoogleLogin}>
          Log in with Google
        </button>

        <div>
          <label>Don't have an account? Register here!</label>
          <button type="button" className="registration-button" onClick={handleRegistration}>Register</button>
        </div>

        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );
}
