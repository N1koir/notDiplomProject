'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCourse } from '@/app/context/CourseContext';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CourseGrid() {
  const { courseState, fetchCourses } = useCourse();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCourseClick = (courseId: number) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Для просмотра курса необходимо войти в систему",
        variant: "destructive",
      });
      return;
    }
    
    router.push(`/course/${courseId}`);
  };

  if (courseState.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="opacity-70 animate-pulse">
            <CardHeader className="h-40 bg-muted"></CardHeader>
            <CardContent className="py-4">
              <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-4 w-full bg-muted rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-6 w-20 bg-muted rounded"></div>
              <div className="h-9 w-24 bg-muted rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (courseState.error) {
    return (
      <div className="text-center p-6 border rounded-lg bg-red-50 text-red-800">
        <p>Ошибка загрузки курсов: {courseState.error}</p>
        <Button 
          variant="outline" 
          onClick={() => fetchCourses()} 
          className="mt-2"
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (courseState.courses.length === 0) {
    return (
      <div className="text-center p-10 border border-dashed rounded-lg">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">Курсы отсутствуют</h3>
        <p className="text-muted-foreground mb-4">
          На данный момент нет доступных курсов в системе
        </p>
        {user && (
          <Button onClick={() => router.push('/create-course')}>
            Создать первый курс
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courseState.courses.map((course: any) => (
        <Card key={course.idDatasOpenCourses} className="overflow-hidden group transition-all hover:shadow-md">
          <div className="aspect-video bg-muted relative overflow-hidden">
            {course.fileIcon ? (
              <img 
                src={`data:image/jpeg;base64,${course.fileIcon}`} 
                alt={course.title}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
            {course.idMonetizationStatus === 2 && (
              <Badge className="absolute top-2 right-2 bg-green-500">
                Бесплатно
              </Badge>
            )}
            {course.idMonetizationStatus === 1 && (
              <Badge className="absolute top-2 right-2 bg-blue-500">
                {course.price} ₽
              </Badge>
            )}
          </div>
          
          <CardHeader>
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">
              {course.description || 'Нет описания'}
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              {course.levelKnowledge && (
                <Badge variant="outline">{course.levelKnowledge}</Badge>
              )}
              {course.agePeople && (
                <Badge variant="outline">{course.agePeople}</Badge>
              )}
            </div>
            
            <Button
              onClick={() => handleCourseClick(course.idDatasOpenCourses)}
              variant={user ? "default" : "outline"}
              className="transition-all"
            >
              {!user && <Lock className="mr-2 h-4 w-4" />}
              {user ? 'Открыть' : 'Войти для просмотра'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}