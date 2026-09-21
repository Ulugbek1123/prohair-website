import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Language = 'ru' | 'uz' | 'en';
const LanguageContext = createContext<{language: Language; setLanguage: (value: Language) => void}>({language: 'ru', setLanguage: () => {}});
export function LanguageProvider({children}: {children: ReactNode}) {
 const [language,setLanguage] = useState<Language>('ru');
 useEffect(() => { try { const saved=localStorage.getItem('ozstta-language'); if(saved==='ru'||saved==='uz'||saved==='en') setLanguage(saved); } catch {} },[]);
 useEffect(() => { document.documentElement.lang=language; },[language]);
 const change=(value:Language)=>{setLanguage(value);try{localStorage.setItem('ozstta-language',value)}catch{}};
 return <LanguageContext.Provider value={{language,setLanguage:change}}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const context=useContext(LanguageContext); return {...context, t:(ru:string,uz:string,en:string)=>({ru,uz,en}[context.language])}; }
export const pageMeta=(title:string,description:string)=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]});
