import { FormEvent, useEffect, useState } from 'react';
import './Admin.css';

type AdminUser = {
  id: string;
  firstname: string;
  surname: string;
  password: string | null;
  email: string | null;
  gmail: string | null;
};

type UserFormValues = {
  firstname: string;
  surname: string;
  password: string;
  email: string;
};

const adminApiUrl = 'http://localhost:3000/admin';
const emptyUserForm: UserFormValues = {
  firstname: '',
  surname: '',
  password: '',
  email: '',
};

export function Admin() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newUser, setNewUser] = useState<UserFormValues>(emptyUserForm);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await fetch(adminApiUrl, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error();
      setUsers((await response.json()) as AdminUser[]);
    } catch {
      setError('Could not load users from the admin API.');
    }
  }

  function updateFormField(field: keyof UserFormValues, value: string) {
    setNewUser((current) => ({ ...current, [field]: value }));
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(adminApiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error();
      }

      setNewUser(emptyUserForm);
      await loadUsers();
    } catch {
      setError('Could not create the user.');
    }
  }

  async function deleteUser(id: string) {
    try {
      const response = await fetch(`${adminApiUrl}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error();
      }

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }

      await loadUsers();
    } catch {
      setError('Could not delete the user.');
    }
  }

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${adminApiUrl}/${selectedUser.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: formData.get('firstname'),
          surname: formData.get('surname'),
          password: formData.get('password'),
          email: formData.get('email'),
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setSelectedUser(null);
      await loadUsers();
    } catch {
      setError('Could not update the user.');
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <header className="admin-header">
          <p>Admin area</p>
          <h1>User management</h1>
          <span>Loaded from GET /admin</span>
        </header>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-content">
          <section className="admin-column">
            <h2>Add user</h2>
            <form className="admin-form admin-form--compact" onSubmit={(event) => void createUser(event)}>
              <label>First name<input value={newUser.firstname} onChange={(event) => updateFormField('firstname', event.target.value)} required /></label>
              <label>Surname<input value={newUser.surname} onChange={(event) => updateFormField('surname', event.target.value)} required /></label>
              <label>Password<input type="password" value={newUser.password} onChange={(event) => updateFormField('password', event.target.value)} required /></label>
              <label>Email<input type="email" value={newUser.email} onChange={(event) => updateFormField('email', event.target.value)} required /></label>
              <button type="submit">Add user</button>
            </form>
          </section>

          <section className="admin-column">
            <h2>Users ({users.length})</h2>
            <ul className="admin-users">
              {users.map((adminUser) => (
                <li key={adminUser.id}>
                  <div>
                    <strong>{adminUser.firstname} {adminUser.surname}</strong>
                    <span>User ID: {adminUser.id}</span>
                  </div>

                  <div className="admin-actions">
                    <button type="button" onClick={() => setSelectedUser(adminUser)}>Edit</button>
                    <button type="button" className="admin-delete" onClick={() => void deleteUser(adminUser.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {selectedUser && (
            <form className="admin-form" onSubmit={(event) => void saveUser(event)}>
              <h2>Edit user</h2>
              <label>First name<input name="firstname" defaultValue={selectedUser.firstname} required /></label>
              <label>Surname<input name="surname" defaultValue={selectedUser.surname} required /></label>
              <label>Password<input name="password" type="password" defaultValue={selectedUser.password ?? ''} required /></label>
              <label>Email<input name="email" type="email" defaultValue={selectedUser.email ?? ''} required /></label>
              <div className="admin-form-actions">
                <button type="submit">Save changes</button>
                <button className="admin-cancel" type="button" onClick={() => setSelectedUser(null)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
