export function signUp(email: string, password: string, name: string) {
	const params = { email, password, name };
	return fetch('/api/sign-up/', {
		method: 'POST',
		headers: {
			'Content-Type': 'applicatioin/json'
		},
		body: JSON.stringify(params),
	});
}
