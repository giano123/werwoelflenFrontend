import { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { gameAPI } from '../services/api';
import type { GameState, ActionType, PlayerInfo, WolfVictim } from '../types';
import './ActionPanel.css';

const PHASE_DESCRIPTIONS: Record<string, string> = {
  NIGHT_WOLVES: 'Werwölfe, wählt euer Opfer',
  NIGHT_SEER: 'Seher, untersuche einen Spieler',
  NIGHT_WITCH: 'Hexe, nutze deine Tränke oder überspringe',
  DAY_DISCUSSION: 'Diskutiert, wer verdächtig ist',
  DAY_VOTING: 'Stimmt ab, wen ihr lynchen wollt',
};

interface ActionPanelProps {
  gameState: GameState;
  onAction: (actionType: ActionType, targetPlayerId: number) => Promise<void>;
  onTransitionToVoting: () => Promise<void>;
}

const ActionPanel = ({ gameState, onAction, onTransitionToVoting }: ActionPanelProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [wolfVictim, setWolfVictim] = useState<WolfVictim | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  useEffect(() => {
    if (gameState.currentPhase === 'NIGHT_WITCH' && gameState.ownRole === 'WITCH') {
      loadWolfVictim();
    }
  }, [gameState.currentPhase, gameState.gameId]);

  useEffect(() => {
    setHasVoted(false);
  }, [gameState.currentPhase, gameState.dayNumber]);

  const loadWolfVictim = async (): Promise<void> => {
    try {
      const response = await gameAPI.getWolfVictim(gameState.gameId);
      setWolfVictim(response.data);
    } catch (error) {
      console.error('Fehler beim Laden des Opfers', error);
    }
  };

  const handleSubmitAction = async (actionType: ActionType): Promise<void> => {
    if (actionType === 'WITCH_HEAL' && wolfVictim) {
      await onAction(actionType, wolfVictim.playerId);
    } else if (selectedPlayer) {
      await onAction(actionType, selectedPlayer);
    }

    if (actionType === 'VOTE_LYNCH' || actionType === 'VOTE_WOLF_KILL') {
      setHasVoted(true);
    }

    setSelectedPlayer(null);
  };

  const availableTargets: PlayerInfo[] = (gameState.players || []).filter(p => {
    if (!p.isAlive) return false;

    if (gameState.currentPhase === 'NIGHT_WOLVES' && gameState.ownRole === 'WEREWOLF') {
      return p.role !== 'WEREWOLF';
    }

    return true;
  });

  const canAct = gameState.isAlive && (gameState.availableActions?.length ?? 0) > 0;

  if (!gameState.isAlive && !gameState.ownStateFlags?.hunterShotAvailable) {
    return (
      <div className="action-panel">
        <Card>
          <Card.Body>
            <div className="waiting-state">
              <div className="waiting-spinner">💀</div>
              <div className="waiting-message">Du bist gestorben</div>
              <div className="waiting-hint">
                Du kannst das Spiel weiter verfolgen, aber nicht mehr aktiv teilnehmen.
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="action-panel">
      <Card>
        <Card.Body>
          <div className="action-header">
            <div className="action-title">
              {PHASE_DESCRIPTIONS[gameState.currentPhase] || 'Warte auf nächste Phase'}
            </div>
          </div>
        {gameState.isAlive && gameState.currentPhase === 'DAY_DISCUSSION' && (
          <div>
            <div className="action-instructions">
              <p>💬 Nutze den Chat, um mit anderen Spielern zu diskutieren und Verdächtige zu identifizieren.</p>
            </div>
            <div className="action-buttons">
              <button
                className="action-button btn btn-primary"
                onClick={onTransitionToVoting}
              >
                🗳️ Zur Abstimmung übergehen
              </button>
            </div>
          </div>
        )}

        {gameState.isAlive && gameState.currentPhase === 'NIGHT_WITCH' && gameState.ownRole === 'WITCH' && wolfVictim && (
          <div className="wolf-victim-alert">
            <h5>⚠️ Werwolf-Opfer erkannt</h5>
            <p className="victim-name">{wolfVictim.username}</p>
          </div>
        )}

        {canAct && gameState.isAlive && gameState.availableActions?.includes('VOTE_WOLF_KILL' as ActionType) && gameState.ownRole === 'WEREWOLF' && !hasVoted && (
          <div>
            <div className="action-instructions warning">
              <p>🐺 Wähle gemeinsam mit den anderen Werwölfen ein Opfer für diese Nacht.</p>
            </div>
            <div className="target-selection">
              <div className="target-grid">
                {availableTargets.map(player => (
                  <div
                    key={player.playerId}
                    className={`target-card ${selectedPlayer === player.playerId ? 'selected' : ''}`}
                    onClick={() => setSelectedPlayer(player.playerId)}
                  >
                    <div className="target-header">
                      <div className="target-seat">{player.seatNumber}</div>
                      <div className="target-status">👤</div>
                    </div>
                    <div className="target-name">{player.username}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-buttons">
              <button
                className="action-button btn btn-danger"
                onClick={() => handleSubmitAction('VOTE_WOLF_KILL' as ActionType)}
                disabled={!selectedPlayer}
              >
                🐺 Töten

              </button>
            </div>
          </div>
        )}

        {gameState.isAlive && gameState.currentPhase === 'NIGHT_WOLVES' && hasVoted && gameState.ownRole === 'WEREWOLF' && (
          <div className="waiting-state">
            <div className="waiting-spinner">🐺</div>
            <div className="waiting-message">Du hast abgestimmt</div>
            <div className="waiting-hint">
              Warte, bis alle Werwölfe ihre Stimme abgegeben haben.
            </div>
          </div>
        )}

        {canAct && gameState.isAlive && gameState.availableActions?.includes('VOTE_LYNCH' as ActionType) && !hasVoted && (
          <div>
            <div className="action-instructions">
              <p>🗳️ Stimme ab, welcher Spieler gelyncht werden soll.</p>
            </div>
            <div className="target-selection">
              <div className="target-grid">
                {availableTargets.map(player => (
                  <div
                    key={player.playerId}
                    className={`target-card ${selectedPlayer === player.playerId ? 'selected' : ''}`}
                    onClick={() => setSelectedPlayer(player.playerId)}
                  >
                    <div className="target-header">
                      <div className="target-seat">{player.seatNumber}</div>
                      <div className="target-status">👤</div>
                    </div>
                    <div className="target-name">{player.username}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-buttons">
              <button
                className="action-button btn btn-warning"
                onClick={() => handleSubmitAction('VOTE_LYNCH' as ActionType)}
                disabled={!selectedPlayer}
              >
                ⚖️ Lynchen
              </button>
            </div>
          </div>
        )}

        {gameState.isAlive && gameState.currentPhase === 'DAY_VOTING' && hasVoted && (
          <div className="waiting-state">
            <div className="waiting-spinner">🗳️</div>
            <div className="waiting-message">Du hast abgestimmt</div>
            <div className="waiting-hint">
              Warte, bis alle anderen Spieler ihre Stimme abgegeben haben.
            </div>
          </div>
        )}

        {canAct && gameState.isAlive && gameState.availableActions?.includes('SEER_INSPECT' as ActionType) && (
          <div>
            <h6>Wähle einen Spieler zum Untersuchen:</h6>
            <ListGroup className="mb-3">
              {availableTargets.map(player => (
                <ListGroup.Item
                  key={player.playerId}
                  active={selectedPlayer === player.playerId}
                  onClick={() => setSelectedPlayer(player.playerId)}
                  style={{ cursor: 'pointer' }}
                >
                  #{player.seatNumber} {player.username}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              variant="info"
              onClick={() => handleSubmitAction('SEER_INSPECT' as ActionType)}
              disabled={!selectedPlayer}
            >
              Untersuchen
            </Button>
          </div>
        )}

        {canAct && gameState.isAlive && gameState.availableActions?.includes('WITCH_HEAL' as ActionType) && (
          <div className="mb-2">
            <Button
              variant="success"
              onClick={() => handleSubmitAction('WITCH_HEAL' as ActionType)}
              className="w-100"
            >
              💚 Heiltrank nutzen (Opfer retten)
            </Button>
          </div>
        )}

        {canAct && gameState.isAlive && gameState.availableActions?.includes('WITCH_POISON' as ActionType) && (
          <div>
            <h6>Wähle ein Ziel für den Gifttrank:</h6>
            <ListGroup className="mb-3">
              {availableTargets.map(player => (
                <ListGroup.Item
                  key={player.playerId}
                  active={selectedPlayer === player.playerId}
                  onClick={() => setSelectedPlayer(player.playerId)}
                  style={{ cursor: 'pointer' }}
                >
                  #{player.seatNumber} {player.username}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              variant="danger"
              onClick={() => handleSubmitAction('WITCH_POISON' as ActionType)}
              disabled={!selectedPlayer}
            >
              ☠️ Gifttrank nutzen
            </Button>
          </div>
        )}

        {gameState.ownStateFlags?.hunterShotAvailable && (
          <div>
            <Alert variant="danger">
              <strong>Du wurdest getötet! Als Jäger kannst du einen Rache-Schuss abgeben.</strong>
            </Alert>
            <h6>Wähle dein Ziel:</h6>
            <ListGroup className="mb-3">
              {(gameState.players || []).filter(p => p.isAlive).map(player => (
                <ListGroup.Item
                  key={player.playerId}
                  active={selectedPlayer === player.playerId}
                  onClick={() => setSelectedPlayer(player.playerId)}
                  style={{ cursor: 'pointer' }}
                >
                  #{player.seatNumber} {player.username}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              variant="danger"
              onClick={() => handleSubmitAction('HUNTER_SHOOT' as ActionType)}
              disabled={!selectedPlayer}
            >
              🏹 Erschießen
            </Button>
          </div>
        )}

        {!canAct && !gameState.ownStateFlags?.hunterShotAvailable && gameState.currentPhase !== 'DAY_DISCUSSION' && (
          <div className="waiting-state">
            <div className="waiting-spinner">⏳</div>
            <div className="waiting-message">Warte...</div>
            <div className="waiting-hint">
              Andere Spieler sind an der Reihe oder die Phase wechselt gleich.
            </div>
          </div>
        )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ActionPanel;

