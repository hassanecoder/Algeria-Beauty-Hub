import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { SlidersHorizontal, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/shared/ListingCard";
import { useGetListings, useGetCategories, useGetWilayas } from "@workspace/api-client-react";

export function Listings() {
  const [location] = useLocation();
  
  // Parse URL params
  const searchParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    wilaya: searchParams.get("wilaya") || "",
    minRating: searchParams.get("minRating") || "",
    priceRange: searchParams.get("priceRange") || "",
  });

  const { data: categories } = useGetCategories();
  const { data: wilayas } = useGetWilayas();
  
  const { data, isLoading } = useGetListings({
    search: filters.q || undefined,
    category: filters.category || undefined,
    wilaya: filters.wilaya || undefined,
    minRating: filters.minRating ? Number(filters.minRating) : undefined,
    limit: 12,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Update URL without reload (in a real app, we'd use a router hook for this to maintain history)
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground">Discover Spaces</h1>
          <p className="text-muted-foreground mt-2 text-lg">Find the perfect health and beauty professionals.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-28 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-border">
                <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Name or keyword..." 
                      className="pl-9 bg-background"
                      value={filters.q}
                      onChange={(e) => handleFilterChange("q", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Location (Wilaya)</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={filters.wilaya}
                    onChange={(e) => handleFilterChange("wilaya", e.target.value)}
                  >
                    <option value="">All Algeria</option>
                    {wilayas?.map(w => (
                      <option key={w.code} value={w.code.toString()}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Category</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        value=""
                        checked={filters.category === ""}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm">All Categories</span>
                    </label>
                    {categories?.map(c => (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="category" 
                          value={c.slug}
                          checked={filters.category === c.slug}
                          onChange={(e) => handleFilterChange("category", e.target.value)}
                          className="accent-primary"
                        />
                        <span className="text-sm">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Minimum Rating</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange("minRating", e.target.value)}
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
              </div>
              
              <Button 
                className="w-full mt-8" 
                variant="outline"
                onClick={() => setFilters({ q: "", category: "", wilaya: "", minRating: "", priceRange: "" })}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{data?.total || 0}</strong> results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm bg-transparent font-medium focus:outline-none cursor-pointer">
                  <option>Recommended</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-80 bg-muted/50 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : data?.listings && data.listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                
                {/* Pagination (Simplified) */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button variant="outline" disabled={data.page === 1}>Previous</Button>
                    <span className="text-sm font-medium">Page {data.page} of {data.totalPages}</span>
                    <Button variant="outline" disabled={data.page === data.totalPages}>Next</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No listings found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms to find what you're looking for.</p>
                <Button onClick={() => setFilters({ q: "", category: "", wilaya: "", minRating: "", priceRange: "" })}>
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
