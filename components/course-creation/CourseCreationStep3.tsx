'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CourseCreationStep3Props {
  courseData: {
    monetizationType: string;
    price: string;
    category: string;
    ageRestriction: string;
    level: string;
  };
  updateCourseData: (data: Partial<typeof courseData>) => void;
  categories: any[];
  levels: any[];
  ageRestrictions: any[];
  monetizationTypes: any[];
  onPrev: () => void;
  onSubmit: () => void;
}

export default function CourseCreationStep3({
  courseData,
  updateCourseData,
  categories,
  levels,
  ageRestrictions,
  monetizationTypes,
  onPrev,
  onSubmit
}: CourseCreationStep3Props) {
  const [isPaid, setIsPaid] = useState(courseData.monetizationType === '1');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    // Set default values if not already set
    if (!courseData.monetizationType && monetizationTypes.length > 0) {
      updateCourseData({ monetizationType: '2' }); // Default to free
    }
    
    if (!courseData.category && categories.length > 0) {
      updateCourseData({ category: categories[0].idCategory.toString() });
    }
    
    if (!courseData.level && levels.length > 0) {
      updateCourseData({ level: levels[0].idLevelKnowledge.toString() });
    }
    
    if (!courseData.ageRestriction && ageRestrictions.length > 0) {
      updateCourseData({ ageRestriction: ageRestrictions[0].idAgePeople.toString() });
    }
  }, [categories, levels, ageRestrictions, monetizationTypes, courseData, updateCourseData]);

  const handleMonetizationChange = (value: string) => {
    const isPaidValue = value === '1';
    setIsPaid(isPaidValue);
    updateCourseData({ monetizationType: value });
    
    // Reset price if switching to free
    if (!isPaidValue) {
      updateCourseData({ price: '' });
      setPriceError('');
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    updateCourseData({ price: value });
    
    // Validate price range
    const numValue = parseInt(value, 10);
    if (!value) {
      setPriceError('Стоимость обязательна для платного курса');
    } else if (numValue < 1000) {
      setPriceError('Минимальная стоимость: 1000');
    } else if (numValue > 20000) {
      setPriceError('Максимальная стоимость: 20000');
    } else {
      setPriceError('');
    }
  };

  const handleSubmitClick = () => {
    // Validate before submission
    if (isPaid) {
      const price = parseInt(courseData.price, 10);
      if (!courseData.price || isNaN(price)) {
        setPriceError('Стоимость обязательна для платного курса');
        return;
      }
      
      if (price < 1000 || price > 20000) {
        setPriceError('Стоимость должна быть от 1000 до 20000');
        return;
      }
    }
    
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Тип доступа</h3>
        
        <RadioGroup
          value={courseData.monetizationType}
          onValueChange={handleMonetizationChange}
          className="space-y-3"
        >
          {monetizationTypes.map((type: any) => (
            <div key={type.idMonetizationStatus} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={type.idMonetizationStatus.toString()} 
                id={`monetization-${type.idMonetizationStatus}`} 
              />
              <Label htmlFor={`monetization-${type.idMonetizationStatus}`}>
                {type.type}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {isPaid && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="price">
              Стоимость <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="text"
                value={courseData.price}
                onChange={handlePriceChange}
                placeholder="Введите стоимость (от 1000 до 20000)"
                className={priceError ? 'border-destructive pr-12' : 'pr-12'}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-muted-foreground">₽</span>
              </div>
            </div>
            {priceError && <p className="text-sm text-destructive">{priceError}</p>}
          </div>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Категория</Label>
          <Select
            value={courseData.category}
            onValueChange={(value) => updateCourseData({ category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: any) => (
                <SelectItem 
                  key={category.idCategory} 
                  value={category.idCategory.toString()}
                >
                  {category.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="level">Уровень сложности</Label>
          <Select
            value={courseData.level}
            onValueChange={(value) => updateCourseData({ level: value })}
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="Выберите уровень" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level: any) => (
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
          <Label htmlFor="ageRestriction">Возрастное ограничение</Label>
          <Select
            value={courseData.ageRestriction}
            onValueChange={(value) => updateCourseData({ ageRestriction: value })}
          >
            <SelectTrigger id="ageRestriction">
              <SelectValue placeholder="Выберите ограничение" />
            </SelectTrigger>
            <SelectContent>
              {ageRestrictions.map((age: any) => (
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
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Назад
        </Button>
        <Button onClick={handleSubmitClick}>
          Создать курс
        </Button>
      </div>
    </div>
  );
}