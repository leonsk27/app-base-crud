INSERT INTO `user` (id, name, email) VALUES
  ('user-1', 'Administrador', 'admin@mercadofacil.com'),
  ('user-2', 'Juan Perez', 'juan.perez@mercadofacil.com'),
  ('user-3', 'Ana Garcia', 'ana.garcia@mercadofacil.com');


INSERT INTO `product` (id, name, priceBs, priceUsd, exchangeRate, imageUrl, userId) VALUES
  ('prod-1', 'Teclado Mecánico RGB', 350.00, 50.00, 7.00, 'https://example.com/img/teclado.jpg', 'user-1'),
  ('prod-2', 'Mouse Gamer Inalámbrico', 210.00, 30.00, 7.00, 'https://example.com/img/mouse.jpg', 'user-1'),
  ('prod-3', 'Monitor 24" Full HD', 980.00, 140.00, 7.00, 'https://example.com/img/monitor.jpg', 'user-1'),
  ('prod-4', 'Laptop Lenovo 15"', 7000.00, 1000.00, 7.00, 'https://example.com/img/laptop.jpg', 'user-1'),
  ('prod-5', 'Impresora Multifunción', 2100.00, 300.00, 7.00, 'https://example.com/img/impresora.jpg', 'user-1'),
  ('prod-6', 'Parlantes Bluetooth', 420.00, 60.00, 7.00, 'https://example.com/img/parlantes.jpg', 'user-1'),
  ('prod-7', 'Cámara Web HD', 280.00, 40.00, 7.00, 'https://example.com/img/camara.jpg', 'user-1'),
  ('prod-8', 'Disco Duro Externo 1TB', 1120.00, 160.00, 7.00, 'https://example.com/img/disco.jpg', 'user-1'),
  ('prod-9', 'Router WiFi Dual Band', 630.00, 90.00, 7.00, 'https://example.com/img/router.jpg', 'user-1'),
  ('prod-10', 'Memoria RAM 16GB DDR4', 700.00, 100.00, 7.00, 'https://example.com/img/ram.jpg', 'user-1');
