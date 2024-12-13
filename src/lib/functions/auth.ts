import { type ServerLoadEvent } from '@sveltejs/kit';

export const checkAuth = async (event: ServerLoadEvent) => {
    const cookies = event.cookies;
    const authenticated = cookies.get('authenticated');
    if (authenticated === 'true') {
        return true;
    }
    return false;
}