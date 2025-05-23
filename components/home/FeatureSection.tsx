'use client';

import { BookOpen, Sparkles, Clock, DollarSign } from 'lucide-react';

export default function FeatureSection() {
  return (
    <section className="py-10 md:py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Преимущества платформы</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Knowledge+ предоставляет широкие возможности для создания и изучения
            образовательных материалов
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm transition-all hover:shadow-md">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <BookOpen className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Богатый формат</h3>
            <p className="text-muted-foreground">
              Создавайте материалы с использованием Markdown, добавляйте изображения и видео
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm transition-all hover:shadow-md">
            <div className="bg-orange-100 p-3 rounded-full mb-4">
              <Sparkles className="text-orange-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Современный редактор</h3>
            <p className="text-muted-foreground">
              Удобный интерфейс для создания контента с предпросмотром в реальном времени
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm transition-all hover:shadow-md">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Clock className="text-blue-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Учитесь в своем темпе</h3>
            <p className="text-muted-foreground">
              Доступ к материалам 24/7, изучайте в удобное для вас время
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm transition-all hover:shadow-md">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <DollarSign className="text-green-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Монетизация</h3>
            <p className="text-muted-foreground">
              Создавайте бесплатные или платные курсы и делитесь своими знаниями
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}