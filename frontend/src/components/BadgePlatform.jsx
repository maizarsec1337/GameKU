import React from 'react';
 
 // Mapping platform ke icon SVG
 const platformIcons = {
   'Steam': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
       <path d="M12 8v8M8 12h8" />
     </svg>
   ),
   'Steam Key': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M15 3H19C20.1046 3 21 3.89543 21 5V9" />
       <path d="M5 15V19C5 20.1046 5.89543 21 7 21H11" />
       <path d="M13 13L21 21" />
       <path d="M21 13L13 21" />
     </svg>
   ),
   'Steam Wallet': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <rect x="2" y="6" width="20" height="12" rx="2" />
       <circle cx="12" cy="12" r="2" />
       <path d="M6 12h.01M18 12h.01" />
     </svg>
   ),
   'Minecraft': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <rect x="3" y="3" width="18" height="18" rx="2" />
       <path d="M8 8h8M8 12h8M8 16h8" />
     </svg>
   ),
   'Xbox': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <rect x="2" y="2" width="20" height="20" rx="4" />
       <path d="M8 12a4 4 0 108 0 4 4 0 100 8 0" />
     </svg>
   ),
   'PlayStation': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <circle cx="12" cy="12" r="10" />
       <path d="M12 2v4M12 20v-4M2 12h4M20 12h-4" />
     </svg>
   ),
   'PlayStation Plus': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <circle cx="12" cy="12" r="10" />
       <path d="M12 6v6l3 3" />
     </svg>
   ),
   'Epic Games': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M15 3v18M9 3v18M3 9h18M3 15h18" />
     </svg>
   ),
   'EA App': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2L2 7l10 5 10-5-10-5z" />
       <path d="M2 17l10 5 10-5" />
       <path d="M2 12l10 5 10-5" />
     </svg>
   ),
   'Battle.net': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2L2 7l10 5 10-5-10-5z" />
       <path d="M2 17l10 5 10-5" />
       <path d="M2 12l10 5 10-5" />
     </svg>
   ),
   'Nintendo': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2v4M5 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" />
     </svg>
   ),
   'Voucher': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <line x1="2" y1="12" x2="22" y2="12" />
       <path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v6a3 3 0 01-3 3H5a3 3 0 01-3-3V9z" />
     </svg>
   ),
   'Gift Card': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <rect x="2" y="6" width="20" height="12" rx="2" />
       <circle cx="8" cy="12" r="1" />
       <path d="M15 12h.01M18 12h.01M21 12h.01" />
     </svg>
   ),
   'Google Play': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" />
       <path d="M12 8v8M8 12h8" />
     </svg>
   ),
   'Mobile Legends': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2L2 7l10 5 10-5-10-5z" />
       <path d="M2 17l10 5 10-5" />
       <path d="M2 12l10 5 10-5" />
     </svg>
   ),
   'Free Fire': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
     </svg>
   ),
   'PUBG': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2v4M5 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" />
     </svg>
   ),
   'Valorant': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <circle cx="12" cy="12" r="10" />
       <path d="M12 6v6l4 2" />
     </svg>
   ),
   'Genshin Impact': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2L2 7l10 5 10-5-10-5z" />
       <path d="M2 17l10 5 10-5" />
       <path d="M2 12l10 5 10-5" />
     </svg>
   ),
   'League of Legends': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M6 9h12M6 15h12M9 6v12M15 6v12" />
     </svg>
   ),
   'Honkai Star Rail': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2a10 10 0 00-7 17l5-3 2-6 2 6 5 3A10 10 0 0012 2z" />
     </svg>
   ),
   'Growtopia': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 2L2 7l10 5 10-5-10-5z" />
       <path d="M2 17l10 5 10-5" />
       <path d="M2 12l10 5 10-5" />
     </svg>
   ),
   'Roblox': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M2 12l10 5 10-5-10-5-10 5z" />
       <path d="M12 7v10" />
     </svg>
   ),
   'Multi Platform': (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M3 12l2-2 4 4 8-8 4 4" />
       <path d="M21 12l-2 2-4-4-8 8-4-4 4-4" />
     </svg>
   )
 };
 
 function BadgePlatform({ platform }) {
   if (!platform) return null;
   
   const icon = platformIcons[platform] || platformIcons['Multi Platform'];
   
   return (
     <div className="product-badge-platform">
       <span className="platform-icon">{icon}</span>
       <span className="platform-name">{platform}</span>
     </div>
   );
 }
 
 export default BadgePlatform;