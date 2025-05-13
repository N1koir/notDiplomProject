'use client';

import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';

interface LogoutDialogProps {
  onClose: () => void;
}

export default function LogoutDialog({ onClose }: LogoutDialogProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-lg">
        Вы уверены, что хотите выйти из системы?
      </p>
      
      <div className="flex space-x-4 justify-center">
        <Button 
          variant="outline"
          onClick={onClose}
          className="w-32"
        >
          Отмена
        </Button>
        
        <Button 
          variant="destructive"
          onClick={handleLogout}
          className="w-32"
        >
          Выйти
        </Button>
      </div>
    </div>
  );
}