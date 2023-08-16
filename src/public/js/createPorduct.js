
document.querySelector('#createProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const body = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    price: document.getElementById('price').value,
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
    files: document.getElementById('files').value
  };
  // const files = dt.files;
  console.log(e.currentTarget.action);
});
