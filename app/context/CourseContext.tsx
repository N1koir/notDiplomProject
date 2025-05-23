'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { courseService } from '../api/apiService';

interface CourseState {
  courses: any[];
  loading: boolean;
  error: string | null;
}

interface CourseContextType {
  courseState: CourseState;
  fetchCourses: (filters?: any) => Promise<void>;
  getCourseById: (id: number) => Promise<any>;
  createCourse: (courseData: any) => Promise<any>;
  updateCourse: (id: number, courseData: any) => Promise<any>;
  clearError: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courseState, setCourseState] = useState<CourseState>({
    courses: [],
    loading: false,
    error: null
  });

  const fetchCourses = async (filters = {}) => {
    try {
      setCourseState(prev => ({ ...prev, loading: true, error: null }));
      const data = await courseService.getCourses(filters);
      setCourseState(prev => ({ ...prev, courses: data, loading: false }));
    } catch (err: any) {
      setCourseState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch courses.'
      }));
    }
  };

  const getCourseById = async (id: number) => {
    try {
      setCourseState(prev => ({ ...prev, loading: true, error: null }));
      const data = await courseService.getCourseById(id);
      setCourseState(prev => ({ ...prev, loading: false }));
      return data;
    } catch (err: any) {
      setCourseState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch course.'
      }));
      throw err;
    }
  };

  const createCourse = async (courseData: any) => {
    try {
      setCourseState(prev => ({ ...prev, loading: true, error: null }));
      const data = await courseService.createCourse(courseData);
      setCourseState(prev => ({
        ...prev,
        courses: [...prev.courses, data],
        loading: false
      }));
      return data;
    } catch (err: any) {
      setCourseState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to create course.'
      }));
      throw err;
    }
  };

  const updateCourse = async (id: number, courseData: any) => {
    try {
      setCourseState(prev => ({ ...prev, loading: true, error: null }));
      const data = await courseService.updateCourse(id, courseData);
      setCourseState(prev => ({
        ...prev,
        courses: prev.courses.map(course => 
          course.idDatasOpenCourses === id ? data : course
        ),
        loading: false
      }));
      return data;
    } catch (err: any) {
      setCourseState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to update course.'
      }));
      throw err;
    }
  };

  const clearError = () => {
    setCourseState(prev => ({ ...prev, error: null }));
  };

  return (
    <CourseContext.Provider
      value={{
        courseState,
        fetchCourses,
        getCourseById,
        createCourse,
        updateCourse,
        clearError
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}