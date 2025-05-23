'use client';

import { useState } from 'react';
import { useCourse } from '@/app/context/CourseContext';
import CourseGrid from '@/components/course/CourseGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { fetchCourses, courseState } = useCourse();

  const handleSearch = () => {
    fetchCourses({ search: query });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Поиск курсов</h1>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Введите название курса..."
              className="pl-10 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            Найти
          </Button>
        </div>
        
        <div className="pt-6">
          <h2 className="text-xl font-semibold mb-4">
            {query && !courseState.loading
              ? `Результаты поиска для "${query}"`
              : 'Все курсы'}
          </h2>
          <CourseGrid />
        </div>
      </div>
    </div>
  );
}