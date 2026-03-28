import { Link } from "wouter";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-3xl font-bold tracking-tight text-primary block mb-4">
              Jamila
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Algeria's premier destination for discovering the finest health, beauty, and wellness services. From Algiers to Tamanrasset, find your glow.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">Discover</h4>
            <ul className="space-y-3">
              <li><Link href="/categories/salons" className="text-muted-foreground hover:text-primary text-sm transition-colors">Hair Salons</Link></li>
              <li><Link href="/categories/spas" className="text-muted-foreground hover:text-primary text-sm transition-colors">Spas & Hammams</Link></li>
              <li><Link href="/categories/clinics" className="text-muted-foreground hover:text-primary text-sm transition-colors">Aesthetic Clinics</Link></li>
              <li><Link href="/categories/pharmacies" className="text-muted-foreground hover:text-primary text-sm transition-colors">Pharmacies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">For Businesses</h4>
            <ul className="space-y-3 mb-6">
              <li><Link href="/submit" className="text-muted-foreground hover:text-primary text-sm transition-colors">Claim your listing</Link></li>
              <li><Link href="/partner" className="text-muted-foreground hover:text-primary text-sm transition-colors">Partner with us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Jamila. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-primary fill-primary/20" /> in Algeria
          </p>
        </div>
      </div>
    </footer>
  );
}
