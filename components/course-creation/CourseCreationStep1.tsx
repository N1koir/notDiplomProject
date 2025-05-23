'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Image } from 'lucide-react';

interface CourseCreationStep1Props {
  courseData: {
    title: string;
    description: string;
    fileIcon: File | null;
  };
  updateCourseData: (data: Partial<typeof courseData>) => void;
  onNext: () => void;
}

export default function CourseCreationStep1({
  courseData,
  updateCourseData,
  onNext
}: CourseCreationStep1Props) {
  const [titleError, setTitleError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateCourseData({ title: value });
    
    if (!value.trim()) {
      setTitleError('Название курса обязательно');
    } else {
      setTitleError('');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCourseData({ description: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Поддерживаемые форматы: JPEG, PNG, WebP');
      return;
    }
    
    // Validate file size (6MB)
    if (file.size > 6 * 1024 * 1024) {
      alert('Максимальный размер файла: 6MB');
      return;
    }
    
    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    updateCourseData({ fileIcon: file });
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    updateCourseData({ fileIcon: null });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    if (!courseData.title.trim()) {
      setTitleError('Название курса обязательно');
      return;
    }
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          Название курса <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={courseData.title}
          onChange={handleTitleChange}
          placeholder="Введите название курса"
          className={titleError ? 'border-destructive' : ''}
        />
        {titleError && <p className="text-sm text-destructive">{titleError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={courseData.description}
          onChange={handleDescriptionChange}
          placeholder="Введите краткое описание курса"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fileIcon">Иконка курса (опционально)</Label>
        <input
          type="file"
          id="fileIcon"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="relative w-full h-48 border rounded-md overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={triggerFileInput}
          >
            <div className="mb-4 bg-primary/10 p-2 rounded-full">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Добавить изображение</p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WebP. Макс. размер: 6 МБ.
              </p>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Рекомендуемое разрешение: 300x300 пикселей
        </p>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleNext}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}