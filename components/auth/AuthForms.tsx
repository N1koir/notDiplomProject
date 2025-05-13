'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/app/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Login form schema
const loginSchema = z.object({
  login: z.string().min(1, { message: 'Логин обязателен' }),
  password: z.string().min(1, { message: 'Пароль обязателен' }),
});

// Registration form schema
const registerSchema = z.object({
  login: z
    .string()
    .min(1, { message: 'Логин обязателен' })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: 'Логин может содержать только буквы, цифры и символ подчеркивания' 
    }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Необходимо принять условия политики компании',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
}).refine(data => data.password !== data.login, {
  message: 'Пароль не должен совпадать с логином',
  path: ['password'],
});

// Recovery form schema
const recoverySchema = z.object({
  login: z.string().min(1, { message: 'Логин обязателен' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type RecoveryFormValues = z.infer<typeof recoverySchema>;

interface AuthFormsProps {
  onSuccess?: () => void;
}

export default function AuthForms({ onSuccess }: AuthFormsProps) {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { login, register, error, clearError, recoverAccount } = useAuth();
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      login: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  // Recovery form
  const recoveryForm = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      login: '',
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.login, data.password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  // Handle registration form submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data.login, data.password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  // Handle recovery form submission
  const onRecoverySubmit = async (data: RecoveryFormValues) => {
    try {
      await recoverAccount(data.login);
      setRecoverySuccess(true);
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  // Clear error when switching tabs
  const handleTabChange = (value: string) => {
    clearError();
    setActiveTab(value);
    setRecoverySuccess(false);
  };

  const handleDownloadTerms = () => {
    // Replace with your actual terms PDF URL
    const termsUrl = '/terms.pdf';
    window.open(termsUrl, '_blank');
  };

  return (
    <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="login">Вход</TabsTrigger>
        <TabsTrigger value="register">Регистрация</TabsTrigger>
        <TabsTrigger value="recovery">Восстановление</TabsTrigger>
      </TabsList>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <TabsContent value="login" className="py-4">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите логин" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Введите пароль" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="register" className="py-4">
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <FormField
              control={registerForm.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input placeholder="Придумайте логин" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
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
              control={registerForm.control}
              name="confirmPassword"
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

            <FormField
              control={registerForm.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Я ознакомлен и согласен с{' '}
                      <Button
                        variant="link"
                        className="h-auto p-0 text-primary"
                        onClick={handleDownloadTerms}
                      >
                        политикой компании
                      </Button>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={!registerForm.getValues('acceptTerms')}>
              Зарегистрироваться
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="recovery" className="py-4">
        {recoverySuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              Инструкции по восстановлению аккаунта отправлены на вашу почту
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...recoveryForm}>
            <form onSubmit={recoveryForm.handleSubmit(onRecoverySubmit)} className="space-y-4">
              <FormField
                control={recoveryForm.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Логин</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите логин" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Восстановить
              </Button>
            </form>
          </Form>
        )}
      </TabsContent>
    </Tabs>
  );
}