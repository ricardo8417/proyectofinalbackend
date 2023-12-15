let product=""


//Eliminar Productos
const deleteProducts = async () => {
  const id = product;
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(`/api/products/${id}`, requestOptions)
    .then((response) => {
      if (response.status === 204) {
        console.log("Producto eliminado exitosamente");
      } else {
        console.error(
          "Error al eliminar el producto. Código de estado:",
          response.status
        );
      }
    })
    .catch((e) => {
      console.error("Error al eliminar el producto:", e);
    });
};
