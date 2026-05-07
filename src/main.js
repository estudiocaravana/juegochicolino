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
let posicionOriginal;
let limitesObjeto = null;
let ultimoAngulo = 0;
let angulo = PI / 2;
let animandoObjeto = false;

let tarjetaObjeto = document.getElementById("tarjetaObjeto");

document.querySelectorAll("#Playa > g, #Juegos > g").forEach((objeto) => {
  let svgPadre = objeto.closest("svg");
  let padre = objeto.parentNode;

  objeto.addEventListener("mouseover", () => {
    if (!animandoObjeto) {
      objeto.classList.add("seleccionado");
      animate(objeto, {
        scale: [{ to: "1.1", ease: "outElastic(1, 0.3)", duration: 1000 }],
      });
      animate(objeto, {
        rotate: "5deg",
        ease: "inOutSine",
        alternate: true,
        loop: true,
        duration: 2000,
      });
    }
  });

  objeto.addEventListener("mouseout", () => {
    if (!animandoObjeto) {
      objeto.classList.remove("seleccionado");
      animate(objeto, {
        scale: [{ to: "1", ease: "outElastic(1, 0.3)", duration: 1000 }],
        rotate: [{ to: "0", ease: "inOutSine", duration: 100 }],
      });
    }
  });

  objeto.addEventListener("click", () => {
    objeto.classList.remove("seleccionado");

    if (objeto.classList.contains("incorrecto")) {
      // OBJETO INCORRECTO

      // Primero añadimos la clase que permite las transiciones de colores
      // para que no entre en conflicto con la animación de hover
      objeto.classList.add("incorrectoClickado");
      objeto.classList.add("incorrectoSeleccionado");
      animandoObjeto = true;

      const indicaObjetoIncorrecto = createTimeline({
        defaults: { duration: 750 },
      });

      indicaObjetoIncorrecto
        .add(objeto, {
          rotate: "5deg",
          ease: "inOutSine",
          alternate: true,
          loop: 2,
          duration: 100,
        })
        .add(objeto, {
          rotate: 0,
          duration: 100,
        })
        .call(() => {
          objeto.classList.remove("incorrectoSeleccionado");
        })
        .call(() => {
          objeto.classList.remove("incorrectoClickado");
          animandoObjeto = false;
        }, 500);
    } else {
      // OBJETO CORRECTO

      if (!animandoObjeto) {
        animandoObjeto = true;

        // Obtenemos el bounding box del grupo para ajustar el viewBox de la tarjeta
        const bbox = objeto.getBBox();

        // Guardamos la posición de hijo original del grupo con respecto al padre
        posicionOriginal = Array.from(objeto.parentNode.children).indexOf(
          objeto,
        );
        objetoSeleccionado = objeto;
        padreSeleccionado = objeto.parentNode;

        const mueveObjetoATarjeta = createTimeline({
          defaults: { duration: 750 },
        });

        mueveObjetoATarjeta
          .add(objeto, {
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
            // Colocamos el objeto en el svg de la tarjeta
            let svgTarjetaObjeto = tarjetaObjeto.children[0];
            svgTarjetaObjeto.appendChild(objeto);

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
            objeto,
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

        // Devolvemos el objeto a su posición original
        const nodoDeReferencia =
          padreSeleccionado.children[posicionOriginal] || null;
        padreSeleccionado.insertBefore(objetoSeleccionado, nodoDeReferencia);
      })
      .add(objetoSeleccionado, {
        scale: { from: 0, to: 1 },
        ease: "outElastic(1, 0.3)",
        duration: 1000,
      })
      .call(() => {
        animandoObjeto = false;
        objetoSeleccionado = null;
      }, 1000);
  }
});
