import CourseGrid from '@/components/course/CourseGrid';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FeatureSection />
      <section className="py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Популярные курсы</h2>
        <CourseGrid />
      </section>
    </div>
  );
}