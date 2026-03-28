import { motion } from "framer-motion";

export function About() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/about-hero.png`} 
            alt="Luxurious spa interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Redefining Beauty in Algeria
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/90"
          >
            Jamila is more than a platform. It's a movement to elevate the standard of health, wellness, and beauty services across the nation.
          </motion.p>
        </div>
      </section>

      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="prose prose-lg md:prose-xl prose-rose mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-foreground font-bold text-center mb-12">Our Mission</h2>
          <p className="text-muted-foreground leading-loose text-center">
            For too long, discovering high-quality salons, aesthetic clinics, and spas in Algeria relied entirely on word-of-mouth. Jamila was founded to bridge the gap between exceptional service providers and clients seeking premium experiences. 
          </p>
          <p className="text-muted-foreground leading-loose text-center mt-6">
            We are curating the finest spaces across all 58 Wilayas, ensuring transparency through verified reviews, clear pricing, and detailed service menus. Whether you are looking for a quick haircut in Oran or a luxury hammam retreat in Algiers, Jamila guides you to spaces that celebrate your glow.
          </p>
        </div>
      </section>
    </div>
  );
}
