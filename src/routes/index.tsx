import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { About } from "@/components/home/About";
import { Trending } from "@/components/home/Trending";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";

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
