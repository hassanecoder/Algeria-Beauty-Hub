import { useParams } from "wouter";
import { useState } from "react";
import { Star, MapPin, Phone, Globe, Clock, CheckCircle2, Navigation, MessageCircle } from "lucide-react";
import { useGetListingById, useGetListingReviews, useCreateReview } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";

const reviewSchema = z.object({
  authorName: z.string().min(2, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Comment is too short"),
});

export function ListingDetail() {
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const { data: listing, isLoading, error } = useGetListingById(id);
  const { data: reviews } = useGetListingReviews(id);
  const createReview = useCreateReview();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { authorName: "", rating: 5, comment: "" }
  });

  const onSubmitReview = async (data: z.infer<typeof reviewSchema>) => {
    await createReview.mutateAsync(
      { id, data },
      {
        onSuccess: () => {
          form.reset();
          // Invalidate queries to refresh list
          queryClient.invalidateQueries({ queryKey: [`/api/listings/${id}/reviews`] });
          queryClient.invalidateQueries({ queryKey: [`/api/listings/${id}`] });
        }
      }
    );
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  if (error || !listing) return <div className="min-h-screen flex items-center justify-center text-xl text-muted-foreground">Listing not found</div>;

  {/* unsplash gallery styling placeholder images */}
  const defaultGallery = [
    listing.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
    "https://images.unsplash.com/photo-1600334129128-685054110230?w=800&q=80",
    "https://images.unsplash.com/photo-1516975080661-46bdf36f59ba?w=800&q=80"
  ];

  const displayImages = listing.images?.length > 0 ? [listing.coverImage, ...listing.images] : defaultGallery;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header Info */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{listing.categoryName}</Badge>
                {listing.verified && (
                  <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">{listing.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 bg-yellow-100/50 text-yellow-700 px-2 py-1 rounded-md font-semibold">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  {listing.rating.toFixed(1)} <span className="font-normal">({listing.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {listing.address}, {listing.wilayaName}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button size="lg" className="flex-1 md:flex-none shadow-md shadow-primary/20">
                <Phone className="w-4 h-4 mr-2" /> Book Now
              </Button>
              <Button size="lg" variant="outline" className="px-4">
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
          <div className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer">
            <img src={displayImages[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Cover" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
            <img src={displayImages[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 1" />
          </div>
          <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
            <img src={displayImages[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 2" />
          </div>
          <div className="hidden md:block col-span-2 row-span-1 relative group cursor-pointer">
            <img src={displayImages[3]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 3" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" className="font-semibold">View all photos</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">About this place</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="font-display text-2xl font-bold mb-6">Services & Menu</h2>
              {listing.services && listing.services.length > 0 ? (
                <div className="space-y-4">
                  {listing.services.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                      <div>
                        <h4 className="font-bold text-foreground">{service.name}</h4>
                        {service.description && <p className="text-sm text-muted-foreground mt-1">{service.description}</p>}
                        {service.duration && <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Clock className="w-3 h-3"/> {service.duration}</p>}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg text-primary">
                          DZD {service.price} {service.priceMax ? `- ${service.priceMax}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Contact business for detailed pricing.</p>
              )}
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="font-display text-2xl font-bold mb-6">Reviews</h2>
              <div className="space-y-6 mb-8">
                {reviews?.length === 0 ? (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews?.map(review => (
                    <div key={review.id} className="pb-6 border-b border-border/50 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                            {review.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold">{review.authorName}</p>
                            <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground ml-13">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <Card className="bg-secondary/20 border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5"/> Leave a Review</h3>
                  <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Name</label>
                        <Input {...form.register("authorName")} placeholder="Sarah M." />
                        {form.formState.errors.authorName && <p className="text-red-500 text-xs">{form.formState.errors.authorName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rating (1-5)</label>
                        <select {...form.register("rating")} className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                          <option value="5">5 Stars - Excellent</option>
                          <option value="4">4 Stars - Very Good</option>
                          <option value="3">3 Stars - Good</option>
                          <option value="2">2 Stars - Fair</option>
                          <option value="1">1 Star - Poor</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Comment</label>
                      <textarea 
                        {...form.register("comment")}
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Share your experience..."
                      />
                      {form.formState.errors.comment && <p className="text-red-500 text-xs">{form.formState.errors.comment.message}</p>}
                    </div>
                    <Button type="submit" disabled={createReview.isPending}>
                      {createReview.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <Card className="shadow-premium border-border/50">
                <CardContent className="p-6 space-y-6">
                  <h3 className="font-display text-xl font-bold border-b border-border pb-4">Contact Info</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-muted-foreground mt-0.5">{listing.address}</p>
                        <p className="text-muted-foreground">{listing.wilayaName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <a href={`tel:${listing.phone}`} className="text-primary hover:underline mt-0.5 inline-block">{listing.phone}</a>
                      </div>
                    </div>

                    {listing.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Website</p>
                          <a href={listing.website} target="_blank" rel="noreferrer" className="text-primary hover:underline mt-0.5 inline-block break-all">
                            {listing.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}

                    {listing.openingHours && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Hours</p>
                          <p className="text-muted-foreground mt-0.5 whitespace-pre-line">{listing.openingHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <div className="bg-secondary/30 border border-border/50 rounded-xl p-4 text-center aspect-video flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">Map view available in app</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
