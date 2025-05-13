'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/context/AuthContext';
import { Lightbulb, Users, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleStartLearning = () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Для начала обучения необходимо войти в систему",
        variant: "destructive",
      });
      return;
    }
    router.push('/courses');
  };

  const handleCreateCourse = () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Для создания курса необходимо войти в систему",
        variant: "destructive",
      });
      return;
    }
    router.push('/create-course');
  };
  
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-600 dark:bg-orange-800/30 dark:text-orange-400">
              Универсальная платформа образования
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Создавайте и изучайте курсы на Knowledge<span className="text-orange-500">+</span>
            </h1>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Наша платформа объединяет экспертов и учащихся из различных областей. Создавайте, делитесь и изучайте материалы в удобном формате.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition-all shadow-lg"
                onClick={handleStartLearning}
              >
                Начать обучение
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleCreateCourse}
              >
                Создать курс
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="grid gap-6">
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <Lightbulb className="h-10 w-10 text-orange-500" />
                    <div>
                      <h3 className="font-semibold">Обучение</h3>
                      <p className="text-sm text-muted-foreground">
                        Доступ к качественным материалам
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <Users className="h-10 w-10 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">Сообщество</h3>
                      <p className="text-sm text-muted-foreground">
                        Взаимодействие с экспертами
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 lg:mt-10">
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Проверка знаний</h3>
                      <p className="text-sm text-muted-foreground">
                        Практические задания для закрепления
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10 text-purple-500"
                    >
                      <path d="M8.9 7.56a6.44 6.44 0 0 1 6.16 6.44" />
                      <path d="M20 11v4h-4a8 8 0 1 1-4.42-7.15" />
                    </svg>
                    <div>
                      <h3 className="font-semibold">Обратная связь</h3>
                      <p className="text-sm text-muted-foreground">
                        Мгновенные отзывы от учащихся
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}