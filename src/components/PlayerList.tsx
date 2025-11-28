import { Card } from 'react-bootstrap';
import type { PlayerInfo, GamePhase, RoleName } from '../types';
import './PlayerList.css';

const ROLE_NAMES: Record<RoleName, string> = {
  WEREWOLF: '🐺 Werwolf',
  VILLAGER: '👤 Dorfbewohner',
  SEER: '🔮 Seher',
  WITCH: '🧪 Hexe',
  HUNTER: '🏹 Jäger'
};

interface PlayerListProps {
  players?: PlayerInfo[];
  currentPhase: GamePhase;
  ownRole?: RoleName;
}

const PlayerList = ({ players }: PlayerListProps) => {
  if (!players || !Array.isArray(players)) {
    return (
      <div className="player-list">
        <Card>
          <Card.Body>
            <div className="player-list-header">
              <h4 style={{ margin: 0 }}>👥 Spieler</h4>
            </div>
            <div className="player-list-empty">Keine Spieler gefunden</div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => a.seatNumber - b.seatNumber);
  const aliveCount = sortedPlayers.filter(p => p.isAlive).length;

  return (
    <div className="player-list">
      <Card>
        <Card.Body>
          <div className="player-list-header">
            <h4 style={{ margin: 0 }}>👥 Spieler</h4>
            <div className="player-count">
              ❤️ {aliveCount}/{sortedPlayers.length}
            </div>
          </div>

          <div>
            {sortedPlayers.map((player) => (
              <div
                key={player.playerId}
                className={`player-item ${!player.isAlive ? 'dead' : ''}`}
              >
                <div className="player-main-info">
                  <div className="player-seat">
                    {player.seatNumber}
                  </div>
                  <div className="player-details">
                    <div className="player-name">
                      {player.username}
                    </div>
                    <div className="player-status">
                      {!player.isAlive && (
                        <span className="status-icon">💀</span>
                      )}
                      {player.role && (
                        <div className={`player-role role-${player.role.toLowerCase()}`}>
                          {ROLE_NAMES[player.role] || player.role}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PlayerList;

