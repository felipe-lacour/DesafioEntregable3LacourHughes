const socketClient = io();
const submitButton = document.getElementById('submitButton')
const productForm = document.getElementById('productForm');
const main = document.getElementById('mainId')
const productDelete = document.getElementById('productDeleteForm');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = productForm.elements.title.value;
  const description = productForm.elements.description.value;
  const code = productForm.elements.code.value;
  const price = parseInt(productForm.elements.price.value);
  const stock = parseInt(productForm.elements.stock.value);
  const category = productForm.elements.category.value;

  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category
  };

  socketClient.emit('productEvent', newProduct);
})

productDelete.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = productDelete.elements.id.value;

  socketClient.emit('productDelete', id);
})

socketClient.on('cambiosProductos', (data) => {
  main.innerHTML = '';
  data.forEach(i => armadorCatalogo(i));
});

socketClient.on('productDeleted', (data) => {
  main.innerHTML = '';
  data.forEach(i => armadorCatalogo(i));
})

function armadorCatalogo (i) {
  const item = document.createElement('div')
  item.classList.add('flex','flex-col', 'text-left','p-2','m-2','justify-between','border-2','border-slate-300','rounded-lg')
  item.innerHTML = `
  <h2 class="text-lg font-bold text-center">${i.title}</h2>
  <p>${i.description}</p>
  <h3 class="font-bold text-md">${i.price}</h3>
  <div class="flex justify-between">
    <h4>Stock:${i.stock}</h4>
    <h5 class="font-bold text-red-800">Id:${i.id}</h5>
  </div>
  `

  main.append(item)
}
