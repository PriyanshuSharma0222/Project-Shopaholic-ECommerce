console.log('addProduct.js running');
const RegisterForm = document.getElementById('AddProduct');

RegisterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageURL = document.getElementById('imageURL').value;
    const price = document.getElementById('price').value;
    const tags = ["men","watch"];
    console.log(name,description,price);

    try {
        const response = await fetch('/addproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name,description,imageURL,price,tags})
        });
        if (response.status == 200) {
            console.log('Successful');
        } else {
            console.error('Failed');
        }
    } 
    catch (error) {
        console.error('An error occurred:', error.message);
    }

    RegisterForm.reset();
});