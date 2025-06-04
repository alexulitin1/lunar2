import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import Button from '../../shared/Button';
import { Send, Wind } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIChat: React.FC = () => {
  const { dispatch } = useAppState();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Привет! Чем могу помочь?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMsg: string) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    });
    if (!res.ok) throw new Error('Server error');
    const { reply } = await res.json();
    return reply;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    const userMessage: Message = { sender: 'user', text: userText };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await getAIResponse(userText);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Error in chat:', err);
      setError(err.message);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ Sorry, I encountered an error: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartBreathing = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-space-deep">
      <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: '160px' }}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-2 rounded-2xl
                  ${msg.sender === 'user'
                    ? 'bg-space-star text-space-deep rounded-br-sm'
                    : 'bg-space-navy text-space-gray rounded-bl-sm'}
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-space-deep border-t border-space-star/10 space-y-4">
        <div className="flex items-end gap-2">
          <textarea
            className="flex-1 px-4 py-2 rounded-xl bg-space-navy text-space-gray placeholder-space-gray/50 resize-none focus:outline-none focus:ring-2 focus:ring-space-star"
            placeholder="Введите сообщение..."
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="h-11 w-11 !p-0 flex items-center justify-center"
          >
            <Send size={20} />
          </Button>
        </div>
        <Button
          onClick={handleStartBreathing}
          variant="secondary"
          fullWidth
          className="flex items-center justify-center gap-2"
        >
          <Wind size={20} />
          <span>Начать вечернее дыхание</span>
        </Button>
      </div>
    </div>
  );
};

export default AIChat;