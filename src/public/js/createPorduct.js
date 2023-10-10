
const socket = io();
const tableProuctos = document.getElementById('realProductsTable');
const formCreateProduct = document.querySelector('#createProductForm');

formCreateProduct.addEventListener('submit', async (e) => {
  e.preventDefault();
  const files = document.getElementById('files');
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const price = document.getElementById('price').value;
  const code = document.getElementById('code').value;
  const stock = document.getElementById('stock').value;
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('code', code);
  formData.append('stock', stock);

  for (let i = 0; i < files.files.length; i++) {
    // console.log(files.files);
    // console.log(files.files[i]);
    formData.append('files', files);
  }

  // console.log(formData);
  try {
    const result = await fetch('/api/products', {
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-type': 'application/json'
        // 'Content-Type': 'multipart/form-data'
        enctype: 'multipart/form-data'
      }
    });

    const resultJSON = await result.json();
    if (resultJSON.status === 'error') {
      throw new Error(resultJSON.message);
    } else {
      const allProducts = await fetch('/api/products?limit=100');
      const allProductsJSON = await allProducts.json();
      if (allProductsJSON.status === 'error') {
        throw new Error(allProductsJSON.error);
      } else {
        socket.emit('productsTable', allProductsJSON.payload);
        // console.log('Todo Ok');
        formCreateProduct.reset();
      }
    }
  } catch (error) {
    console.log(error);
    console.log(`Ocurrio un error${error}`);
  }
});

const deleteProduct = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProductById(id);
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      );
    }
  });
};

const deleteProductById = async (id) => {
  try {
    const allProducts = await fetch(`/api/products/${id}`, {
      method: 'delete'
    });
    const allProducstJSON = await allProducts.json();
    if (allProducstJSON.status === 'error') {
      throw new Error(allProducstJSON.message);
    } else {
      // console.log(allProducstJSON);
      socket.emit('productsTable', allProducstJSON.payload);
    }
  } catch (error) {
    console.log(error);
    console.log(`Ocurrio un error${error}`);
  }
};

socket.on('updateProducts', (products) => {
  // console.log(data);
  tableProuctos.innerHTML = `<tr>
  <td class="bg-blue-100 border text-left px-8 py-4"></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Products</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Descripcion</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Precio</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Codigo</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>Stock</strong></td>
  <td class="bg-blue-100 border text-left px-8 py-4"><strong>thumbnail</strong></td>
  </tr>
  `;
  for (product of products) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border px-8 py-4">
        <button class="hover:bg-red-700 w-full bg-red-600 text-white font-bold p-2 cursor-pointer rounded-md" onclick="deleteProduct('${product._id})'">
          Eliminar
        </button>
        <button class="hover:bg-blue-700 w-full bg-red-600 text-white font-bold p-2 cursor-pointer rounded-md" onclick="deleteProduct('${product._id}')">
          Eliminar
        </button>
      </td>
      <td class="border px-8 py-4">${product.title}</td>
      <td class="border px-8 py-4">${product.description}</td>
      <td class="border px-8 py-4">${product.price}</td>
      <td class="border px-8 py-4">${product.code}</td>
      <td class="border px-8 py-4">${product.stock}</td>
      <td class="border px-8 py-4">
      ${product.thumbnail.map(
      (data) =>
        `<img 
            src="http://localhost:8000/public/img/${data.filename}" 
            alt="${data.filename}" 
            width="50" height="50"
          >`
    )}
      </td>
    `;

    tableProuctos.getElementsByTagName('tbody')[0].appendChild(tr);
  }
});
