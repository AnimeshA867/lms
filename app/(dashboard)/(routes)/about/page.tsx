import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our platform",
};

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>

      <div className="space-y-6">
        <p className="text-lg text-slate-700">
          Welcome to our learning management system. We are dedicated to
          providing high-quality educational content and tools to help students
          and educators succeed.
        </p>

        <div className="bg-slate-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-slate-700">
            To make education accessible, engaging, and effective for everyone
            through innovative technology and thoughtful course design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">For Students</h3>
            <p className="text-slate-600">
              Access high-quality courses, track your progress, and learn at
              your own pace.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">For Instructors</h3>
            <p className="text-slate-600">
              Create and manage courses, engage with students, and monitor their
              progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
