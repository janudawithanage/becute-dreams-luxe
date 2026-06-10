import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/pages/home/components/Hero";
import { Categories } from "@/pages/home/components/Categories";
import { About } from "@/pages/home/components/About";
import { Trending } from "@/pages/home/components/Trending";
import { Gallery } from "@/pages/home/components/Gallery";
import { Testimonials } from "@/pages/home/components/Testimonials";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Categories />
      <About />
      <Trending />
      <Gallery />
      <Testimonials />
    </>
  );
}
