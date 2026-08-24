const { data } = require("./store-data");

function getAllProducts() {
  return [...data];
}

function getProductById(id) {
  const p = data.find((p) => p.id === id);
  return p || "not found";
}

function addProduct(name, price) {
  const ids = data.map((p) => p.id);
  let nextId = Math.max(...ids) + 1;
  const newProduct = {
    id: nextId,
    name,
    price,
  };
  data.push(newProduct);
  return newProduct;
}

function deleteProduct(id) {
  const p = data.find((p) => p.id === id);
  const index = data.findIndex((p) => p.id === id);
  if (index !== -1) {
    data.splice(index, 1);
  }
  return p;
}

module.exports = { getAllProducts, getProductById, addProduct, deleteProduct };
