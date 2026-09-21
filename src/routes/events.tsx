import { createFileRoute } from '@tanstack/react-router';
import { ContentPage } from '../components/content-pages';
import { pageMeta } from '../lib/language';
export const Route = createFileRoute('/events')({head:()=>pageMeta('Мероприятия O‘zSTTA — PROHAIR 2027 & PROHAIR 2026','PROHAIR 2027 в Ташкенте и PROHAIR 2026 в Самарканде.'),component:Page});
function Page(){return <ContentPage kind="events"/>}
