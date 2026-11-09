import { useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!loaded) return;

    const images: HTMLImageElement[] = [];
    const imageTimer = window.setTimeout(() => {
      [
        "/projects/smartberry.png",
        "/projects/tusur-bot.jpg",
        "/projects/tusur-miniapp.jpg",
        "/projects/learning-course.svg",
      ].forEach((src) => {
        const image = new Image();
        image.decoding = "async";
        image.src = src;
        images.push(image);
      });
    }, 400);

    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      }
    ).connection;
    const preloadVideo =
      !connection?.saveData &&
      !["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
    let video: HTMLVideoElement | undefined;
    const videoTimer = preloadVideo
      ? window.setTimeout(() => {
          video = document.createElement("video");
          video.preload = "auto";
          video.muted = true;
          video.src = "/projects/smartberry-scroll.mp4";
          video.load();
        }, 1800)
      : undefined;

    return () => {
      window.clearTimeout(imageTimer);
      if (videoTimer !== undefined) window.clearTimeout(videoTimer);
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [loaded]);

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
