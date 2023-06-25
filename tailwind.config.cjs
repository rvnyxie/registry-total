/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],

  plugins: [
    require('flowbite/plugin')
  ],

  theme: {
    // Override default sans font family
    fontFamily: {
      sans: ['Quicksand', 'ui-sans-serif', 'system-ui', '-apple-system']
    },

    // Add custom theme colors
    extend: {
      colors: {
        primary_color: '#FCF2E1',
        secondary_color: '#675D50',
        brown: '#675D50',
        light_yellow: '#FCEDD2',
        input_background: '#FCEDD2',
        special_text: '#AD6136',
        orange: '#E75B26',
        error_red: '#A22828',
        light_green: '#C5E8C3',
        yellow: '#FAD592',
        cool_blue: '#4FC0D0',
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        }
      }
    }
  }
}

module.exports = config
