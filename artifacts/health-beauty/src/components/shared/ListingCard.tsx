import { Link } from "wouter";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@workspace/api-client-react/src/generated/api.schemas";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  // Convert price range to dollar signs
  const renderPrice = (range: string) => {
    switch (range) {
      case "budget": return "DZD 💸";
      case "moderate": return "DZD 💸💸";
      case "premium": return "DZD 💸💸💸";
      case "luxury": return "DZD 💸💸💸💸";
      default: return "DZD 💸💸";
    }
  };

  return (
    <Link 
      href={`/listings/${listing.id}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-premium hover:-translate-y-1 cursor-pointer border border-border/50"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* Placeholder image if coverImage fails or is an unsplash stub */}
        <img
          src={listing.coverImage || "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80"}
          alt={listing.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {listing.featured && (
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm border-none font-medium backdrop-blur-md bg-white/80">
              Featured
            </Badge>
          )}
          {listing.verified && (
            <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm border-none font-medium backdrop-blur-md">
              Verified
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-md shadow-sm font-semibold">
            {renderPrice(listing.priceRange)}
          </Badge>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            {listing.categoryName}
          </p>
          <div className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="text-sm font-bold text-foreground">{listing.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({listing.reviewCount})</span>
          </div>
        </div>
        
        <h3 className="font-display text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {listing.name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-muted-foreground mt-3 text-sm">
          <MapPin className="w-4 h-4 shrink-0 text-primary/70" />
          <span className="line-clamp-1">{listing.wilayaName} • {listing.address}</span>
        </div>
      </div>
    </Link>
  );
}
