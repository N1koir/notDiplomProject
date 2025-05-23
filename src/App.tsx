import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Course from './pages/Course';
import CreateCourse from './pages/CreateCourse';
import Search from './pages/Search';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <CourseProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/course/:id" element={<Course />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;