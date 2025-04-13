export default function Navbar() {
    return (
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        {/* 🔶 Logo / App Name */}
        <div className="text-2xl font-bold text-green-700">
          MedVeda
        </div>
  
        {/* 🔗 Navigation Links */}
        <div className="space-x-6  items-center text-sm font-medium text-gray-700">
          <a href="#remedies" className="hover:text-green-600 transition">Remedies</a>
          <a href="#how-it-works" className="hover:text-green-600 transition">How It Works</a>
          <a href="#testimonials" className="hover:text-green-600 transition">Testimonials</a>
          <a href="/signin" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Sign In
          </a>
        </div>
      </nav>
    );
  }
  