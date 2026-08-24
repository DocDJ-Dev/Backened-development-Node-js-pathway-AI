const {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
} = require("./store-products");

addProduct("Laptop", 2000);
addProduct("Mouse", 90);
addProduct("keyboard", 800);
// console.log(data); // not defined
console.log(getAllProducts());
console.log(deleteProduct(2));
console.log(getAllProducts());
