import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

type UserDetails = {
    firstName: string;
    surname: string;
    password: string;
    email: string;
};

const apiUrl = 'http://localhost:3000';
const initialDetails: UserDetails = { firstName: '', surname: '', password: '', email: '' };

export function Registration() {
    const navigate = useNavigate();
    const [details, setDetails] = useState<UserDetails>(initialDetails);
    const [error, setError] = useState('');

    function updateField(field: keyof UserDetails, value: string) {
        setDetails((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch(apiUrl + '/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: details.firstName,
                    surname: details.surname,
                    password: details.password,
                    email: details.email,
                }),
            });

            const data = await response.json();
            console.log("Registration data: ", data);
            const success = data && typeof data === 'object' ? data.ok === true : data === true;

            if (success) {
                navigate('/');
            } else {
                setError('Registration failed please try again');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed please try again');
        }
    }

    return (
        <main className="page">
            <form className="user-form registration-theme" onSubmit={handleSubmit}>
                <div className="heading">
                    <p className="eyebrow">Create Account</p>
                    <h1>Join us today</h1>
                    <p>Fill in your details to create a new account.</p>
                </div>

                <div className="fields">
                    <label>First name<input value={details.firstName} onChange={(event) => updateField('firstName', event.target.value)} autoComplete="given-name" required /></label>
                    <label>Surname<input value={details.surname} onChange={(event) => updateField('surname', event.target.value)} autoComplete="family-name" required /></label>
                    <label>Password<input type="password" value={details.password} onChange={(event) => updateField('password', event.target.value)} autoComplete="new-password" required /></label>
                    <label>Email<input type="email" value={details.email} onChange={(event) => updateField('email', event.target.value)} autoComplete="email" required /></label>
                </div>

                <button type="submit">Register</button>

                <button type="button" className="secondary-button" onClick={() => navigate('/')}>
                    Back to Login
                </button>

                {error && <p className="error">{error}</p>}
            </form>
        </main>
    );
}
