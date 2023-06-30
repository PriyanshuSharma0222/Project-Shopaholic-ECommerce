console.log('login.js running');
const LoginForm = document.getElementById('loginForm');

LoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(name,password);

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the appropriate content type
      },
      body: JSON.stringify({name,password}) // Convert data to JSON string
    })
    .then(response => {
      return response.json(); // or response.text() if expecting plain text
    })
    .then(data => {
      // Use the response data here
      console.log(data);
      if(data.success){
        console.log('Successful Login');
        localStorage.setItem('userID', data.userID);
        console.log('LocalStorage : userID - ', localStorage.getItem('userID'));
        window.location.href = '/home';
      }
      else{
        console.log(`Unsuccessful Login : ${data.message}`);
      }
    })
    .catch(error => {
      // Handle any errors that occurred during the fetch request
      console.error('Error:', error);
    });

    // Clear the form inputs
    LoginForm.reset();
});