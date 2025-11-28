import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest } from '../types';
import '../pages/Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterRequest>({ username: '', email: '', password: '' });
  const [error, setError] = useState<string>('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registrierung fehlgeschlagen');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🎮</div>
            <h1 className="auth-title">Jetzt beitreten</h1>
            <p className="auth-subtitle">Erstelle deinen Account</p>
          </div>

          <div className="auth-body">
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Benutzername</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Wähle einen Benutzernamen"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-Mail</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="deine@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passwort</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Wähle ein sicheres Passwort"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="submit-button">
                Konto erstellen
              </button>
            </Form>
          </div>

          <div className="auth-footer">
            <p style={{ color: 'rgba(232, 238, 245, 0.7)' }}>
              Bereits registriert?{' '}
              <Link to="/login" className="auth-link">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

