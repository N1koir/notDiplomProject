'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useCourse } from '@/app/context/CourseContext';
import { 
  categoryService, 
  levelService, 
  ageService, 
  monetizationService 
} from '@/app/api/apiService';
import { Button } from '@/components/ui/button';
import CourseCreationStep1 from '@/components/course-creation/CourseCreationStep1';
import CourseCreationStep2 from '@/components/course-creation/CourseCreationStep2';
import CourseCreationStep3 from '@/components/course-creation/CourseCreationStep3';
import { useToast } from '@/hooks/use-toast';

export default function CreateCoursePage() {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    fileIcon: null,
    markdownContent: '',
    monetizationType: '',
    price: '',
    category: '',
    ageRestriction: '',
    level: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [ageRestrictions, setAgeRestrictions] = useState([]);
  const [monetizationTypes, setMonetizationTypes] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const { user } = useAuth();
  const { createCourse } = useCourse();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Для создания курса необходимо войти в систему",
        variant: "destructive",
      });
      router.push('/');
    }
    
    // Load necessary data
    const loadData = async () => {
      try {
        setDataLoading(true);
        const [categoriesData, levelsData, ageData, monetizationData] = await Promise.all([
          categoryService.getCategories(),
          levelService.getLevels(),
          ageService.getAgeRestrictions(),
          monetizationService.getMonetizationTypes()
        ]);
        
        setCategories(categoriesData || []);
        setLevels(levelsData || []);
        setAgeRestrictions(ageData || []);
        setMonetizationTypes(monetizationData || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить необходимые данные для формы",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };
    
    loadData();
  }, [user, router, toast]);

  const updateCourseData = (data: Partial<typeof courseData>) => {
    setCourseData(prev => ({ ...prev, ...data }));
  };

  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const handleSubmit = async () => {
    try {
      // Prepare and validate data
      if (!courseData.title) {
        toast({
          title: "Ошибка валидации",
          description: "Название курса обязательно",
          variant: "destructive",
        });
        return;
      }
      
      if (!courseData.markdownContent) {
        toast({
          title: "Ошибка валидации",
          description: "Содержимое курса обязательно",
          variant: "destructive",
        });
        return;
      }
      
      // Check if monetization is paid and price is set
      if (courseData.monetizationType === '1' && (!courseData.price || parseInt(courseData.price) < 1000 || parseInt(courseData.price) > 20000)) {
        toast({
          title: "Ошибка валидации",
          description: "Для платного курса стоимость должна быть от 1000 до 20000",
          variant: "destructive",
        });
        return;
      }
      
      // Create FormData for API request
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description || '');
      formData.append('fileCourse', new Blob([courseData.markdownContent], { type: 'text/markdown' }));
      
      if (courseData.fileIcon) {
        formData.append('fileIcon', courseData.fileIcon);
      }
      
      formData.append('idUsername', user?.idUsername.toString() || '');
      formData.append('idMonetizationStatus', courseData.monetizationType || '2'); // Default to free
      formData.append('idCategory', courseData.category || '1'); // Default category
      formData.append('idLevelKnowledge', courseData.level || '1'); // Default level
      formData.append('idAgePeople', courseData.ageRestriction || '1'); // Default age
      
      if (courseData.monetizationType === '1') { // Paid course
        formData.append('price', courseData.price);
      } else {
        formData.append('price', '0');
      }
      
      // Submit data
      const result = await createCourse(formData);
      
      toast({
        title: "Курс создан успешно",
        description: "Ваш курс был успешно создан и опубликован",
        variant: "default",
      });
      
      // Navigate to the created course
      router.push(`/course/${result.idDatasOpenCourses}`);
      
    } catch (error: any) {
      toast({
        title: "Ошибка создания курса",
        description: error.message || "Не удалось создать курс. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  if (dataLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Загрузка данных...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Создание курса</h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-between relative mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div 
                key={stepNumber}
                className={`flex flex-col items-center relative z-10 ${step === stepNumber ? 'text-primary' : step > stepNumber ? 'text-green-500' : 'text-muted-foreground'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step === stepNumber 
                      ? 'bg-primary text-primary-foreground' 
                      : step > stepNumber 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                <div className="text-sm font-medium">
                  {stepNumber === 1 && 'Основная информация'}
                  {stepNumber === 2 && 'Содержимое курса'}
                  {stepNumber === 3 && 'Настройка доступа'}
                </div>
              </div>
            ))}
            
            {/* Progress bar */}
            <div className="absolute top-5 h-1 w-full bg-muted -z-10">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-card shadow-sm rounded-lg border p-6">
          {step === 1 && (
            <CourseCreationStep1
              courseData={courseData}
              updateCourseData={updateCourseData}
              onNext={() => goToStep(2)}
            />
          )}
          
          {step === 2 && (
            <CourseCreationStep2
              courseData={courseData}
              updateCourseData={updateCourseData}
              onPrev={() => goToStep(1)}
              onNext={() => goToStep(3)}
            />
          )}
          
          {step === 3 && (
            <CourseCreationStep3
              courseData={courseData}
              updateCourseData={updateCourseData}
              categories={categories}
              levels={levels}
              ageRestrictions={ageRestrictions}
              monetizationTypes={monetizationTypes}
              onPrev={() => goToStep(2)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}