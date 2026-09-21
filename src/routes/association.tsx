import { createFileRoute } from '@tanstack/react-router';
import { ContentPage } from '../components/content-pages';
import { pageMeta } from '../lib/language';
export const Route = createFileRoute('/association')({head:()=>pageMeta('Об ассоциации O‘zSTTA','Миссия, направления работы и членство в ассоциации трихологии.'),component:Page});
function Page(){return <ContentPage kind="association"/>}
