import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, MapPin, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/shared/ListingCard";
import { useGetListings, useGetCategories, useGetWilayas, useGetStats } from "@workspace/api-client-react";

export function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  
  // Queries
  const { data: stats } = useGetStats();
  const { data: categories } = useGetCategories();
  const { data: wilayas } = useGetWilayas();
  const { data: featuredData, isLoading: isLoadingFeatured } = useGetListings({ featured: true, limit: 6 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (selectedWilaya) params.append("wilaya", selectedWilaya);
    setLocation(`/search?${params.toString()}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Soft elegant feminine background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Discover Your Glow
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Algeria's Premier <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">Health & Beauty</span> Destination
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Find and book the finest salons, spas, aesthetic clinics, and wellness centers across all 58 wilayas.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-premium border border-border/50 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative flex items-center pl-4 pr-2">
                <Search className="w-5 h-5 text-muted-foreground absolute left-4" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?" 
                  className="w-full border-none shadow-none focus-visible:ring-0 pl-8 bg-transparent text-base"
                />
              </div>
              <div className="hidden sm:block w-px h-8 bg-border self-center"></div>
              <div className="flex-1 relative flex items-center pl-4 pr-2">
                <MapPin className="w-5 h-5 text-muted-foreground absolute left-4" />
                <select 
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full h-10 border-none bg-transparent pl-8 text-base text-foreground focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="">All Wilayas</option>
                  {wilayas?.map(w => (
                    <option key={w.code} value={w.code.toString()}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md sm:w-auto w-full">
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Explore Categories</h2>
              <p className="text-muted-foreground mt-2">Everything you need for your wellbeing</p>
            </div>
            <Link href="/categories" className="text-primary font-medium hover:underline hidden sm:block">
              View all categories &rarr;
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {categories?.slice(0, 8).map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link 
                  href={`/categories/${category.slug}`}
                  className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-2xl hover:bg-secondary/70 transition-colors border border-transparent hover:border-border cursor-pointer group text-center h-full"
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-2xl">
                    {category.icon || "✨"}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{category.listingCount} listings</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Curated For You</h2>
              <p className="text-muted-foreground mt-2">Top-rated beauty and wellness destinations</p>
            </div>
            <Link href="/listings?featured=true" className="text-primary font-medium hover:underline hidden sm:block">
              View all featured &rarr;
            </Link>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-80 bg-muted/50 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredData?.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
            <div>
              <p className="font-display text-4xl lg:text-5xl font-bold mb-2">{stats?.totalListings || "2,500"}+</p>
              <p className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">Active Listings</p>
            </div>
            <div>
              <p className="font-display text-4xl lg:text-5xl font-bold mb-2">{stats?.totalWilayas || "58"}</p>
              <p className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">Wilayas Covered</p>
            </div>
            <div>
              <p className="font-display text-4xl lg:text-5xl font-bold mb-2">{stats?.totalCategories || "12"}</p>
              <p className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">Categories</p>
            </div>
            <div>
              <p className="font-display text-4xl lg:text-5xl font-bold mb-2">4.8</p>
              <p className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
