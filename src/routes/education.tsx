import { createFileRoute } from '@tanstack/react-router';
import { ContentPage } from '../components/content-pages';
import { pageMeta } from '../lib/language';
export const Route = createFileRoute('/education')({head:()=>pageMeta('Курсы и вебинары O‘zSTTA','Программы обучения и заявки на курсы по трихологии.'),component:Page});
function Page(){return <ContentPage kind="education"/>}
