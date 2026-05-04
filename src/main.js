import "./style.css";

import { animate, svg, stagger } from "animejs";

document.querySelectorAll("#Playa > g, #Juegos > g").forEach((group) => {
  group.addEventListener("mouseover", () => {
    animate(group, {
      y: [{ to: "-1rem", ease: "outBounce", duration: 300 }],
    });
  });
  group.addEventListener("mouseout", () => {
    animate(group, {
      y: 0,
      duration: 500,
      easing: "outBounce",
    });
  });
});
