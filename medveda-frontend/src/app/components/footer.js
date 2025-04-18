import '../styles/footer.css'
export default function Footer() {
    return (
      <footer className="bg-emerald-900 text-white py-16">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} MedVeda • All rights reserved
        </div>
            <div id="footer-brand">
                    <h3 class="text-2xl font-bold mb-4">Med<span class="text-amber-400">Veda</span></h3>
                    <p class="text-gray-300">Ancient wisdom for modern wellness</p>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                
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
  