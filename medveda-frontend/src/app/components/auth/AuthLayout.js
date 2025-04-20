import '../../styles/AuthLayout.css'; 
export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex">
        {/* Left: Branding / Illustration */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          
          <img
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/29ef141a9d-5e8c77c987c2515d2f43.png"
            alt="Ayurvedic Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/30"></div>
          <div className='relative z-10 p-12 text-white'>
            <h1 className="text-4xl font-bold mb-4">Welcome to MedVeda</h1>
          <p className="text-lg opacity-90">
            Discover, learn and contribute ayurvedic & home remedies
          </p>
          </div>
        </div>
  
        {/* Right: Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-full max-w-md px-8 py-12">
            {children}
          </div>
        </div>
      </div>
    );
  }
  