import "./style.css";

import { animate, svg, stagger } from "animejs";

document.querySelectorAll("#Playa > g, #Juegos > g").forEach((group) => {
  group.addEventListener("mouseover", () => {
    animate(group, {
      y: [{ to: "-1rem", ease: "outElastic(1, 0.3)", duration: 1000 }],
    });
  });
  group.addEventListener("mouseout", () => {
    animate(group, {
      y: [{ to: "0", ease: "outElastic(1, 0.3)", duration: 1000 }],
    });
  });
});
