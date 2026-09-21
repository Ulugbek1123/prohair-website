import { createFileRoute } from '@tanstack/react-router';
import { ContentPage } from '../components/content-pages';
import { pageMeta } from '../lib/language';
export const Route = createFileRoute('/contacts')({head:()=>pageMeta('Контакты O‘zSTTA','Телефон +998 77 300 30 80. Email info@prohair.uz.'),component:Page});
function Page(){return <ContentPage kind="contacts"/>}
