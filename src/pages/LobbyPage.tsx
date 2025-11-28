import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Alert, Navbar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { lobbyAPI } from '../services/api';
import type { LobbyState } from '../types';
import './LobbyPage.css';

const LobbyPage = () => {
  const [lobby, setLobby] = useState<LobbyState | null>(null);
  const [error, setError] = useState<string>('');
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      loadLobby();
      const interval = setInterval(loadLobby, 2000);
      return () => clearInterval(interval);
    }
  }, [code]);

  const loadLobby = async (): Promise<void> => {
    if (!code) return;

    try {
      const response = await lobbyAPI.getState(code);
      setLobby(response.data);

      if (response.data.status === 'IN_GAME') {
        navigate(`/game/${code}`);
      }
    } catch (error) {
      setError('Lobby konnte nicht geladen werden');
    }
  };

  const handleToggleReady = async (): Promise<void> => {
    if (!code || !lobby || !user) return;

    try {
      const currentMember = lobby.members.find(m => m.userId === user.id);
      await lobbyAPI.setReady(code, !currentMember?.isReady);
      loadLobby();
    } catch (error) {
      setError('Status konnte nicht geändert werden');
    }
  };

  const handleStartGame = async (): Promise<void> => {
    if (!code) return;

    try {
      await lobbyAPI.start(code);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Spiel konnte nicht gestartet werden');
    }
  };

  const handleLeaveLobby = async (): Promise<void> => {
    if (!code) return;

    try {
      await lobbyAPI.leave(code);
      navigate('/');
    } catch (error) {
      setError('Lobby konnte nicht verlassen werden');
    }
  };

  if (!lobby) {
    return (
      <div className="lobby-page">
        <Container className="py-5 text-center">
          <div className="waiting-state">
            <div className="waiting-spinner">⏳</div>
            <div className="waiting-message">Lade Lobby...</div>
          </div>
        </Container>
      </div>
    );
  }

  const isHost = lobby.hostUserId === user?.id;
  const currentMember = lobby.members.find(m => m.userId === user?.id);
  const allReady = lobby.members.every(m => m.isReady);
  const canStart = isHost && lobby.members.length >= 4 && allReady;

  return (
    <div className="lobby-page">
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand>🐺 Werwölfeln - Lobby</Navbar.Brand>
          <Button variant="outline-danger" size="sm" onClick={handleLeaveLobby}>
            Lobby verlassen
          </Button>
        </Container>
      </Navbar>

      <div className="lobby-container">
        <div className="lobby-header">
          <div className="lobby-code-label">Lobby-Code</div>
          <div className="lobby-code-display">{lobby.lobbyCode}</div>
          <p style={{ color: 'rgba(232, 238, 245, 0.6)', marginTop: '1rem' }}>
            Teile diesen Code mit deinen Freunden!
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="lobby-main-card">
          <div className="lobby-status-bar">
            <div className="lobby-info-item">
              <span className="lobby-info-icon">👥</span>
              <span>{lobby.members.length} / {lobby.maxPlayers} Spieler</span>
            </div>
            <div className="lobby-info-item">
              <span className="lobby-info-icon">
                {allReady ? '✅' : '⏳'}
              </span>
              <span>{allReady ? 'Alle bereit!' : 'Warte auf Spieler...'}</span>
            </div>
          </div>

          <div className="lobby-members-section">
            <div className="members-header">
              <h3 className="members-title">Spieler</h3>
              <div className="members-count">
                {lobby.members.filter(m => m.isReady).length} / {lobby.members.length} bereit
              </div>
            </div>

            {lobby.members.map((member) => (
              <div key={member.userId} className="member-card">
                <div className="member-info">
                  <div className="member-avatar">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-details">
                    <div className="member-name">{member.username}</div>
                    <div className="member-badges">
                      {member.userId === lobby.hostUserId && (
                        <span className="host-badge">
                          👑 Host
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`ready-indicator ${member.isReady ? 'ready' : 'not-ready'}`}>
                  {member.isReady ? '✅ Bereit' : '⏳ Wartet'}
                </div>
              </div>
            ))}

            {lobby.members.length < 4 && (
              <Alert variant="info" className="mt-3">
                <strong>⚠️ Mindestens 4 Spieler benötigt</strong>
                <p className="mb-0" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Aktuell: {lobby.members.length} / 4
                </p>
              </Alert>
            )}

            {!allReady && lobby.members.length >= 4 && (
              <Alert variant="warning" className="mt-3">
                <strong>⏳ Warte auf alle Spieler</strong>
                <p className="mb-0" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Alle Spieler müssen bereit sein, bevor das Spiel starten kann.
                </p>
              </Alert>
            )}
          </div>

          <div className="lobby-actions">
            <Button
              variant={currentMember?.isReady ? 'warning' : 'success'}
              onClick={handleToggleReady}
              size="lg"
            >
              {currentMember?.isReady ? '❌ Nicht mehr bereit' : '✅ Bereit'}
            </Button>

            {isHost && (
              <Button
                variant="primary"
                onClick={handleStartGame}
                disabled={!canStart}
                size="lg"
              >
                🎮 Spiel starten
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default LobbyPage;

