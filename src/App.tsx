import { useCallback, useState } from "react";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { About } from "./components/About";
import { Contact, DEFAULT_PROJECT_MESSAGE } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ProjectDialog } from "./components/ProjectDialog";
import { AmbientFlow } from "./components/AmbientFlow";
import { PageLoader } from "./components/PageLoader";
import { SlideNavigation } from "./components/SlideNavigation";
import type { DemoKind } from "./types";

export function App() {
  const [demo, setDemo] = useState<DemoKind | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState(DEFAULT_PROJECT_MESSAGE);
  const finishLoading = useCallback(() => setLoaded(true), []);
  return (
    <>
      {!loaded && <PageLoader onComplete={finishLoading} />}
      <div className={`site-shell${loaded ? "" : " is-loading"}`}>
        <a className="skip" href="#main">
          Перейти к содержимому
        </a>
        <AmbientFlow />
        <SlideNavigation />
        <main id="main">
          <Hero />
          <Projects onOpen={setDemo} />
          <About />
          <div id="contact" className="slide slide-contact" data-slide>
            <Contact message={message} onMessageChange={setMessage} />
            <Footer />
          </div>
        </main>
        {demo && <ProjectDialog kind={demo} onClose={() => setDemo(null)} />}
      </div>
    </>
  );
}
