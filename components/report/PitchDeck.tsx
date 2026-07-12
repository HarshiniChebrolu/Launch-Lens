import { StartupReport } from "@/types/report";

export default function PitchDeck({ report }: { report: StartupReport }) {
  return (
    <div className="deckGrid">
      {report.pitchDeck.slides.map((slide, index) => (
        <div className="deckSlide" key={slide.title}>
          <span>Slide {index + 1}</span>
          <h2>{slide.title}</h2>
          <p>{slide.subtitle}</p>

          <div>
            {slide.bullets.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}