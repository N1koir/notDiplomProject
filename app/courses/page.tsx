'use client';

import { useState, useEffect } from 'react';
import { useCourse } from '@/app/context/CourseContext';
import { categoryService, levelService, ageService } from '@/app/api/apiService';
import CourseGrid from '@/components/course/CourseGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';

export default function CoursesPage() {
  const { fetchCourses } = useCourse();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [ageRestrictions, setAgeRestrictions] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    age: '',
    price: '',
  });

  useEffect(() => {
    // Load filter options
    const loadFilterOptions = async () => {
      try {
        const [categoriesData, levelsData, ageData] = await Promise.all([
          categoryService.getCategories(),
          levelService.getLevels(),
          ageService.getAgeRestrictions()
        ]);
        
        setCategories(categoriesData || []);
        setLevels(levelsData || []);
        setAgeRestrictions(ageData || []);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };
    
    loadFilterOptions();
  }, []);

  const handleSearch = () => {
    const queryParams = {
      search,
      ...filters
    };
    
    fetchCourses(queryParams);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      level: '',
      age: '',
      price: '',
    });
    setSearch('');
    fetchCourses();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Курсы</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск курсов..."
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <Button onClick={handleSearch}>
              Поиск
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Фильтры
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                  <SheetDescription>
                    Настройте параметры поиска курсов
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => handleFilterChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Все категории</SelectItem>
                        {categories.map(cat => (
                          <SelectItem 
                            key={cat.idCategory} 
                            value={cat.idCategory.toString()}
                          >
                            {cat.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level">Уровень сложности</Label>
                    <Select
                      value={filters.level}
                      onValueChange={(value) => handleFilterChange('level', value)}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Выберите уровень" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Все уровни</SelectItem>
                        {levels.map(level => (
                          <SelectItem 
                            key={level.idLevelKnowledge} 
                            value={level.idLevelKnowledge.toString()}
                          >
                            {level.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Возрастное ограничение</Label>
                    <Select
                      value={filters.age}
                      onValueChange={(value) => handleFilterChange('age', value)}
                    >
                      <SelectTrigger id="age">
                        <SelectValue placeholder="Выберите ограничение" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Все ограничения</SelectItem>
                        {ageRestrictions.map(age => (
                          <SelectItem 
                            key={age.idAgePeople} 
                            value={age.idAgePeople.toString()}
                          >
                            {age.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Стоимость</Label>
                    <Select
                      value={filters.price}
                      onValueChange={(value) => handleFilterChange('price', value)}
                    >
                      <SelectTrigger id="price">
                        <SelectValue placeholder="Выберите стоимость" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Все курсы</SelectItem>
                        <SelectItem value="free">Бесплатные</SelectItem>
                        <SelectItem value="paid">Платные</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <SheetFooter>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="w-full sm:w-auto"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Сбросить
                  </Button>
                  <Button 
                    onClick={() => {
                      handleSearch();
                    }}
                    className="w-full sm:w-auto"
                  >
                    Применить
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="mt-6">
          <CourseGrid />
        </div>
      </div>
    </div>
  );
}