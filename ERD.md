### Click the link to Preview

[DB Diagram Preview Link](https://dbdiagram.io/d/Shwapno-QR-Quick-Retails-v1-6797f2ff263d6cf9a037d3f3)

### Or copy paste the code to [DB Diagram](https://dbdiagram.io/)

```
Table companies {
  id string [primary key]
  name string [unique, not null]
  location string
  created_at timestamp
}

Table branches {
  id string [primary key]
  name string [unique, not null]
  location string [not null]
  company_id string [ref: > companies.id]
  created_at timestamp
}

Table users {
  id string [primary key]
  first_name string [not null]
  last_name string
  email string [unique, not null]
  password string [not null]
  created_at timestamp
}

Table roles {
  id string [primary key]
  name string [unique, not null]
  created_at timestamp
}

Table permissions {
  id string [primary key]
  name string [unique, not null]
  created_at timestamp
}

Table role_permissions {
  id string [primary key]
  role_id string [ref: > roles.id]
  permission_id string [ref: > permissions.id]
  created_at timestamp
}

Table user_roles {
  id string [primary key]
  user_id string [ref: > users.id]
  role_id string [ref: > roles.id]
  branch_id string [ref: > branches.id]
  created_at timestamp
}

Table products {
  id string [primary key]
  name string [not null]
  description string
  price decimal [not null]
  qr_code string [unique]
  created_at timestamp
}

Table categories {
  id string [primary key]
  name string [unique, not null]
  product_id string [ref: < products.id]
  created_at timestamp
}

Table orders {
  id string [primary key]
  customer_id string [ref: > customers.id]
  branch_id string [ref: > branches.id]
  order_date datetime [not null]
  total_amount decimal [not null]
  status string [not null]
  created_at timestamp
}

Table order_items {
  id string [primary key]
  order_id string [ref: > orders.id]
  product_id string [ref: > products.id]
  quantity int [not null]
  price decimal [not null]
  created_at timestamp
}

Table invoices {
  id string [primary key]
  order_id string [ref: > orders.id]
  invoice_date datetime [not null]
  total_amount decimal [not null]
  created_at timestamp
}

Table stocks {
  id string [primary key]
  branch_id string [ref: > branches.id]
  product_id string [ref: > products.id]
  quantity int [not null]
  low_stock_alert boolean
  created_at timestamp
}

Table notifications {
  id string [primary key]
  type string [not null]
  content string [not null]
  created_at datetime [not null]
  branch_id string [ref: > branches.id]
}

Table customers {
  id string [primary key]
  first_name string [not null]
  last_name string
  email string [unique, not null]
  mobile string [not null]
  address string [not null]
  created_at timestamp
}

Table shopping_carts {
  id string [primary key]
  customer_id string [ref: > customers.id]
  created_at timestamp
}

Table shopping_cart_items {
  id string [primary key]
  cart_id string [ref: > shopping_carts.id]
  product_id string [ref: > products.id]
  quantity int [not null]
  price decimal [not null]
  created_at timestamp
}

Table audits {
  id string [primary key]
  entity_type string [not null] // Tracks the table being audited, e.g., 'users', 'branches', etc.
  entity_id string [not null] // The primary key of the related table row
  operation string [not null] // E.g., 'INSERT', 'UPDATE', 'DELETE'
  user_id string [ref: > users.id] // Tracks the user who made the change
  changes text [not null] // JSON or text describing the changes
  created_at timestamp [not null]
}
```
