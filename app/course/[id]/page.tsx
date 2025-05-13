'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useCourse } from '@/app/context/CourseContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, ArrowLeft, Clock, BookOpen, Tag } from 'lucide-react';
import { marked } from 'marked';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null);
  const [courseContent, setCourseContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { getCourseById } = useCourse();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Для просмотра курса необходимо войти в систему",
        variant: "destructive",
      });
      router.push('/');
      return;
    }
    
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getCourseById(parseInt(params.id, 10));
        setCourse(data);
        
        // Convert FileCourse from Bytea to string
        if (data.fileCourse) {
          // This would normally involve proper Bytea to string conversion
          // For demo purposes, we're assuming it's a base64 string
          const content = atob(data.fileCourse);
          setCourseContent(marked(content));
        }
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить курс');
        toast({
          title: "Ошибка загрузки курса",
          description: err.message || "Не удалось загрузить данные курса",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [params.id, getCourseById, user, router, toast]);

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Загрузка курса...</h2>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          
          <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2 text-destructive">Ошибка загрузки курса</h2>
            <p className="mb-4">{error || 'Не удалось загрузить данные курса'}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/courses')}
            >
              Вернуться к списку курсов
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = user.idUsername === course.idUsername;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/courses')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          К списку курсов
        </Button>
        
        <div className="bg-card border rounded-lg overflow-hidden">
          {/* Course header */}
          <div className="relative">
            {course.fileIcon ? (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={`data:image/jpeg;base64,${course.fileIcon}`} 
                  alt={course.title}
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="h-48 bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary/30" />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {course.category && (
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                    {course.category}
                  </Badge>
                )}
                {course.levelKnowledge && (
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                    {course.levelKnowledge}
                  </Badge>
                )}
                {course.agePeople && (
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                    {course.agePeople}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
            </div>
          </div>
          
          {/* Course metadata */}
          <div className="p-6 border-b bg-muted/30">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {course.idMonetizationStatus === 1 
                      ? `Платный курс - ${course.price} ₽` 
                      : 'Бесплатный курс'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Дата создания: {new Date(course.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {isAuthor && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/edit-course/${params.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
              )}
            </div>
          </div>
          
          {/* Course description if available */}
          {course.description && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-2">Описание</h2>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
          )}
          
          {/* Course content */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Содержание курса</h2>
            
            <div className="prose prose-sm md:prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: courseContent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}