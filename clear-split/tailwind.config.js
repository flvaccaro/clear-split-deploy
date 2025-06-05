// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // permitimos alternar dark con una clase `.dark` en el root
//   darkMode: 'class',
//   content: ['./src/**/*.{html,ts}'],
//   theme: {
//     extend: {
//       colors: {
//         'ios-bg':   '#F2F2F7',
//         'ios-blue': '#007AFF',
//         'ios-gray': '#8E8E93',
//         // colores para dark-mode
//         'dark-bg':   '#1C1C1E',
//         'dark-card': '#2C2C2E',
//         'dark-text': '#E5E5EA'
//       },
//       boxShadow: {
//         card: '0 4px 16px rgba(0,0,0,0.08)',
//       },
//       borderRadius: {
//         '2xl': '1rem',
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // iOS-style light mode
        'ios-bg': '#F2F2F7',
        'ios-blue': '#007AFF',
        'ios-gray': '#8E8E93',
        'ios-border': '#D1D1D6',
        'ios-input': '#F9F9F9',

        // iOS-style dark mode
        'dark-bg': '#1C1C1E',
        'dark-card': '#2C2C2E',
        'dark-text': '#E5E5EA',
        'dark-input': '#3A3A3C',
      },
      boxShadow: {
        card: '0 4px 16px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
