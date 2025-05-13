// Mock data and local storage utilities
export const mockData = {
  categories: [
    { idCategory: 1, type: 'Программирование' },
    { idCategory: 2, type: 'Дизайн' },
    { idCategory: 3, type: 'Маркетинг' },
    { idCategory: 4, type: 'Бизнес' }
  ],
  levels: [
    { idLevelKnowledge: 1, type: 'Начинающий' },
    { idLevelKnowledge: 2, type: 'Средний' },
    { idLevelKnowledge: 3, type: 'Продвинутый' }
  ],
  ageRestrictions: [
    { idAgePeople: 1, type: '6+' },
    { idAgePeople: 2, type: '12+' },
    { idAgePeople: 3, type: '16+' },
    { idAgePeople: 4, type: '18+' }
  ],
  monetizationTypes: [
    { idMonetizationStatus: 1, type: 'Платный курс' },
    { idMonetizationStatus: 2, type: 'Бесплатный курс' }
  ],
  courses: [
    {
      idDatasOpenCourses: 1,
      title: 'Введение в веб-разработку',
      description: 'Базовый курс по HTML, CSS и JavaScript',
      category: 'Программирование',
      levelKnowledge: 'Начинающий',
      agePeople: '12+',
      idMonetizationStatus: 2,
      price: 0,
      createdAt: new Date().toISOString()
    },
    {
      idDatasOpenCourses: 2,
      title: 'UI/UX Дизайн с нуля',
      description: 'Основы дизайна пользовательских интерфейсов',
      category: 'Дизайн',
      levelKnowledge: 'Средний',
      agePeople: '16+',
      idMonetizationStatus: 1,
      price: 2999,
      createdAt: new Date().toISOString()
    }
  ]
};

// Local storage keys
const STORAGE_KEYS = {
  USER: 'knowledge_plus_user',
  COURSES: 'knowledge_plus_courses'
};

// Helper functions
const getFromStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Service functions
export const authService = {
  login: async (login: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Demo login logic
    const user = {
      idUsername: Date.now(),
      login,
      idRole: 1
    };
    
    setToStorage(STORAGE_KEYS.USER, user);
    return user;
  },

  register: async (login: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = {
      idUsername: Date.now(),
      login,
      idRole: 1
    };
    
    setToStorage(STORAGE_KEYS.USER, user);
    return user;
  }
};

export const courseService = {
  getCourses: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let courses = getFromStorage(STORAGE_KEYS.COURSES) || mockData.courses;
    return courses;
  },

  getCourseById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courses = getFromStorage(STORAGE_KEYS.COURSES) || mockData.courses;
    return courses.find(course => course.idDatasOpenCourses === id);
  },

  createCourse: async (courseData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCourse = {
      idDatasOpenCourses: Date.now(),
      ...courseData,
      createdAt: new Date().toISOString()
    };
    
    const courses = getFromStorage(STORAGE_KEYS.COURSES) || mockData.courses;
    courses.push(newCourse);
    setToStorage(STORAGE_KEYS.COURSES, courses);
    
    return newCourse;
  },

  updateCourse: async (id: number, courseData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const courses = getFromStorage(STORAGE_KEYS.COURSES) || mockData.courses;
    const index = courses.findIndex(course => course.idDatasOpenCourses === id);
    
    if (index !== -1) {
      courses[index] = { ...courses[index], ...courseData };
      setToStorage(STORAGE_KEYS.COURSES, courses);
      return courses[index];
    }
    
    throw new Error('Course not found');
  }
};

export const categoryService = {
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.categories;
  }
};

export const levelService = {
  getLevels: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.levels;
  }
};

export const ageService = {
  getAgeRestrictions: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.ageRestrictions;
  }
};

export const monetizationService = {
  getMonetizationTypes: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.monetizationTypes;
  }
};