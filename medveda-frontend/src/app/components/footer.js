export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-10 text-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} MedVeda • All rights reserved
        </div>
        <div className="mt-4 space-x-6 text-sm">
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="#privacy" className="hover:underline">
            Privacy
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
          <a href="#terms" className="hover:underline">
            Terms
          </a>
        </div>
      </footer>
    );
  }
  