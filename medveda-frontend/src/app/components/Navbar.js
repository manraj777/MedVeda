import '../styles/Navbar.css'; // Import your CSS file for custom styles
export default function Navbar() {
    return (
      <div className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 bg-white">
        <div className='navbar-container px-4'>
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center flex h-20">
          {/* 🔶 Logo / App Name */}
          <div className="text-2xl font-bold text-green-700 flex items-center">
            <span class="text-2xl font-bold text-emerald-800 cursor-pointer">Med<span class="text-amber-600">Veda</span></span>
          </div>
    
          {/* 🔗 Navigation Links */}
          <div className="space-x-8 items-center text-sm font-medium text-gray-700 hidden md:flex">
            <a href="#remedies" className="transition text-gray-600 hover:text-emerald-700">Remedies</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-700 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-emerald-700 transition">Testimonials</a>
            <button class="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-800">Sign In</button>
          </div>
        </nav>
        </div>
      </div>
    );
  }
  