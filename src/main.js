import "./style.css";

import { animate, svg, stagger } from "animejs";

document.querySelectorAll("#Playa > g, #Juegos > g").forEach((group) => {
  group.addEventListener("mouseover", () => {
    animate(group, {
      // y: [{ to: "-1rem", ease: "outElastic(1, 0.3)", duration: 1000 }],
      scale: [{ to: "1.1", ease: "outElastic(1, 0.3)", duration: 1000 }],
      zIndex: [{ to: "100", duration: 1 }],
    });
    animate(group, {
      rotate: "5deg",
      ease: "inOutSine",
      alternate: true,
      loop: true,
      duration: 2000,
    });
  });
  group.addEventListener("mouseout", () => {
    animate(group, {
      // y: [{ to: "0", ease: "outElastic(1, 0.3)", duration: 1000 }],
      scale: [{ to: "1", ease: "outElastic(1, 0.3)", duration: 1000 }],
      rotate: [{ to: "0", ease: "inOutSine", duration: 100 }],
    });
  });
});
