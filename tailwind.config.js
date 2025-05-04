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
        400: '#B8B9BC',
        500: '#898A8B',
        600: '#595959',
        700: '#08090B',
        800: '#000000'
      },
      'hl': {
        1: '#FFC0CB',
        11: '#90EE90'
      }
    }
  },
  plugins: [],
}

