import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Store, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateListing, useGetCategories, useGetWilayas } from "@workspace/api-client-react";

const submitSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  categoryId: z.coerce.number().min(1, "Please select a category"),
  wilayaId: z.coerce.number().min(1, "Please select a wilaya"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().min(20, "Provide a brief description"),
  priceRange: z.enum(["budget", "moderate", "premium", "luxury"]),
  coverImage: z.string().url("Must be a valid image URL"),
  openingHours: z.string().optional()
});

export function SubmitListing() {
  const [, setLocation] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { data: categories } = useGetCategories();
  const { data: wilayas } = useGetWilayas();
  const createListing = useCreateListing();

  const form = useForm<z.infer<typeof submitSchema>>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      priceRange: "moderate",
      coverImage: "",
      openingHours: "Mon-Sat: 09:00 - 18:00\nSun: Closed"
    }
  });

  const onSubmit = async (data: z.infer<typeof submitSchema>) => {
    try {
      const result = await createListing.mutateAsync({ data });
      setIsSuccess(true);
      setTimeout(() => {
        setLocation(`/listings/${result.id}`);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full text-center border-none shadow-xl">
          <CardContent className="pt-10 pb-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Listing Submitted!</h2>
            <p className="text-muted-foreground mb-6">Your business has been successfully added to Jamila. Redirecting to your new page...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Add Your Business</h1>
          <p className="text-muted-foreground text-lg">Join Algeria's fastest growing health & beauty network</p>
        </div>

        <Card className="shadow-premium border-border/50">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Store className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Business Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Business Name <span className="text-red-500">*</span></label>
                    <Input {...form.register("name")} placeholder="Salon Belle Rose" />
                    {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Category <span className="text-red-500">*</span></label>
                    <select {...form.register("categoryId")} className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="">Select Category</option>
                      {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {form.formState.errors.categoryId && <p className="text-red-500 text-xs">{form.formState.errors.categoryId.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Price Range</label>
                    <select {...form.register("priceRange")} className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="budget">Budget (DZD $)</option>
                      <option value="moderate">Moderate (DZD $$)</option>
                      <option value="premium">Premium (DZD $$$)</option>
                      <option value="luxury">Luxury (DZD $$$$)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Description <span className="text-red-500">*</span></label>
                    <textarea 
                      {...form.register("description")} 
                      className="w-full min-h-[120px] p-3 rounded-md border border-input focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Tell customers what makes your business special..."
                    />
                    {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Location & Contact</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Wilaya <span className="text-red-500">*</span></label>
                    <select {...form.register("wilayaId")} className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="">Select Wilaya</option>
                      {wilayas?.map(w => <option key={w.id} value={w.id}>{w.code} - {w.name}</option>)}
                    </select>
                    {form.formState.errors.wilayaId && <p className="text-red-500 text-xs">{form.formState.errors.wilayaId.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Detailed Address <span className="text-red-500">*</span></label>
                    <Input {...form.register("address")} placeholder="123 Rue Didouche Mourad" />
                    {form.formState.errors.address && <p className="text-red-500 text-xs">{form.formState.errors.address.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phone Number <span className="text-red-500">*</span></label>
                    <Input {...form.register("phone")} placeholder="0555 12 34 56" />
                    {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email (Optional)</label>
                    <Input {...form.register("email")} type="email" placeholder="contact@business.dz" />
                  </div>
                </div>
              </div>

              {/* Media & Hours */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Media & Extras</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Cover Image URL <span className="text-red-500">*</span></label>
                    <Input {...form.register("coverImage")} placeholder="https://images.unsplash.com/..." />
                    {form.formState.errors.coverImage && <p className="text-red-500 text-xs">{form.formState.errors.coverImage.message}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Provide a high-quality Unsplash image URL for your cover</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Opening Hours</label>
                    <textarea 
                      {...form.register("openingHours")} 
                      className="w-full min-h-[80px] p-3 rounded-md border border-input focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button size="lg" type="submit" disabled={createListing.isPending} className="px-10 text-lg h-14">
                  {createListing.isPending ? "Creating..." : "Submit Listing"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
