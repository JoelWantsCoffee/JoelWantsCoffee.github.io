/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./out/*.js', './src/*.css', './.tmp/*.css', './*.html'],
  theme: {
    colors: {
      'flu': {
        0: '#FFFFFF',
        50: '#FAFAFA',
        100: '#F4F4F4',
        200: '#EDEEEF',
        300: '#E2E4E8',
        600: '#595959',
        700: '#08090B',
        800: '#000000'
      }
    }
  },
  plugins: [],
}

