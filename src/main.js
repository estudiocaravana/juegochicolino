import "./style.css";

import { animate, createTimeline, svg, stagger, text } from "animejs";

document.querySelectorAll("#Playa > g, #Juegos > g").forEach((group) => {
  let svgPadre = group.closest("svg");
  let padre = group.parentNode;

  let animandoObjeto = false;
  let originalIndex;
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
        // Añade un cuadrado que rodea a cada grupo
        const bbox = group.getBBox();
        tarjeta = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        tarjeta.setAttribute("class", "rectangulo");
        tarjeta.setAttribute("x", bbox.x - 10);
        tarjeta.setAttribute("y", bbox.y - 10);
        tarjeta.setAttribute("width", bbox.width + 400);
        tarjeta.setAttribute("height", bbox.height + 20);
        tarjeta.setAttribute("fill", "#ffffff00"); // Transparente
        tarjeta.setAttribute("pointer-events", "all");
        tarjeta.setAttribute("stroke-width", 2);
        tarjeta.setAttribute("stroke", "#000000");
        tarjeta.setAttribute("rx", "5");
        tarjeta.setAttribute("ry", "5");
        // Colocamos el rect al comienzo del grupo para que quede debajo de los elementos
        group.insertBefore(tarjeta, group.firstChild);

        textoTarjeta = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        textoTarjeta.setAttribute("class", "texto-tarjeta");
        textoTarjeta.setAttribute("x", bbox.x + bbox.width + 50);
        textoTarjeta.setAttribute("y", bbox.y + 20);
        textoTarjeta.setAttribute("text-anchor", "left");
        textoTarjeta.setAttribute("opacity", "0");
        textoTarjeta.setAttribute("dominant-baseline", "middle");

        let texto =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut mollis sapien, at aliquet mi. Aliquam venenatis a dolor quis fringilla. Phasellus gravida rutrum ante. Etiam at orci sit amet quam pulvinar imperdiet. Proin eget volutpat diam, quis rhoncus nisl.";

        let lineas = texto.match(/.{1,40}/g); // Dividir el texto en líneas de 40 caracteres
        lineas.forEach((linea, index) => {
          const tspan = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan",
          );
          tspan.setAttribute("x", bbox.x + bbox.width + 50);
          tspan.setAttribute("y", bbox.y + 20 + index * 20);
          tspan.textContent = linea;
          textoTarjeta.appendChild(tspan);
        });
        group.append(textoTarjeta);

        drawable = svg.createDrawable(tarjeta);

        // Guardamos la posición de hijo original del grupo con respecto al padre
        originalIndex = Array.from(group.parentNode.children).indexOf(group);

        // Colocamos el grupo al final del padre para que quede por encima de los demás
        group.parentNode.appendChild(group);
        // svgPadre.appendChild(group);

        // Colocamos el grupo en el centro de la pantalla
        const groupRect = group.getBoundingClientRect();
        const centerY = window.clientHeight / 2;
        const centerX = window.clientWidth / 2;
        const offsetY = centerY - (groupRect.top + groupRect.height / 2);
        const offsetX = centerX - (groupRect.left + groupRect.width / 2);

        const tl = createTimeline({ defaults: { duration: 750 } });

        tl.label("start")
          .add(
            group,
            {
              scale: [{ to: "2", ease: "outElastic(1, 0.3)", duration: 1000 }],
            },
            "start",
          )
          .add(
            drawable,
            {
              draw: ["0 0", "0 1"],
              ease: "inOutQuad",
              duration: 500,
              delay: stagger(100),
            },
            200,
          )
          .add(
            tarjeta,
            {
              fill: "#ffffffff",
              ease: "inOutQuad",
              duration: 500,
            },
            400,
          )
          .add(
            textoTarjeta,
            {
              opacity: 1,
              ease: "inOutQuad",
              duration: 1000,
              delay: stagger(100),
            },
            400,
          )
          .add(group, {
            rotate: "2deg",
            ease: "inOutSine",
            alternate: true,
            loop: true,
            duration: 4000,
          });
      } else {
        const tl = createTimeline({ defaults: { duration: 750 } });

        tl.label("start")
          .add(
            drawable,
            {
              draw: ["0 1", "0 0"],
              ease: "inOutQuad",
              duration: 300,
              // delay: stagger(100),
            },
            "start",
          )
          .add(
            tarjeta,
            {
              fill: "#ffffff00",
              ease: "inOutQuad",
              duration: 500,
            },
            200,
          )
          .add(
            group,
            {
              y: [
                {
                  to: 0,
                  ease: "inOutQuad",
                  duration: 500,
                },
              ],
              x: [
                {
                  to: 0,
                  ease: "inOutQuad",
                  duration: 500,
                },
              ],
              scale: [{ to: "1", ease: "outElastic(1, 0.3)", duration: 1000 }],
            },
            300,
          )
          .call(() => {
            // Devolvemos el grupo a su posición original
            const referenceNode =
              group.parentNode.children[originalIndex] || null;
            group.parentNode.insertBefore(group, referenceNode);

            tarjeta.remove();
            textoTarjeta.remove();

            animandoObjeto = false;
          }, 300);
      }
    }
  });
});
