import { Hero } from "@/components/hero/Hero";
import { JsonLd, personSchema } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Overview } from "@/components/sections/Overview";
import { Record } from "@/components/sections/Record";
import { Telemetry } from "@/components/sections/Telemetry";
import { Work } from "@/components/sections/Work";
import { Writing } from "@/components/sections/Writing";
import { getPosts } from "@/lib/content";

/** The home page is Saif's datasheet: features, work, history, record, characteristics, then the order card. */
export default function Home() {
  const posts = getPosts();

  return (
    <>
      <JsonLd data={personSchema()} />
      <main id="content">
        <Hero />
        <Overview />
        <Work />
        <Experience />
        <Record />
        <Capabilities />
        <Telemetry />
        {posts.length > 0 && <Writing posts={posts} />}
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
