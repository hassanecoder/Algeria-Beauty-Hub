import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Pages
import { Home } from "./pages/home";
import { Listings } from "./pages/listings";
import { ListingDetail } from "./pages/listing-detail";
import { SubmitListing } from "./pages/submit-listing";
import { About } from "./pages/about";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  }
});

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route path="/search" component={Listings} /> {/* Search reuses listings view with pre-filled filters */}
      <Route path="/listings/:id" component={ListingDetail} />
      <Route path="/submit" component={SubmitListing} />
      <Route path="/about" component={About} />
      {/* Catch-all for category/wilaya routing logic handling in lists via query params */}
      <Route path="/categories/:slug">
        {({ slug }) => {
          // A real app might redirect or render Listings with the category param
          window.location.href = `${import.meta.env.BASE_URL}listings?category=${slug}`;
          return null;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={baseUrl}>
          <MainLayout>
            <Router />
          </MainLayout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
