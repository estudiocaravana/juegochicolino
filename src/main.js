import "./style.css";

import { animate, svg, stagger } from "animejs";

animate(svg.createDrawable("#Playa"), {
  draw: ["0 0", "0 1", "1 1"],
  ease: "inOutQuad",
  duration: 2000,
  delay: stagger(100),
  loop: true,
});
