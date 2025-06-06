/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void;
      expand: () => void;
      sendData: (data: string) => void;
    };
  };
}