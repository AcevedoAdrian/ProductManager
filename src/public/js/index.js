const socket = io();
const table = document.getElementById('realProductsTable');

document.getElementById('createBtn').addEventListener('click', () => {
  const body = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    price: document.getElementById('price').value,
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
    files: document.getElementById('files').value
  };

  fetch('/api/products', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
      enctype: 'multipart/form-data'
    }
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === 'error') throw new Error(result.error);
    })
    .then(() => fetch('/api/products'))
    .then((result) => result.json())
    .then((result) => {
      if (result.status === 'error') throw new Error(result.error);
      else socket.emit('productsTable', result.payload);
      console.log('Todo Ok');
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';
      document.getElementById('price').value = '';
      document.getElementById('code').value = '';
      document.getElementById('stock').value = '';
    })
    .catch((error) => {
      console.log(error);
      console.log(`Ocurrio un error${error}`);
    });
});

deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: 'delete'
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === 'error') {
        throw new Error(result.error);
      } else {
        // console.log(result);
        socket.emit('productsTable', result.payload);
        alert('Ok. Todo salio bien');
      }
    })
    .catch((error) => alert('Ocurrio un error'));
};

socket.on('updateProducts', (data) => {
  // console.log(data);
  table.innerHTML = `<tr>
  <td class="bg-blue-100 border text-left px-8 py-4"></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Products</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Descripcion</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Precio</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Codigo</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Stock</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>thumbnail</strong></td>
  </tr>
  `;
  for (product of data) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="border px-8 py-4">
        <button class="hover:bg-red-700 w-full bg-red-600 text-white font-bold p-2 cursor-pointer rounded-md" onclick="deleteProduct(${product.id
      })">
      Eliminar</button>
      </td>
      <td class="border px-8 py-4">${product.title}</td>
      <td class="border px-8 py-4">${product.description}</td>
      <td class="border px-8 py-4">${product.price}</td>
      <td class="border px-8 py-4">${product.code}</td>
      <td class="border px-8 py-4">${product.stock}</td>
      <td class="border px-8 py-4">
      ${product.thumbnail.map(
        (data) =>
          `<img src="http://localhost:8000/img/${data.filename}" alt="${data.filename}" width="50" height="50">`
      )}
      </td>
    `;

    table.getElementsByTagName('tbody')[0].appendChild(tr);
  }
});
