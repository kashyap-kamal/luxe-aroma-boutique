-- Seed migration: Populate products table from existing static catalog
-- Images will initially use local paths; update to Supabase Storage URLs after upload

INSERT INTO products (name, slug, description, price_original, price_current, currency, on_sale, category, tags, size, status, featured, display_order, rating_stars, rating_count, image_url)
VALUES
  ('Ameer Al Oud', 'ameer-al-oud', 'Premium Ameer Al Oud fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'unisex', '{}', '50ml', 'in_stock', true, 1, 0, 0, '/assets/perfumes/ameer-al-oud.png'),
  ('Aventus', 'aventus', 'Premium Aventus fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', true, 2, 0, 0, '/assets/perfumes/aventus.png'),
  ('Aqua Di Gio', 'aqua-di-gio', 'Premium Aqua Di Gio fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{"New Launch"}', '50ml', 'in_stock', true, 3, 0, 0, '/assets/perfumes/aqua-di-gio.png'),
  ('Bin Sheikh', 'bin-sheikh', 'Premium Bin Sheikh fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', false, 4, 0, 0, '/assets/perfumes/bin-sheikh.png'),
  ('Blue De Chanel', 'blue-de-chanel', 'Premium Blue De Chanel fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', false, 5, 0, 0, '/assets/perfumes/blue-de-chanel.png'),
  ('Cool Water', 'cool-water', 'Premium Cool Water fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', false, 6, 0, 0, '/assets/perfumes/cool-water.png'),
  ('Dunhill Icon', 'dunhill-icon', 'Premium Dunhill Icon fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{"New Launch"}', '50ml', 'in_stock', false, 7, 0, 0, '/assets/perfumes/dunhill-icon.png'),
  ('Hawas', 'hawas', 'Premium Hawas fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', true, 8, 0, 0, '/assets/perfumes/hawas.png'),
  ('Most Wanted', 'most-wanted', 'Premium Most Wanted fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{"New Launch"}', '50ml', 'in_stock', false, 9, 0, 0, '/assets/perfumes/most-wanted.png'),
  ('Sauvage', 'sauvage', 'Premium Sauvage fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', false, 10, 0, 0, '/assets/perfumes/sauvage.png'),
  ('Ultra Male', 'ultra-male', 'Premium Ultra Male fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', false, 11, 0, 0, '/assets/perfumes/ultra-male.png'),
  ('1 Million', '1-million', 'Premium 1 Million fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', false, 12, 0, 0, '/assets/perfumes/1-million.png'),
  ('Versace Oud', 'versace-oud', 'Premium Versace Oud fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'men', '{}', '50ml', 'in_stock', false, 13, 0, 0, '/assets/perfumes/versace-oud.png'),
  ('Gucci Flora', 'gucci-flora', 'Premium Gucci Flora fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'women', '{}', '50ml', 'in_stock', false, 14, 0, 0, '/assets/perfumes/gucci-flora.png'),
  ('Baccarat Rouge 540', 'baccarat-rouge-540', 'Premium Baccarat Rouge 540 fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'unisex', '{}', '50ml', 'in_stock', false, 15, 0, 0, '/assets/perfumes/baccarat-rouge-540.png'),
  ('Gucci Guilty', 'gucci-guilty', 'Premium Gucci Guilty fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'unisex', '{}', '50ml', 'in_stock', false, 16, 0, 0, '/assets/perfumes/gucci-guilty.png'),
  ('Khamrah', 'khamrah', 'Premium Khamrah fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'unisex', '{}', '50ml', 'in_stock', false, 17, 0, 0, '/assets/perfumes/khamrah.png'),
  ('Oud For Greatness', 'oud-for-greatness', 'Premium Oud For Greatness fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'unisex', '{}', '50ml', 'in_stock', false, 18, 0, 0, '/assets/perfumes/oud-for-greatness.png'),
  ('Tam Dao', 'tam-dao', 'Premium Tam Dao fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'unisex', '{}', '50ml', 'in_stock', false, 19, 0, 0, '/assets/perfumes/tam-dao.png'),
  ('Tobacco Vanilla', 'tobacco-vanilla', 'Premium Tobacco Vanilla fragrance - a luxurious scent perfect for any occasion.', 700, 399, '₹', true, 'unisex', '{}', '50ml', 'in_stock', false, 20, 0, 0, '/assets/perfumes/tobacco-vanilla.png');
