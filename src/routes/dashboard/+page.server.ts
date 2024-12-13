export const load = ({ cookies }) => {
	cookies.delete('message_title', { path: '/' });
	cookies.delete('message_title2', { path: '/' });
	cookies.delete('message_description', {
		path: '/'
	});
	cookies.delete('message_description2', {
		path: '/'
	});
	cookies.delete('authenticated', { path: '/' });
};
