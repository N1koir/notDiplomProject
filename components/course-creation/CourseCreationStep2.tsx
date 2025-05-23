'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { marked } from 'marked';
import { Heading1, Heading2, Heading3, Bold, Italic, List, ListOrdered, Link, ImageIcon, Video, FileText } from 'lucide-react';

interface CourseCreationStep2Props {
  courseData: {
    markdownContent: string;
  };
  updateCourseData: (data: Partial<typeof courseData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function CourseCreationStep2({
  courseData,
  updateCourseData,
  onPrev,
  onNext
}: CourseCreationStep2Props) {
  const [markdownContent, setMarkdownContent] = useState(courseData.markdownContent);
  const [previewHtml, setPreviewHtml] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewHtml(marked(markdownContent));
  }, [markdownContent]);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setMarkdownContent(content);
    updateCourseData({ markdownContent: content });
  };

  const insertAtCursor = (insertText: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = `${text.substring(0, start)}${insertText.replace('$SELECTION', selectedText)}${text.substring(end)}`;
    
    setMarkdownContent(newText);
    updateCourseData({ markdownContent: newText });
    
    // Set selection to after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + insertText.length;
      textarea.selectionStart = newPosition;
      textarea.selectionEnd = newPosition;
    }, 0);
  };

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'h1':
        insertAtCursor('# $SELECTION\n');
        break;
      case 'h2':
        insertAtCursor('## $SELECTION\n');
        break;
      case 'h3':
        insertAtCursor('### $SELECTION\n');
        break;
      case 'bold':
        insertAtCursor('**$SELECTION**');
        break;
      case 'italic':
        insertAtCursor('*$SELECTION*');
        break;
      case 'ulist':
        insertAtCursor('- $SELECTION\n');
        break;
      case 'olist':
        insertAtCursor('1. $SELECTION\n');
        break;
      case 'link':
        insertAtCursor('[$SELECTION](https://)');
        break;
      case 'image':
        triggerFileUpload('image');
        break;
      case 'video':
        triggerFileUpload('video');
        break;
      default:
        break;
    }
  };

  const triggerFileUpload = (type: 'image' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' 
        ? 'image/jpeg,image/png,image/gif,image/webp' 
        : 'video/mp4,video/avi,video/mov';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const isImage = file.type.startsWith('image/');
    if (isImage && file.size > 10 * 1024 * 1024) {
      alert('Максимальный размер изображения: 10 МБ');
      return;
    }
    
    if (!isImage && file.size > 100 * 1024 * 1024) {
      alert('Максимальный размер видео: 100 МБ');
      return;
    }
    
    // For small files, use Base64
    if (file.size < 1 * 1024 * 1024) { // Less than 1MB
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        
        if (isImage) {
          insertAtCursor(`![Изображение](${base64Data})\n`);
        } else {
          insertAtCursor(`<video controls width="100%">
  <source src="${base64Data}" type="${file.type}">
  Your browser does not support the video tag.
</video>\n`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For larger files, use relative links
      // In a real implementation, we would upload to server and get back a URL
      // For demo purpose, we'll just use a placeholder
      const fileName = file.name;
      if (isImage) {
        insertAtCursor(`![Изображение](${fileName})\n`);
      } else {
        insertAtCursor(`<video controls width="100%">
  <source src="${fileName}" type="${file.type}">
  Your browser does not support the video tag.
</video>\n`);
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="bg-muted/50 rounded p-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('h1')}
          title="Заголовок 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('h2')}
          title="Заголовок 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('h3')}
          title="Заголовок 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('bold')}
          title="Жирный"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('italic')}
          title="Курсив"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('ulist')}
          title="Маркированный список"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('olist')}
          title="Нумерованный список"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('link')}
          title="Ссылка"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('image')}
          title="Изображение"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleToolbarAction('video')}
          title="Видео"
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Редактировать</TabsTrigger>
          <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="p-0 border rounded-md mt-2">
          <textarea
            ref={textareaRef}
            value={markdownContent}
            onChange={handleMarkdownChange}
            className="w-full min-h-[400px] p-4 font-mono text-sm resize-y focus:outline-none"
            placeholder="Введите содержимое курса в формате Markdown..."
          />
        </TabsContent>
        <TabsContent value="preview" className="border rounded-md p-4 min-h-[400px] mt-2 prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Назад
        </Button>
        <Button onClick={onNext}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}