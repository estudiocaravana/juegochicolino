import "./style.css";

import {
  animate,
  createTimeline,
  createAnimatable,
  cubicBezier,
  svg,
  stagger,
  text,
} from "animejs";

const { PI } = Math;

let objetoSeleccionado = null;
let padreSeleccionado = null;
let originalIndex;
let objetoBounds = null;
let lastAngle = 0;
let angle = PI / 2;
let animandoObjeto = false;

let tarjetaObjeto = document.getElementById("tarjetaObjeto");

document.querySelectorAll("#Playa > g, #Juegos > g").forEach((group) => {
  let svgPadre = group.closest("svg");
  let padre = group.parentNode;

  let drawable;
  let textoDrawable;
  let tarjeta;
  let textoTarjeta;

  group.addEventListener("mouseover", () => {
    if (!animandoObjeto) {
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
    if (!animandoObjeto) {
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

    if (group.classList.contains("incorrecto")) {
      // OBJETO INCORRECTO

      // Primero añadimos la clase que permite las transiciones de colores
      // para que no entre en conflicto con la animación de hover
      group.classList.add("incorrectoClickado");
      group.classList.add("incorrectoSeleccionado");
      animandoObjeto = true;
      const tl = createTimeline({ defaults: { duration: 750 } });

      tl.label("start")
        .add(group, {
          rotate: "5deg",
          ease: "inOutSine",
          alternate: true,
          loop: 2,
          duration: 100,
        })
        .add(group, {
          rotate: 0,
          duration: 100,
        })
        .call(() => {
          group.classList.remove("incorrectoSeleccionado");
        })
        .call(() => {
          group.classList.remove("incorrectoClickado");
          animandoObjeto = false;
        }, 500);
    } else {
      // OBJETO CORRECTO

      if (!animandoObjeto) {
        animandoObjeto = true;

        const bbox = group.getBBox();

        // Guardamos la posición de hijo original del grupo con respecto al padre
        originalIndex = Array.from(group.parentNode.children).indexOf(group);
        objetoSeleccionado = group;
        padreSeleccionado = group.parentNode;

        const objetoATarjeta = createTimeline({ defaults: { duration: 750 } });

        objetoATarjeta
          .add(group, {
            rotate: 0,
            scale: [
              {
                from: "1",
                to: "0",
                duration: 200,
                ease: cubicBezier(0.5, 0, 0.9, 0.3),
              },
            ],
            duration: 200,
          })
          .call(() => {
            let svgTarjetaObjeto = tarjetaObjeto.children[0];
            // Colocamos el grupo en tarjetaObjeto
            svgTarjetaObjeto.appendChild(group);

            // Ajustamos el viewBox para que el group cubra toda la extensión y quede centrado
            const padding = 20;
            const viewBoxX = bbox.x - padding;
            const viewBoxY = bbox.y - padding;
            const viewBoxWidth = bbox.width + padding * 2;
            const viewBoxHeight = bbox.height + padding * 2;
            svgTarjetaObjeto.setAttribute(
              "viewBox",
              `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
            );

            tarjetaObjeto.classList.remove("hidden");
          })
          .add(tarjetaObjeto, {
            scale: { from: 0, to: 1 },
            ease: "outElastic(1, 0.3)",
            duration: 1000,
          })
          .add(
            group,
            {
              scale: { from: 0, to: 1 },
              ease: "outElastic(1, 0.3)",
              duration: 1000,
            },
            400,
          );
      }
    }
  });
});

const onMouseMove = (e) => {
  if (objetoSeleccionado) {
    const { width, height, left, top } = objetoBounds;
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    const currentAngle = Math.atan2(y, x);
    const diff = currentAngle - lastAngle;
    angle += diff > PI ? diff - 2 * PI : diff < -PI ? diff + 2 * PI : diff;
    lastAngle = currentAngle;
    objetoSeleccionado.rotate(angle); // Pass the new angle value in rad
  }
};

// window.addEventListener("mousemove", onMouseMove);

const cerrarTarjeta = document.getElementById("cerrarTarjeta");

cerrarTarjeta.addEventListener("click", () => {
  if (objetoSeleccionado) {
    const objetoAPosicion = createTimeline({ defaults: { duration: 750 } });

    objetoAPosicion
      .add(objetoSeleccionado, {
        scale: { from: 1, to: 0 },
        ease: cubicBezier(0.5, 0, 0.9, 0.3),
        duration: 300,
      })
      .add(tarjetaObjeto, {
        scale: { from: 1, to: 0 },
        ease: cubicBezier(0.5, 0, 0.9, 0.3),
        duration: 300,
      })
      .call(() => {
        tarjetaObjeto.classList.add("hidden");

        // Devolvemos el grupo a su posición original
        const referenceNode = padreSeleccionado.children[originalIndex] || null;
        padreSeleccionado.insertBefore(objetoSeleccionado, referenceNode);
      })
      .add(objetoSeleccionado, {
        scale: { from: 0, to: 1 },
        ease: "outElastic(1, 0.3)",
        duration: 1000,
      })
      .call(() => {
        animandoObjeto = false;
        objetoSeleccionado = null;
      });
  }
});
