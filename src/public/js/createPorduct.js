
document.querySelector('#createProductForm').addEventListener('submit', (e) => {
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
    formData.append('files', files.files[i]);
  }

  console.log(formData);
  fetch('/api/products', {
    method: 'POST',
    body: formData,
    headers: {
      // 'Content-type': 'application/json'
      // 'Content-Type': 'multipart/form-data'
      enctype: 'multipart/form-data'
    }
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === 'error') throw new Error(result);
    })
    .catch((error) => {
      console.log(error);
      console.log(`Ocurrio un error${error}`);
    });
});
