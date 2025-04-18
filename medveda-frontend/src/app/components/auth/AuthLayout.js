export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen grid md:grid-cols-2">
        {/* Left: Branding / Illustration */}
        <div className="bg-green-100 flex flex-col justify-center items-center px-8 py-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Welcome to MedVeda</h1>
          <p className="text-gray-700 text-center">
            Discover, learn and contribute ayurvedic & home remedies
          </p>
          <img
            src="/auth-illustration.svg"
            alt="Ayurvedic Illustration"
            className="mt-10 w-3/4 max-w-md"
          />
        </div>
  
        {/* Right: Auth Form */}
        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    );
  }
  