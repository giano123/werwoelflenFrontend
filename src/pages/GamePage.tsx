import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { gameAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { GameState, ActionType, PlayerInfo, WolfVictim } from '../types';
import ChatPanel from '../components/ChatPanel';
import './GamePage.css';

const GamePage = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [wolfVictim, setWolfVictim] = useState<WolfVictim | null>(null);
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadGame();
  }, [code]);

  useEffect(() => {
    if (!gameState) return;
    const interval = setInterval(loadGameState, 2000);
    return () => clearInterval(interval);
  }, [gameState?.gameId]);

  useEffect(() => {
    if (gameState?.currentPhase === 'NIGHT_WITCH' && gameState?.ownRole === 'WITCH') {
      loadWolfVictim();
    }
  }, [gameState?.currentPhase, gameState?.gameId]);

  const loadGame = async (): Promise<void> => {
    if (!code) return;

    try {
      const gameResponse = await gameAPI.getByLobbyCode(code);
      const gameId = gameResponse.data.id;

      const stateResponse = await gameAPI.getState(gameId);
      setGameState(stateResponse.data);
    } catch (error) {
      setError('Spiel konnte nicht geladen werden');
    }
  };

  const loadGameState = async (): Promise<void> => {
    if (!gameState) return;

    try {
      const response = await gameAPI.getState(gameState.gameId);
      setGameState(response.data);
    } catch (error) {
      console.error('Fehler beim Laden des Spielstatus', error);
    }
  };

  const loadWolfVictim = async (): Promise<void> => {
    if (!gameState) return;
    try {
      const response = await gameAPI.getWolfVictim(gameState.gameId);
      setWolfVictim(response.data);
    } catch (error) {
      console.error('Fehler beim Laden des Opfers', error);
    }
  };

  const getRoleEmoji = (role: string) => {
    switch(role) {
      case 'WEREWOLF': return '🐺';
      case 'SEER': return '🔮';
      case 'WITCH': return '🧪';
      case 'HUNTER': return '🏹';
      case 'VILLAGER': return '👤';
      default: return '❓';
    }
  };

  const getRoleName = (role: string) => {
    switch(role) {
      case 'WEREWOLF': return 'Werwolf';
      case 'SEER': return 'Seher';
      case 'WITCH': return 'Hexe';
      case 'HUNTER': return 'Jäger';
      case 'VILLAGER': return 'Dorfbewohner';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'WEREWOLF': return 'var(--color-werewolf-red)';
      case 'SEER': return 'var(--color-seer-purple)';
      case 'WITCH': return 'var(--color-witch-green)';
      case 'HUNTER': return 'var(--color-hunter-orange)';
      default: return 'var(--color-village-blue)';
    }
  };

  const getPhaseDisplay = (phase: string) => {
    switch(phase) {
      case 'NIGHT_WOLVES': return '🌙 Werwölfe aktiv';
      case 'NIGHT_SEER': return '🌙 Seher aktiv';
      case 'NIGHT_WITCH': return '🌙 Hexe aktiv';
      case 'DAY_DISCUSSION': return '☀️ Diskussion';
      case 'DAY_VOTING': return '☀️ Abstimmung';
      case 'RESULT': return '🏆 Ergebnis';
      default: return phase;
    }
  };

  const handleTransitionToVoting = async (): Promise<void> => {
    if (!gameState) return;
    try {
      await gameAPI.transitionToVoting(gameState.gameId);
      await loadGameState();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Übergang fehlgeschlagen');
    }
  };

  const handleAction = async (actionType: ActionType, targetPlayerId: number): Promise<void> => {
    if (!gameState) return;

    try {
      if (actionType === 'VOTE_LYNCH' || actionType === 'VOTE_WOLF_KILL') {
        await gameAPI.submitVote(gameState.gameId, targetPlayerId);
      } else {
        await gameAPI.submitPower(gameState.gameId, actionType, targetPlayerId);
      }
      await loadGameState();
      setError('');
      setSelectedPlayer(null);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Aktion fehlgeschlagen');
    }
  };

  if (!gameState) {
    return (
      <div className="game-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '1.2rem', color: '#fff' }}>Lade Spiel...</div>
          </div>
        </div>
      </div>
    );
  }

  const availableTargets: PlayerInfo[] = (gameState.players || []).filter(p => {
    if (!p.isAlive) return false;
    if (gameState.currentPhase === 'NIGHT_WOLVES' && gameState.ownRole === 'WEREWOLF') {
      return p.role !== 'WEREWOLF';
    }
    return true;
  });

  const selectedPlayerData = availableTargets.find(p => p.playerId === selectedPlayer);
  const canAct = gameState.isAlive && (gameState.availableActions?.length ?? 0) > 0;
  const isVotingPhase = ((gameState.currentPhase === 'NIGHT_WOLVES' && gameState.ownRole === 'WEREWOLF' && gameState.isAlive) || (gameState.currentPhase === 'DAY_VOTING' && gameState.isAlive));
  const isSeerPhase = gameState.currentPhase === 'NIGHT_SEER' && gameState.ownRole === 'SEER' && gameState.isAlive;
  const isWitchPhase = gameState.currentPhase === 'NIGHT_WITCH' && gameState.ownRole === 'WITCH' && gameState.isAlive;
  const isDiscussionPhase = gameState.currentPhase === 'DAY_DISCUSSION' && gameState.isAlive;
  const hasHunterShot = !gameState.isAlive && gameState.ownStateFlags?.hunterShotAvailable && gameState.ownRole === 'HUNTER';

  if (gameState.status === 'FINISHED') {
    return (
      <div className="game-page">
        <div className="game-result-overlay">
          <div className={`result-card ${gameState.winnerFaction === 'VILLAGE' ? 'winner-village' : 'winner-wolves'}`}>
            <div className="result-icon">
              {gameState.winnerFaction === 'VILLAGE' ? '🏘️' : '🐺'}
            </div>
            <h1 className="result-title">
              {gameState.winnerFaction === 'VILLAGE' ? 'Dorf gewinnt!' : 'Werwölfe gewinnen!'}
            </h1>
            <p className="result-subtitle">
              Die <strong>{gameState.winnerFaction === 'VILLAGE' ? 'Dorfbewohner' : 'Werwölfe'}</strong> haben gesiegt!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/')}
            >
              Zurück zur Startseite
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      {/* Header */}
      <div className="game-header">
        <div className="game-logo-section">
          <div className="game-logo-icon">🐺</div>
          <h1 className="game-title">Werwölflen</h1>
          <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              Tag {gameState.dayNumber} • {getPhaseDisplay(gameState.currentPhase)}
            </div>
            <div style={{ fontSize: '0.85rem', color: getRoleColor(gameState.ownRole), fontWeight: 600 }}>
              {getRoleEmoji(gameState.ownRole)} {getRoleName(gameState.ownRole)}
              {!gameState.isAlive && <span style={{ color: 'var(--color-dead-gray)', marginLeft: '0.5rem' }}>💀 Tot</span>}
            </div>
          </div>
        </div>
        <div className="game-user-section">
          <span style={{ color: '#fff', fontSize: '1rem' }}>Lobby: {code}</span>
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
            <div className="user-status-indicator"></div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0 1.5rem', paddingTop: '1rem' }}>
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        </div>
      )}

      {/* Main 3-Column Grid */}
      <div className="game-main-container">
        {/* Zone A: Interaction Panel (Left) */}
        <div className="game-zone zone-left">
          {/* Status & Instructions */}
          <div className="game-panel" style={{ flex: '0 0 auto' }}>
            <div className="panel-header">
              <h3 className="panel-title">Status & Anweisungen</h3>
            </div>
            <div className="panel-body">
              <div style={{ marginBottom: '1rem' }}>
                <div className="status-instruction-text">Rolle: {gameState.ownRole}Aktuelle Phase:</div>
                <div className="phase-description-text">
                  {gameState.phaseDescription}
                </div>
              </div>

              {!gameState.isAlive && !hasHunterShot && (
                <div className="dead-player-badge">
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💀</div>
                  <div style={{ color: 'var(--color-dead-gray)' }}>Du bist tot</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                    Verfolge das Spiel weiter
                  </div>
                </div>
              )}

              {gameState.lastInspection && (
                <div className="inspection-result-card">
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-seer-purple)', marginBottom: '0.5rem' }}>
                    🔮 Letzte Untersuchung:
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>
                    {gameState.lastInspection.username} ist {getRoleName(gameState.lastInspection.role)}
                  </div>
                </div>
              )}

              {gameState.ownRole === 'WITCH' && gameState.ownStateFlags && (
                <div style={{ marginTop: '1rem' }}>
                  <div className="status-instruction-text">Tränke:</div>
                  <div className="potion-grid">
                    <div className={`potion-display ${gameState.ownStateFlags.healPotion ? 'potion-available' : 'potion-used'}`}>
                      <div>🧪</div>
                      <div style={{ fontSize: '0.75rem' }}>Heilen {gameState.ownStateFlags.healPotion ? '✓' : '✗'}</div>
                    </div>
                    <div className={`potion-display ${gameState.ownStateFlags.poisonPotion ? 'potion-available' : 'potion-used'}`}>
                      <div>☠️</div>
                      <div style={{ fontSize: '0.75rem' }}>Gift {gameState.ownStateFlags.poisonPotion ? '✓' : '✗'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voting Panel */}
          {canAct && isVotingPhase && (
            <div className="game-panel voting-panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  {gameState.currentPhase === 'NIGHT_WOLVES' ? '🐺 Werwolf-Voting' : '⚖️ Lynch-Voting'}
                </h3>
              </div>
              <div className="panel-body">
                <div className="voting-content">
                  <div className="voting-list">
                    {availableTargets.map((player) => (
                      <div
                        key={player.playerId}
                        className={`voting-player-item ${selectedPlayer === player.playerId ? 'selected' : ''}`}
                        onClick={() => setSelectedPlayer(player.playerId)}
                      >
                        <div className="voting-player-avatar">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="voting-player-name">{player.username}</div>
                      </div>
                    ))}
                  </div>

                  <div className="voting-target-view">
                    {selectedPlayerData ? (
                      <>
                        <div className="target-avatar-large">
                          {selectedPlayerData.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="target-name">{selectedPlayerData.username}</div>
                        <button
                          className="target-action-btn"
                          onClick={() => {
                            if (gameState.currentPhase === 'NIGHT_WOLVES') {
                              handleAction('VOTE_WOLF_KILL' as ActionType, selectedPlayerData.playerId);
                            } else if (gameState.currentPhase === 'DAY_VOTING') {
                              handleAction('VOTE_LYNCH' as ActionType, selectedPlayerData.playerId);
                            }
                          }}
                        >
                          {gameState.currentPhase === 'NIGHT_WOLVES' ? (
                            <><span>🐺</span> Töten</>
                          ) : (
                            <><span>⚖️</span> Lynchen</>
                          )}
                        </button>
                      </>
                    ) : (
                      <div style={{ color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' }}>
                        Wähle dein Ziel
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seer Action */}
          {canAct && isSeerPhase && (
            <div className="game-panel voting-panel">
              <div className="panel-header">
                <h3 className="panel-title">🔮 Seher-Untersuchung</h3>
              </div>
              <div className="panel-body">
                <div className="voting-content">
                  <div className="voting-list">
                    {availableTargets.map((player) => (
                      <div
                        key={player.playerId}
                        className={`voting-player-item ${selectedPlayer === player.playerId ? 'selected' : ''}`}
                        onClick={() => setSelectedPlayer(player.playerId)}
                      >
                        <div className="voting-player-avatar">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="voting-player-name">{player.username}</div>
                      </div>
                    ))}
                  </div>

                  <div className="voting-target-view">
                    {selectedPlayerData ? (
                      <>
                        <div className="target-avatar-large">
                          {selectedPlayerData.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="target-name">{selectedPlayerData.username}</div>
                        <button
                          className="target-action-btn"
                          style={{ background: 'linear-gradient(135deg, var(--color-seer-purple), #8b7ee8)' }}
                          onClick={() => handleAction('SEER_INSPECT' as ActionType, selectedPlayerData.playerId)}
                        >
                          <span>🔮</span> Untersuchen
                        </button>
                      </>
                    ) : (
                      <div style={{ color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' }}>
                        Wähle einen Spieler
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Witch Actions */}
          {canAct && isWitchPhase && (
            <div className="game-panel" style={{ flex: 1 }}>
              <div className="panel-header">
                <h3 className="panel-title">🧪 Hexen-Tränke</h3>
              </div>
              <div className="panel-body">
                {wolfVictim && (
                  <div className="wolf-victim-card">
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-werewolf-red)', marginBottom: '0.5rem' }}>
                      ⚠️ Werwolf-Opfer:
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                      {wolfVictim.username}
                    </div>
                  </div>
                )}

                {gameState.availableActions?.includes('WITCH_HEAL' as ActionType) && (
                  <button
                    className="target-action-btn"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-witch-green), #00a88f)',
                      width: '100%',
                      marginBottom: '1rem'
                    }}
                    onClick={() => wolfVictim && handleAction('WITCH_HEAL' as ActionType, wolfVictim.playerId)}
                  >
                    <span>🧪</span> Heiltrank nutzen
                  </button>
                )}

                {gameState.availableActions?.includes('WITCH_POISON' as ActionType) && (
                  <div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                      Wähle ein Ziel für den Gifttrank:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {availableTargets.slice(0, 4).map((player) => (
                        <div
                          key={player.playerId}
                          className={`voting-player-item ${selectedPlayer === player.playerId ? 'selected' : ''}`}
                          onClick={() => setSelectedPlayer(player.playerId)}
                        >
                          <div className="voting-player-avatar">
                            {player.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="voting-player-name">{player.username}</div>
                        </div>
                      ))}
                    </div>
                    {selectedPlayer && (
                      <button
                        className="target-action-btn"
                        style={{ width: '100%' }}
                        onClick={() => handleAction('WITCH_POISON' as ActionType, selectedPlayer)}
                      >
                        <span>☠️</span> Gifttrank nutzen
                      </button>
                    )}
                  </div>
                )}

                {!gameState.availableActions?.includes('WITCH_HEAL' as ActionType) &&
                 !gameState.availableActions?.includes('WITCH_POISON' as ActionType) && (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '2rem' }}>
                    Keine Tränke mehr verfügbar
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hunter Shot */}
          {hasHunterShot && (
            <div className="game-panel voting-panel">
              <div className="panel-header">
                <h3 className="panel-title">🏹 Jäger-Rache</h3>
              </div>
              <div className="panel-body">
                <div className="hunter-alert-card">
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-hunter-orange)' }}>
                    Du wurdest getötet! Rache-Schuss verfügbar
                  </div>
                </div>

                <div className="voting-content">
                  <div className="voting-list">
                    {(gameState.players || []).filter(p => p.isAlive).map((player) => (
                      <div
                        key={player.playerId}
                        className={`voting-player-item ${selectedPlayer === player.playerId ? 'selected' : ''}`}
                        onClick={() => setSelectedPlayer(player.playerId)}
                      >
                        <div className="voting-player-avatar">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="voting-player-name">{player.username}</div>
                      </div>
                    ))}
                  </div>

                  <div className="voting-target-view">
                    {selectedPlayerData ? (
                      <>
                        <div className="target-avatar-large">
                          {selectedPlayerData.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="target-name">{selectedPlayerData.username}</div>
                        <button
                          className="target-action-btn"
                          style={{ background: 'linear-gradient(135deg, var(--color-hunter-orange), #ff7f26)' }}
                          onClick={() => handleAction('HUNTER_SHOOT' as ActionType, selectedPlayerData.playerId)}
                        >
                          <span>🏹</span> Erschießen
                        </button>
                      </>
                    ) : (
                      <div style={{ color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' }}>
                        Wähle dein Ziel
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Discussion Phase */}
          {isDiscussionPhase && gameState.isAlive && (
            <div className="game-panel" style={{ flex: 1 }}>
              <div className="panel-header">
                <h3 className="panel-title">💬 Diskussion</h3>
              </div>
              <div className="panel-body">
                <div className="discussion-content">
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>☀️</div>
                  <div style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
                    Diskutiert, wer verdächtig ist
                  </div>
                  <button
                    className="target-action-btn"
                    style={{ width: '100%' }}
                    onClick={handleTransitionToVoting}
                  >
                    <span>🗳️</span> Zur Abstimmung
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Waiting State */}
          {!canAct && !hasHunterShot && !isDiscussionPhase && gameState.isAlive && (
            <div className="game-panel" style={{ flex: 1 }}>
              <div className="panel-header">
                <h3 className="panel-title">⏳ Warten</h3>
              </div>
              <div className="panel-body">
                <div className="waiting-content">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                  <div>Andere Spieler sind an der Reihe</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Bitte warten...
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zone B: Stage Area (Center) */}
        <div className="game-zone zone-center">
          <div className="stage-card" style={{
            background: `linear-gradient(135deg, ${getRoleColor(gameState.ownRole)}, ${getRoleColor(gameState.ownRole)}dd)`
          }}>
            <div className="stage-card-icon">
              {getRoleEmoji(gameState.ownRole)}
            </div>
            <div className="stage-card-label">
              {getRoleName(gameState.ownRole)}
            </div>
            <div className="faction-badge">
              {gameState.ownFaction === 'WOLVES' ? '🐺 Werwölfe' : '🏘️ Dorf'}
            </div>
          </div>
        </div>

        {/* Zone C: Player Roster (Right) */}
        <div className="game-zone zone-right">
          <div className="game-panel player-roster-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                Spieler ({gameState.players?.filter(p => p.isAlive).length || 0}/{gameState.players?.length || 0})
              </h3>
            </div>
            <div className="panel-body">
              <div className="roster-list">
                {(gameState.players || [])
                  .sort((a, b) => a.seatNumber - b.seatNumber)
                  .map((player) => (
                    <div key={player.playerId} className={`roster-item ${!player.isAlive ? 'dead' : ''}`}>
                      <div className="roster-avatar">
                        {player.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="roster-info">
                        <div className="roster-name">{player.username}</div>
                        <div className="roster-status">
                          {!player.isAlive && <span>💀</span>}
                          {player.role && (
                            <span style={{ fontSize: '0.85rem', color: getRoleColor(player.role) }}>
                              {getRoleEmoji(player.role)} {player.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="game-panel chat-panel-wrapper">
            <ChatPanel gameId={gameState.gameId} currentPhase={gameState.currentPhase} isAlive={gameState.isAlive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;

