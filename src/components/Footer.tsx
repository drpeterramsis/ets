import { LogOut } from 'lucide-react';

interface FooterProps {
  onLogout?: () => void;
  showLogout?: boolean;
}

export const Footer = ({ onLogout, showLogout }: FooterProps) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 bg-black dark:bg-[#1a1a1a] border-t border-[rgba(255,192,0,0.3)] flex items-center justify-between px-6 z-[999]">
      <div className="text-[11px] text-[rgba(255,192,0,0.6)] font-medium">
        Developed by Dr. Peter Ramsis | Training Dept
      </div>

      <div className="text-[11px] text-[rgba(255,192,0,0.4)] font-medium">
        v1.0.007
      </div>

      <div className="flex items-center">
        {showLogout && onLogout && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffc000] text-black font-bold text-[13px] rounded-full hover:bg-[#e6ac00] hover:scale-[1.03] transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        )}
      </div>
    </footer>
  );
};
