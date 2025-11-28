import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Navbar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { lobbyAPI } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showJoinForm, setShowJoinForm] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateLobby = async (): Promise<void> => {
    try {
      const response = await lobbyAPI.create({ maxPlayers: 12 });
      navigate(`/lobby/${response.data.lobbyCode}`);
    } catch {
      setError('Lobby konnte nicht erstellt werden');
    }
  };

  const handleJoinLobby = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      await lobbyAPI.join(lobbyCode.toUpperCase());
      navigate(`/lobby/${lobbyCode.toUpperCase()}`);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Lobby nicht gefunden');
    }
  };

  return (
    <div className="home-page">
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand>🐺 Werwölfeln</Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <span style={{ color: 'var(--color-moon-glow)' }}>
              Hallo, <strong>{user?.username}</strong>
            </span>
            <Button variant="outline-secondary" size="sm" onClick={logout}>
              Abmelden
            </Button>
          </div>
        </Container>
      </Navbar>

      <div className="home-hero">
        <h1 className="home-title">🐺 WERWÖLFELN</h1>
        <p className="home-subtitle">
          Ein spannendes Deduktionsspiel für 4-12 Spieler
        </p>
      </div>

      <div className="home-content">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {user && (
          <div className="user-info-card fade-in">
            <div className="user-welcome">Willkommen zurück!</div>
            <div className="user-name">{user.username}</div>
          </div>
        )}

        <div className="home-actions">
          <div className="action-card" onClick={() => setShowCreateForm(!showCreateForm)}>
            <div className="action-icon">🎮</div>
            <div className="action-card-title">Neue Lobby</div>
            <div className="action-card-desc">
              Erstelle eine neue Spielrunde und lade deine Freunde ein
            </div>
            {showCreateForm && (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCreateLobby}
                  className="w-100"
                >
                  Jetzt erstellen
                </Button>
              </div>
            )}
          </div>

          <div className="action-card" onClick={() => setShowJoinForm(!showJoinForm)}>
            <div className="action-icon">🚪</div>
            <div className="action-card-title">Lobby beitreten</div>
            <div className="action-card-desc">
              Tritt einer bestehenden Spielrunde bei
            </div>
            {showJoinForm && (
              <div onClick={(e) => e.stopPropagation()}>
                <Form onSubmit={handleJoinLobby} className="lobby-form">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="6-stelliger Code"
                      value={lobbyCode}
                      onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </Form.Group>
                  <Button variant="success" size="lg" type="submit" className="w-100 mt-3">
                    Beitreten
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </div>

        <Card className="mt-4">
          <Card.Body>
            <h4 style={{ marginBottom: '1.5rem' }}>📜 Spielregeln</h4>
            <Row>
              <Col md={6}>
                <h5 style={{ color: 'var(--color-village-blue)', marginBottom: '1rem' }}>
                  🏘️ Rollen
                </h5>
                <ul style={{ lineHeight: '2' }}>
                  <li><strong>🐺 Werwölfe:</strong> Töten nachts gemeinsam einen Dorfbewohner</li>
                  <li><strong>🔮 Seher:</strong> Untersucht nachts einen Spieler</li>
                  <li><strong>🧪 Hexe:</strong> Hat Heil- und Gifttrank (je 1x)</li>
                  <li><strong>🏹 Jäger:</strong> Erschießt beim Tod einen Spieler</li>
                  <li><strong>👤 Dorfbewohner:</strong> Stimmen tagsüber ab</li>
                </ul>
              </Col>
              <Col md={6}>
                <h5 style={{ color: 'var(--color-witch-green)', marginBottom: '1rem' }}>
                  🏆 Siegbedingungen
                </h5>
                <ul style={{ lineHeight: '2' }}>
                  <li><strong>Dorf gewinnt:</strong> Alle Werwölfe eliminiert</li>
                  <li><strong>Werwölfe gewinnen:</strong> Gleichstand oder Mehrheit erreicht</li>
                </ul>
                <h5 style={{ color: 'var(--color-hunter-orange)', marginTop: '2rem', marginBottom: '1rem' }}>
                  ⚙️ Spielablauf
                </h5>
                <ul style={{ lineHeight: '2' }}>
                  <li>🌙 Nacht: Werwölfe, Seher und Hexe agieren</li>
                  <li>☀️ Tag: Diskussion und Abstimmung</li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;

