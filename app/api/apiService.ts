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

// Service functions with improved error handling
export const authService = {
  login: async (login: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = { idUsername: Date.now(), login, idRole: 1 };
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  register: async (login: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = { idUsername: Date.now(), login, idRole: 1 };
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }
};

export const courseService = {
  getCourses: async (filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.courses;
    } catch (error) {
      console.error('Get courses error:', error);
      return [];
    }
  },

  getCourseById: async (id: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.courses.find(course => course.idDatasOpenCourses === id) || null;
    } catch (error) {
      console.error('Get course by ID error:', error);
      return null;
    }
  },

  createCourse: async (courseData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCourse = {
        idDatasOpenCourses: Date.now(),
        ...courseData,
        createdAt: new Date().toISOString()
      };
      mockData.courses.push(newCourse);
      return newCourse;
    } catch (error) {
      console.error('Create course error:', error);
      return null;
    }
  },

  updateCourse: async (id: number, courseData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockData.courses.findIndex(course => course.idDatasOpenCourses === id);
      if (index !== -1) {
        mockData.courses[index] = { ...mockData.courses[index], ...courseData };
        return mockData.courses[index];
      }
      return null;
    } catch (error) {
      console.error('Update course error:', error);
      return null;
    }
  }
};

export const categoryService = {
  getCategories: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockData.categories;
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  }
};

export const levelService = {
  getLevels: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockData.levels;
    } catch (error) {
      console.error('Get levels error:', error);
      return [];
    }
  }
};

export const ageService = {
  getAgeRestrictions: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockData.ageRestrictions;
    } catch (error) {
      console.error('Get age restrictions error:', error);
      return [];
    }
  }
};

export const monetizationService = {
  getMonetizationTypes: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockData.monetizationTypes;
    } catch (error) {
      console.error('Get monetization types error:', error);
      return [];
    }
  }
};