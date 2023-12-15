let cart = "";
 
const obteUser = async () => {
 await fetch("/api/session/current")
 
  .then(response => response.json())
  .then(data => {
    if (data._id) {
      cart = data.cartId;
      console.log("id del carrito es:", cart);
    } else {
      console.log("Usuario no registrado");
    }
  })
}
obteUser()


const addCart = (id) => {
  const cid =cart;
  const pid = id;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: 1 }),
  };

  fetch(`/api/carts/${cid}/product/${pid}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("productos:",data);
    })
    .catch((error) => {
      console.error("Error al agregar el producto al carrito:", error);
    });
};



const deleteProduct = async (id) => {
  const cid = cart;
  const pid = id;
  console.log("id del carrito es:",cid)
  console.log("id del producto es:", pid);
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`/api/carts/${cid}/product/${pid}`, requestOptions)
    .then((response) => {
     console.log(response);
         })
    .catch((error) => {
      console.error("Error al eliminar el producto:", error);
    });
};


//vaciar carrito
const deleteCart = async () => {
  const id = cart
  const response = await fetch(`/api/carts/${id}`,{
    method:"PUT",
    headers:{"Content-Type": "application.json"}
  }); 
  try {
    if(response.ok){
      window.location.href= `/carts/${cart}`
    } else {
      console.log("Error al eliminar los productos");
    }
  } catch (error) {
    console.log("Algo ha salido mal")
  }
}


// obtengo el número de productos en el carrito
fetch("/cart/count")
  .then((response) => response.json())
  .then((data) => {
    console.log(
      (document.getElementById("countCart").textContent = data.count)
    );
  })
  .catch((error) => {
    console.error(
      "Error al obtener el número de productos en el carrito:",
      error
    );
  });
