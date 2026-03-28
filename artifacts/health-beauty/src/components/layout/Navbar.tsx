import { Link, useLocation } from "wouter";
import { Search, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-3xl font-bold tracking-tight text-primary">
                Jamila
              </span>
            </Link>

            <nav className="hidden md:flex gap-6">
              {[
                { name: "Home", path: "/" },
                { name: "Listings", path: "/listings" },
                { name: "Categories", path: "/categories" },
                { name: "About", path: "/about" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/search" className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/submit">
              <Button className="rounded-full shadow-md shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                <Plus className="w-4 h-4 mr-1.5" /> Add Listing
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden text-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
