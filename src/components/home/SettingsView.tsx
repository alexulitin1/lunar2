import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { X, Percent, Star } from 'lucide-react';
import Button from '../shared/Button';
import BottomNavigation from './BottomNavigation';

interface Product {
  id: number;
  title: string;
  desc: string;
  price: number;
  image: string;
  promoCode: string;
}

const products: Product[] = [
  { 
    id: 1, 
    title: 'Ароматические свечи', 
    desc: 'Набор из 3 свечей для медитации', 
    price: 2990,
    image: 'https://images.pexels.com/photos/4195500/pexels-photo-4195500.jpeg',
    promoCode: 'LUNAR20-CANDLE'
  },
  { 
    id: 2, 
    title: 'Благовония', 
    desc: 'Набор премиальных благовоний', 
    price: 1490,
    image: 'https://images.pexels.com/photos/4195606/pexels-photo-4195606.jpeg',
    promoCode: 'LUNAR20-INCENSE'
  },
  { 
    id: 3, 
    title: 'Поющая чаша', 
    desc: 'Тибетская поющая чаша', 
    price: 4990,
    image: 'https://images.pexels.com/photos/6865180/pexels-photo-6865180.jpeg',
    promoCode: 'LUNAR20-BOWL'
  },
  { 
    id: 4, 
    title: 'Подушка для медитации', 
    desc: 'Подушка для осанки', 
    price: 3490,
    image: 'https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg',
    promoCode: 'LUNAR20-CUSHION'
  },
];

const DISCOUNT_STARS_REQUIRED = 10;

const SettingsView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGetDiscount = async (product: Product) => {
    if (isProcessing) return;
    
    if (state.starBalance < DISCOUNT_STARS_REQUIRED || !window.Telegram?.WebApp) {
      return;
    }

    setIsProcessing(true);
    console.log('⭐ Списание звёзд:', DISCOUNT_STARS_REQUIRED);

    try {
      dispatch({ type: 'ADD_STARS', payload: -DISCOUNT_STARS_REQUIRED });
      
      console.log('🔔 Отправка промокода:', product.promoCode);
      
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: 'PROMO_CODE',
        promoCode: product.promoCode,
        productId: product.id,
        productTitle: product.title,
        starsUsed: DISCOUNT_STARS_REQUIRED
      }));

      setSelectedProduct(null);
    } catch (error) {
      console.error('Error sending promo code:', error);
      dispatch({ type: 'ADD_STARS', payload: DISCOUNT_STARS_REQUIRED });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyProduct = (product: Product) => {
    if (!window.Telegram?.WebApp) return;

    try {
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: 'BUY_PRODUCT',
        productId: product.id,
        productTitle: product.title,
        price: product.price
      }));
      
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error sending buy request:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-3 p-3">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-[#1E293B] rounded-xl overflow-hidden cursor-pointer hover:bg-[#334155] transition"
              onClick={() => setSelectedProduct(product)}
            >
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-24 object-cover"
              />
              <div className="p-2">
                <h3 className="text-[#E2E8F0] font-medium text-sm line-clamp-1">{product.title}</h3>
                <p className="text-[#E2E8F0]/70 text-xs">
                  {product.price.toLocaleString()} ₽
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F172A] rounded-xl w-full max-w-sm overflow-hidden">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.title} 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg text-[#E2E8F0] font-medium mb-1">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-[#E2E8F0]/70 text-sm">
                    {selectedProduct.desc}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-[#E2E8F0]/50 hover:text-[#E2E8F0]"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-medium text-[#E2E8F0]">
                  {selectedProduct.price.toLocaleString()} ₽
                </p>
                <div className="flex items-center text-[#E2E8F0]/70">
                  <Star size={16} className="mr-1" />
                  <span>{state.starBalance}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleGetDiscount(selectedProduct)}
                  disabled={state.starBalance < DISCOUNT_STARS_REQUIRED || isProcessing}
                  variant="secondary"
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <Percent size={16} />
                  <span>
                    {isProcessing 
                      ? 'Обработка...'
                      : state.starBalance >= DISCOUNT_STARS_REQUIRED 
                        ? 'Получить скидку 20% за 10 звезд'
                        : `Нужно 10 звезд для скидки 20%`}
                  </span>
                </Button>

                <Button
                  onClick={() => handleBuyProduct(selectedProduct)}
                  fullWidth
                >
                  Купить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;