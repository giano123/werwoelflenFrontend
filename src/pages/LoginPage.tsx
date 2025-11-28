import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types';
import '../pages/Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginRequest>({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login fehlgeschlagen');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🐺</div>
            <h1 className="auth-title">Werwölfeln</h1>
            <p className="auth-subtitle">Willkommen zurück!</p>
          </div>

          <div className="auth-body">
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Benutzername oder E-Mail</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dein Benutzername oder E-Mail"
                  value={formData.usernameOrEmail}
                  onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passwort</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Dein Passwort"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Anmelden
              </button>
            </Form>
          </div>

          <div className="auth-footer">
            <p style={{ color: 'rgba(232, 238, 245, 0.7)' }}>
              Noch kein Konto?{' '}
              <Link to="/register" className="auth-link">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

