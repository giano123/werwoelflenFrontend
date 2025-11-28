import { useState, useEffect, useRef, FormEvent } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';
import { gameAPI } from '../services/api';
import type { ChatMessage, GamePhase } from '../types';
import './ChatPanel.css';

interface ChatPanelProps {
  gameId: number;
  currentPhase: GamePhase;
}

const ChatPanel = ({ gameId, currentPhase }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [gameId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (): Promise<void> => {
    if (!gameId) return;

    try {
      const response = await gameAPI.getChat(gameId, lastMessageId?.toString());
      if (response.data.length > 0) {
        setMessages(prev => [...prev, ...response.data]);
        setLastMessageId(response.data[response.data.length - 1].id);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten', error);
    }
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!gameId || !inputMessage.trim()) return;

    try {
      await gameAPI.sendChat(gameId, inputMessage);
      setInputMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht', error);
    }
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const canChat = currentPhase === 'DAY_DISCUSSION' || currentPhase === 'DAY_VOTING' ||
                  (currentPhase && currentPhase.startsWith('NIGHT'));

  return (
    <div className="chat-panel">
      <Card>
        <Card.Body>
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-icon">💬</span>
              <span>Chat</span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty-icon">💭</div>
                <div>Noch keine Nachrichten</div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${msg.channel === 'SYSTEM' ? 'system' : ''}`}
                >
                  {msg.channel !== 'SYSTEM' && (
                    <div className="message-header">
                      <span className="message-sender">{msg.senderUsername}</span>
                      <span className="message-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="message-content">{msg.content}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {canChat ? (
            <div className="chat-input-container">
              <Form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Schreibe eine Nachricht..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit" className="chat-send-button">
                  <span>📤</span>
                  <span>Senden</span>
                </button>
              </Form>
            </div>
          ) : (
            <div className="chat-disabled">
              Chat ist in dieser Phase nicht verfügbar
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChatPanel;

