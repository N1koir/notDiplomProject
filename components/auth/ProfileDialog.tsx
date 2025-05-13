'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const passwordChangeSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmNewPassword'],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface ProfileDialogProps {
  onClose: () => void;
}

export default function ProfileDialog({ onClose }: ProfileDialogProps) {
  const { user, changePassword, error } = useAuth();
  const [success, setSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChangeFormValues) => {
    try {
      await changePassword(data.newPassword);
      setSuccess(true);
      setIsChangingPassword(false);
      form.reset();
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Пароль успешно изменен
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Информация об аккаунте</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Логин:</p>
            <p className="font-medium">{user?.login}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Пароль:</p>
            <p className="font-medium">••••••••</p>
          </div>
        </div>
      </div>
      
      {!isChangingPassword ? (
        <Button 
          onClick={() => setIsChangingPassword(true)}
          className="w-full"
        >
          Изменить пароль
        </Button>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Минимум 6 символов" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтверждение пароля</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Повторите пароль" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  form.reset();
                }}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button type="submit" className="flex-1">
                Сохранить
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      <div className="border-t pt-4">
        <Button 
          onClick={onClose}
          variant="ghost" 
          className="w-full"
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
}