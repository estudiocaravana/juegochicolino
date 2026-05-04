/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      // Configuraciones personalizadas aquí
      colors: {
        // Colores personalizados si los necesitas
      },
      spacing: {
        // Espaciados personalizados si los necesitas
      },
      fontFamily: {
        // Fuentes personalizadas si las necesitas
      },
    },
  },
  plugins: [
    // Plugins adicionales aquí
    // require('@tailwindcss/typography'),
  ],
};
