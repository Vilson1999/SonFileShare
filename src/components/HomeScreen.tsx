import React from 'react';
import { Send as SendIcon, Download as ReceiveIcon } from 'lucide-react';

interface HomeScreenProps {
  onStartSend: () => void;
  onStartReceive: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSend,
  onStartReceive,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center flex-1 py-8 px-4">
      {/* ONLY SEND AND RECEIVE BIG CIRCLE BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
        
        {/* BIG CIRCLE BUTTON: SEND */}
        <div className="flex flex-col items-center group">
          <button
            onClick={onStartSend}
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-xl shadow-teal-600/30 hover:shadow-2xl hover:shadow-teal-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-400/40"
            aria-label="Send"
          >
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:scale-110 group-hover:opacity-100 opacity-0 transition-all duration-300 pointer-events-none" />
            
            <div className="p-3.5 rounded-full bg-white/15 backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300 mb-2">
              <SendIcon className="w-9 h-9 sm:w-11 sm:h-11 ml-0.5" />
            </div>

            <span className="text-2xl sm:text-3xl font-black tracking-wide text-white drop-shadow-sm">
              Send
            </span>
          </button>
        </div>

        {/* BIG CIRCLE BUTTON: RECEIVE */}
        <div className="flex flex-col items-center group">
          <button
            onClick={onStartReceive}
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-cyan-700 via-teal-600 to-cyan-500 text-white shadow-xl shadow-cyan-600/30 hover:shadow-2xl hover:shadow-cyan-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-400/40"
            aria-label="Receive"
          >
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:scale-110 group-hover:opacity-100 opacity-0 transition-all duration-300 pointer-events-none" />

            <div className="p-3.5 rounded-full bg-white/15 backdrop-blur-sm group-hover:-translate-y-1 transition-transform duration-300 mb-2">
              <ReceiveIcon className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <span className="text-2xl sm:text-3xl font-black tracking-wide text-white drop-shadow-sm">
              Receive
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
