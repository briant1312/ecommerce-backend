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

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250) NOT NULL,
    qty INT DEFAULT 0,
    image_url VARCHAR(100) DEFAULT 'https://tacm.com/wp-content/uploads/2018/01/no-image-available.jpeg',
    price NUMERIC(7, 2) DEFAULT 9.99
);

CREATE TABLE order_items (
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id) ON DELETE CASCADE
);
