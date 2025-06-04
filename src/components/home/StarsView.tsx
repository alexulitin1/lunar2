import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Button from '../shared/Button';
import { Star, Users, MessageSquare } from 'lucide-react';
import BottomNavigation from './BottomNavigation';

const StarsView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [inviteSent, setInviteSent] = useState(false);
  const [channelSubscribed, setChannelSubscribed] = useState(false);
  
  const handleInviteFriend = () => {
    setInviteSent(true);
    dispatch({ type: 'ADD_STARS', payload: 10 });
  };
  
  const handleSubscribeChannel = () => {
    setChannelSubscribed(true);
    dispatch({ type: 'ADD_STARS', payload: 5 });
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-4">
        <div className="flex justify-center mb-6">
          <div className="flex items-center bg-[#475569]/20 py-2 px-4 rounded-full">
            <Star size={20} className="text-[#F59E0B] mr-2" />
            <span className="text-xl font-bold text-[#E2E8F0]">{state.starBalance}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#0F172A] rounded-xl border border-[#475569]/20 p-4">
            <div className="flex items-start">
              <Users className="flex-shrink-0 w-8 h-8 text-[#3B82F6] mr-4" />
              <div className="flex-1">
                <h3 className="font-medium text-[#E2E8F0] mb-2">Пригласить друга</h3>
                <p className="text-[#E2E8F0]/70 text-sm mb-3">
                  Пригласите друга и получите 10 звёзд
                </p>
                <Button 
                  onClick={handleInviteFriend}
                  disabled={inviteSent}
                  fullWidth
                >
                  {inviteSent ? 'Приглашение отправлено' : 'Пригласить'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0F172A] rounded-xl border border-[#475569]/20 p-4">
            <div className="flex items-start">
              <MessageSquare className="flex-shrink-0 w-8 h-8 text-[#8B5CF6] mr-4" />
              <div className="flex-1">
                <h3 className="font-medium text-[#E2E8F0] mb-2">Подписаться на канал</h3>
                <p className="text-[#E2E8F0]/70 text-sm mb-3">
                  Подпишитесь на наш канал и получите 5 звёзд
                </p>
                <Button 
                  onClick={handleSubscribeChannel}
                  disabled={channelSubscribed}
                  variant="secondary"
                  fullWidth
                >
                  {channelSubscribed ? 'Вы подписаны' : 'Подписаться'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default StarsView;