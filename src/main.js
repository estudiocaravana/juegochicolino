import "./style.css";

import { animate, svg, stagger } from "animejs";

document.querySelectorAll("#Playa > g, #Juegos > g").forEach((group) => {
  let cuadradoDibujado = false;
  let originalIndex;
  let drawable;
  let rect;

  group.addEventListener("mouseover", () => {
    if (!cuadradoDibujado) {
      group.classList.add("seleccionado");
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
    }
  });
  group.addEventListener("mouseout", () => {
    if (!cuadradoDibujado) {
      group.classList.remove("seleccionado");
      animate(group, {
        // y: [{ to: "0", ease: "outElastic(1, 0.3)", duration: 1000 }],
        scale: [{ to: "1", ease: "outElastic(1, 0.3)", duration: 1000 }],
        rotate: [{ to: "0", ease: "inOutSine", duration: 100 }],
      });
    }
  });

  // Al hacer clic, coloreamos el rectángulo de fondo
  group.addEventListener("click", () => {
    group.classList.remove("seleccionado");
    if (!cuadradoDibujado) {
      // Añade un cuadrado que rodea a cada grupo
      const bbox = group.getBBox();
      rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("class", "rectangulo");
      rect.setAttribute("x", bbox.x - 10);
      rect.setAttribute("y", bbox.y - 10);
      rect.setAttribute("width", bbox.width + 20);
      rect.setAttribute("height", bbox.height + 20);
      rect.setAttribute("fill", "#ffffff00"); // Transparente
      rect.setAttribute("pointer-events", "all");
      rect.setAttribute("stroke-width", 2);
      rect.setAttribute("stroke", "#000000");
      // Colocamos el rect al comienzo del grupo para que quede debajo de los elementos
      group.insertBefore(rect, group.firstChild);

      drawable = svg.createDrawable(rect);

      // Guardamos la posición de hijo original del grupo con respecto al padre
      originalIndex = Array.from(group.parentNode.children).indexOf(group);

      // Colocamos el grupo al final del padre para que quede por encima de los demás
      group.parentNode.appendChild(group);
    } else {
      // Devolvemos el grupo a su posición original
      const referenceNode = group.parentNode.children[originalIndex] || null;
      group.parentNode.insertBefore(group, referenceNode);
    }

    // Colocamos el grupo en el centro de la pantalla
    const groupRect = group.getBoundingClientRect();
    const centerY = window.innerHeight / 2;
    const centerX = window.innerWidth / 2;
    const offsetY = centerY - (groupRect.top + groupRect.height / 2);
    const offsetX = centerX - (groupRect.left + groupRect.width / 2);

    animate(group, {
      y: [
        {
          to: cuadradoDibujado ? 0 : offsetY,
          ease: "inOutQuad",
          duration: 500,
        },
      ],
      x: [
        {
          to: cuadradoDibujado ? 0 : offsetX,
          ease: "inOutQuad",
          duration: 500,
        },
      ],
      scale: [{ to: "2", ease: "inOutQuad", duration: 500 }],
      zIndex: [{ to: "1000", duration: 1 }],
    });

    animate(drawable, {
      draw: cuadradoDibujado ? ["0 1", "0 0"] : ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 500,
      delay: stagger(100),
    });
    animate(rect, {
      fill: cuadradoDibujado ? "#ffffff00" : "#ffffffff",
      ease: "inOutQuad",
      duration: 500,
    });
    // Borramos el rectángulo después de la animación si se está ocultando
    if (cuadradoDibujado) {
      setTimeout(() => {
        rect.remove();
      }, 500);
    }
    cuadradoDibujado = !cuadradoDibujado;
  });
});
