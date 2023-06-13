const socket = io();
const table = document.getElementById("realProductsTable");

document.getElementById("createBtn").addEventListener("click", () => {
  const body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    thumbnail: document.getElementById("thumbnail").value,
  };
  // const name = document.getElementById("title");
  // const files = document.getElementById("thumbnail");
  // const formData = new FormData();
  // formData.append("name", name.value);
  // for (let i = 0; i < files.files.length; i++) {
  //   formData.append("files", files.files[i]);
  // }
  // console.log(formData);
  fetch("/api/products", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
    })
    .then(() => fetch("/api/products"))
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      else socket.emit("productsTable", result.payload);
      alert("Todo Ok");
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("code").value = "";
      document.getElementById("stock").value = "";
    })
    .catch((error) => alert(`Ocurrio un error${error}`));
});

deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: "delete",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") {
        throw new Error(result.error);
      } else {
        // console.log(result);
        socket.emit("productsTable", result.payload);
        alert("Ok. Todo salio bien");
      }
    })
    .catch((error) => alert("Ocurrio un error"));
};

socket.on("updateProducts", (data) => {
  // console.log(data);
  table.innerHTML = `<tr>
  <td></td>
  <td><strong>Products</strong></td>
  <td><strong>Descripcion</strong></td>
  <td><strong>Precio</strong></td>
  <td><strong>Codigo</strong></td>
  <td><strong>Stock</strong></td>
  <td><strong>thumbnail
  </strong></td>
  </tr>
  `;
  for (product of data) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td><button onclick="deleteProduct(${product.id})">Eliminar</button></td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      ${product.thumbnail.map((data) => {
        return `<td>
          <img src=" http://localhost:8000/img/${data.filename}" alt="{{this.filename}}" width="50" height="50">
        </td>
      `;
      })}
      

    `;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});
