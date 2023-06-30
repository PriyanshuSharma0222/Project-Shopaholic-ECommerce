console.log('register.js running');
const RegisterForm = document.getElementById('RegisterForm');

RegisterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;

    console.log(name,email,phone,address,password);
    try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name,email,password,phone,address})
        });
        console.log(response);
        if (response.status) {
          // Registration successful
          console.log('Registration successful');
          window.location.href = '/login';
        } else {
          // Handle error
          console.error('Registration failed');
        }
    } 
    catch (error) {
        console.error('An error occurred:', error.message);
    }
    // Perform further actions with the username and password
    // const newUser = await new User({name,email,phone,address,password}).save();
    // console.log('User saved');
    
    // Clear the form inputs
    RegisterForm.reset();
    // window.location.href = 'cart';
});