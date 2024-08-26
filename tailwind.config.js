/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         colors: {
            'primary-blue': '#0816bf',
            'custom-gradient-start': '#FB8A2E',
         },
         backgroundImage:{
            'custom-gradient': ' linear-gradient(90deg, #FB8A2E -15.19%, #0714BD 111.92%)',
            'button-gradient':' linear-gradient(159.16deg, #0714BD 26.46%, rgba(7, 20, 189, 0) 116.55%)',
            'background-gradient':' linear-gradient(90deg, rgba(57,27,2,1) 0%, rgba(2,0,36,1) 95%)',
          
            
         },
         boxShadow: {
            'custom-light': '0 -5px 15px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.3), -5px 0 15px rgba(0, 0, 0, 0.3), 5px 0 15px rgba(0, 0, 0, 0.3) ',
            'custom-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }
      },
   },
   plugins: [],
}

