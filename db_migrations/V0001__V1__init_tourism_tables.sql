CREATE TABLE IF NOT EXISTS clients (
    client_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    birth_date DATE,
    is_vip BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tours (
    tour_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration INT,
    season VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    destination VARCHAR(255),
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS hotels (
    hotel_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    address TEXT,
    rooms_count INT,
    rating DECIMAL(3,1),
    description TEXT,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS rooms (
    room_id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(hotel_id),
    category VARCHAR(50),
    price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    amenities TEXT,
    capacity INT DEFAULT 2
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(client_id),
    tour_id INT REFERENCES tours(tour_id),
    room_id INT REFERENCES rooms(room_id),
    booking_date DATE DEFAULT CURRENT_DATE,
    check_in_date DATE,
    check_out_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    currency_code VARCHAR(3) DEFAULT 'RUB'
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    salary DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS transport (
    transport_id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    route VARCHAR(255),
    departure_time TIME,
    arrival_time TIME,
    price DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS excursions (
    excursion_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    duration INT,
    language VARCHAR(50),
    schedule TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(booking_id),
    amount DECIMAL(10,2),
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(client_id),
    tour_id INT REFERENCES tours(tour_id),
    hotel_id INT REFERENCES hotels(hotel_id),
    text TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS promotions (
    promotion_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    start_date DATE,
    end_date DATE,
    discount DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS insurances (
    insurance_id SERIAL PRIMARY KEY,
    type VARCHAR(100),
    price DECIMAL(10,2),
    conditions TEXT,
    validity_period INT,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS currencies (
    currency_code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(50),
    rate DECIMAL(10,4),
    update_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS settings (
    setting_id SERIAL PRIMARY KEY,
    parameter VARCHAR(100),
    value TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS statistics (
    stat_id SERIAL PRIMARY KEY,
    date DATE,
    indicator VARCHAR(100),
    value DECIMAL(15,2)
);
