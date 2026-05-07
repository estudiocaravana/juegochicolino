import "./style.css";

import {
  animate,
  createTimeline,
  createAnimatable,
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
    // if (!animandoObjeto) {
    //   group.classList.add("seleccionado");
    //   animate(group, {
    //     // y: [{ to: "-1rem", ease: "outElastic(1, 0.3)", duration: 1000 }],
    //     scale: [{ to: "1.1", ease: "outElastic(1, 0.3)", duration: 1000 }],
    //     zIndex: [{ to: "100", duration: 1 }],
    //   });
    //   animate(group, {
    //     rotate: "5deg",
    //     ease: "inOutSine",
    //     alternate: true,
    //     loop: true,
    //     duration: 2000,
    //   });
    // }
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
        // // Añade un cuadrado que rodea a cada grupo
        // const bbox = group.getBBox();
        // tarjeta = document.createElementNS(
        //   "http://www.w3.org/2000/svg",
        //   "rect",
        // );
        // tarjeta.setAttribute("class", "rectangulo");
        // tarjeta.setAttribute("x", bbox.x - 10);
        // tarjeta.setAttribute("y", bbox.y - 10);
        // tarjeta.setAttribute("width", bbox.width + 400);
        // tarjeta.setAttribute("height", bbox.height + 20);
        // tarjeta.setAttribute("fill", "#ffffff00"); // Transparente
        // tarjeta.setAttribute("pointer-events", "all");
        // tarjeta.setAttribute("stroke-width", 2);
        // tarjeta.setAttribute("stroke", "#000000");
        // tarjeta.setAttribute("rx", "5");
        // tarjeta.setAttribute("ry", "5");
        // // Colocamos el rect al comienzo del grupo para que quede debajo de los elementos
        // group.insertBefore(tarjeta, group.firstChild);

        // textoTarjeta = document.createElementNS(
        //   "http://www.w3.org/2000/svg",
        //   "text",
        // );
        // textoTarjeta.setAttribute("class", "texto-tarjeta");
        // textoTarjeta.setAttribute("x", bbox.x + bbox.width + 50);
        // textoTarjeta.setAttribute("y", bbox.y + 20);
        // textoTarjeta.setAttribute("text-anchor", "left");
        // textoTarjeta.setAttribute("opacity", "0");
        // textoTarjeta.setAttribute("dominant-baseline", "middle");

        // let texto =
        //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut mollis sapien, at aliquet mi. Aliquam venenatis a dolor quis fringilla. Phasellus gravida rutrum ante. Etiam at orci sit amet quam pulvinar imperdiet. Proin eget volutpat diam, quis rhoncus nisl.";

        // let lineas = texto.match(/.{1,40}/g); // Dividir el texto en líneas de 40 caracteres
        // lineas.forEach((linea, index) => {
        //   const tspan = document.createElementNS(
        //     "http://www.w3.org/2000/svg",
        //     "tspan",
        //   );
        //   tspan.setAttribute("x", bbox.x + bbox.width + 50);
        //   tspan.setAttribute("y", bbox.y + 20 + index * 20);
        //   tspan.textContent = linea;
        //   textoTarjeta.appendChild(tspan);
        // });
        // group.append(textoTarjeta);

        // drawable = svg.createDrawable(tarjeta);

        // Guardamos la posición de hijo original del grupo con respecto al padre
        originalIndex = Array.from(group.parentNode.children).indexOf(group);
        objetoSeleccionado = group;
        padreSeleccionado = group.parentNode;

        let svgTarjetaObjeto = tarjetaObjeto.children[0];
        // Colocamos el grupo en tarjetaObjeto
        svgTarjetaObjeto.appendChild(group);

        // Ajustamos el viewBox para que el group cubra toda la extensión y quede centrado
        const bbox = group.getBBox();
        const padding = 20;
        const viewBoxX = bbox.x - padding;
        const viewBoxY = bbox.y - padding;
        const viewBoxWidth = bbox.width + padding * 2;
        const viewBoxHeight = bbox.height + padding * 2;
        svgTarjetaObjeto.setAttribute(
          "viewBox",
          `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
        );

        // Colocamos el grupo en el centro de la pantalla
        objetoBounds = group.getBoundingClientRect();
        const centerY = window.clientHeight / 2;
        const centerX = window.clientWidth / 2;
        const offsetY = centerY - (objetoBounds.top + objetoBounds.height / 2);
        const offsetX = centerX - (objetoBounds.left + objetoBounds.width / 2);

        const tl = createTimeline({ defaults: { duration: 750 } });

        // animate(group, {
        //   x: 0,
        //   y: 0,
        //   // scale: 2,
        // });

        // tl.label("start").add(
        //   group,
        //   {
        //     scale: [{ to: "10", ease: "outElastic(1, 0.3)", duration: 1000 }],
        //   },
        //   "start",
        // );
        //   .add(
        //     drawable,
        //     {
        //       draw: ["0 0", "0 1"],
        //       ease: "inOutQuad",
        //       duration: 500,
        //       delay: stagger(100),
        //     },
        //     200,
        //   )
        //   .add(
        //     tarjeta,
        //     {
        //       fill: "#ffffffff",
        //       ease: "inOutQuad",
        //       duration: 500,
        //     },
        //     400,
        //   )
        //   .add(
        //     textoTarjeta,
        //     {
        //       opacity: 1,
        //       ease: "inOutQuad",
        //       duration: 1000,
        //       delay: stagger(100),
        //     },
        //     400,
        //   )
        //   .add(group, {
        //     rotate: "2deg",
        //     ease: "inOutSine",
        //     alternate: true,
        //     loop: true,
        //     duration: 4000,
        //   });

        // objetoSeleccionado = createAnimatable(group, {
        //   rotate: { unit: "rad" }, // Set the unit to 'rad'
        //   duration: 400,
        // });
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
    // Devolvemos el grupo a su posición original
    const referenceNode = padreSeleccionado.children[originalIndex] || null;
    padreSeleccionado.insertBefore(objetoSeleccionado, referenceNode);

    animandoObjeto = false;
    objetoSeleccionado = null;
  }
});
