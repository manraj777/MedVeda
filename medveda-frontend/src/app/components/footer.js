import '../styles/footer.css'
export default function Footer() {
    return (
      <footer className="bg-emerald-900 text-white py-16">
        <div className="container mx-auto px-4">

            <div id="footer-brand">
              <h3 className="text-2xl font-bold mb-4">Med<span className="text-amber-400">Veda</span></h3>
              <p className="text-gray-300">Ancient wisdom for modern wellness</p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  
            <a href="#about" className="text-gray-300 hover:text-white cursor-pointer">
              About
            </a>
            <a href="#privacy" className="text-gray-300 hover:text-white cursor-pointer">
              Privacy
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white cursor-pointer">
              Contact
            </a>
            <a href="#terms" className="text-gray-300 hover:text-white cursor-pointer">
              Terms
            </a>
          
        </div>
          <div className="border-t border-emerald-800 mt-12 pt-8 text-center text-gray-300">
            &copy; {new Date().getFullYear()} MedVeda • All rights reserved
          </div>
        </div>
      </footer>
    );
  }
  