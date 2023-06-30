console.log('HomePage.js running');
const products = document.getElementById('products');


const updateCartLength = ()=>{
    const cartLength = document.getElementsByClassName('cart-length')[0];
    console.log(cartLength);

    fetch('/cart-length', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the appropriate content type
        },
        body: JSON.stringify({userID:localStorage.getItem('userID')}) // Convert data to JSON string
    })
    .then(response => {
        return response.json(); // or response.text() if expecting plain text
    })
    .then(data => {
        // Use the response data here
        console.log(data);
        if(data.success){
            console.log(data.success);
            cartLength.innerText = data.length;
        }
        else{
            cartLength.innerHTML = -1;
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch request
        console.error('Error:', error);
    });
}
updateCartLength();

fetch(`/products`)
.then(response => response.json())
.then(async data => {
    console.log(data);
    await data.forEach((e,i) => {
        const newProduct = document.createElement('div');
        newProduct.classList.add('col-md-3');
        newProduct.innerHTML = `
        <div class="product-card">
        <img src="${e.imageURL}" alt="${e.name}">
        <h3 class="product-name">${e.name}</h3>
        <p class="product-description">${e.description}</p>
        <span class="product-price">&#8377; ${e.price}</span>
        <button type="button" class="btn btn-primary add-to-cart-btn" id="${e._id}">Add to Cart</button>
        </div>
        `
        products.appendChild(newProduct);
    });

    await Array.from(document.getElementsByClassName('add-to-cart-btn')).forEach(e=>{
        e.addEventListener('click', async ()=>{
            console.log('Clicked on product with id : ', e.id);
            const userID = localStorage.getItem('userID');
            await fetch('/addtocart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the appropriate content type
                },
                body: JSON.stringify({userID,productID:e.id}) // Convert data to JSON string
            })
            .then(response => {
                return response.json(); // or response.text() if expecting plain text
            })
            .then(data => {
                // Use the response data here
                console.log(data);
                if(data.success){
                    console.log('Product Added to Cart');
                }
                else{
                    console.log('FAILED : Product NOT Added to Cart');
                }
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch request
                console.error('Error:', error);
            });
            updateCartLength();
        })
    });
    
})
.catch(error => {
    console.error(error);
});