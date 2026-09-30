// orders_bad: id |
//   customer_name |
//   customer_email |
//   product_name |
//   product_price |
//   quantity |
//   order_date;

// update- if a customer places 5 orders, their name/email is duplicated across 5 rows — updating requires changing all 5, and missing one creates contradictory data
// insert- a product can not be inserted without a customer already
// delete- once order is deleted, all info about the product is lost

// customers table: customer_id(PK) / customer_name | customer_email
// products table: product_id(PK) | product_name | product_price | quantity
// orders table: id(PK) / order_date / order_quantity / customer_id(FK) / product_id(FK)
