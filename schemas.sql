DROP TABLE users CASCADE;
DROP TABLE orders CASCADE;
DROP TABLE item_category CASCADE;
DROP TABLE items CASCADE;
DROP TABLE order_items CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT false
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    is_completed BOOLEAN DEFAULT false,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE item_category (
    id INT PRIMARY KEY,
    category VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO item_category (id, category)
VALUES 
    (1, 'hat'),
    (2, 'shirt'),
    (3, 'hoodie'),
    (4, 'jacket'),
    (5, 'shoe');

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250) NOT NULL,
    qty INT DEFAULT 0,
    image_url VARCHAR(100) DEFAULT 'https://tacm.com/wp-content/uploads/2018/01/no-image-available.jpeg',
    price NUMERIC(7, 2) DEFAULT 9.99,
    category INT REFERENCES item_category(id)
);

CREATE TABLE order_items (
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    qty INT DEFAULT 1
);
