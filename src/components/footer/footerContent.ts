import Youtube from "/static/images/youtube.png";
import Twitter from "/static/images/twitter.png";
import Instagram from "/static/images/instagram.png";
import Twitch from "/static/images/twitch.png";



export const musicSFXLinks = [
   {name:'Login', links:'/login'},
   {name:'Browse', links:'/browse'},
   {name:'Pricing', links:'/pricing'},
   {name:'Submit Music', links:'/submit_music'},
];

export const productLinks = [
   {name:'FAQs', links:'/faq'},
   {name:'Terms & Conditions', links:'/terms-conditions'},
   {name:'Privacy Policy', links:'/privacy-policy'},
   {name:'Contact', links:'/contact'},
]; 

export const socialLinks = [
   { src: Instagram, alt: "Instagram",url:'https://www.instagram.com/syncorstream' },
   { src: Twitter, alt: "Twitter",url:'https://x.com/syncorstream?mx=2'  },
   { src: Twitch, alt: "Twitch",url:'https://www.twitch.tv/syncorstream'  },
   { src: Youtube, alt: "Youtube",url:'https://www.youtube.com/@SyncOrStream'  },
];
export const footerContent:string='Connect with us on social media for<br/> updates and special announcements!'
