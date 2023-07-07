const LoginForm = document.getElementById('loginForm');

LoginForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	const name = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	await fetch('/user/login', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({name,password})
	})
	.then(response => response.json())
	.then(data => {
		if(data.success){
			localStorage.setItem('userID', data.userID);
			LoginForm.reset();
			window.location.href = '/user/home';
		}
		else{
            console.log(`(LoginPage.js) : ${data}`);
            if(data.message === 'ERROR'){
                console.error(`(LoginPage.js) : ${data.error}`);
            }
        }
    })
    .catch(error => {
        console.error(`(LoginPage.js) : ${error}`);
    });

});