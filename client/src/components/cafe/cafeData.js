export const CAFE_INFO = {
  name: "Aura Artisan Café & Roastery",
  tagline: "Where Every Sip Tells a Story",
  city: "Jaipur, Rajasthan",
  address: "Plot 14, C-Scheme, Ashok Nagar, Jaipur, Rajasthan 302001",
  phone: "+91 8920608191",
  whatsapp: "918920608191",
  openingHours: "Mon - Sun: 8:00 AM - 11:30 PM",
  rating: 4.9,
  reviewsCount: "1,420+",
  yearsExperience: "10+",
  happyCustomers: "50K+",
  signatureDishes: "25+",
  currency: "₹"
};

export const WHATSAPP_CONTACT_NUMBER = "918920608191";

export const MENU_CATEGORIES = [
  { id: 'all', name: 'Full Menu', icon: 'Sparkles' },
  { id: 'coffee', name: 'Artisan Coffee', icon: 'Coffee' },
  { id: 'tea', name: 'Craft Teas', icon: 'Leaf' },
  { id: 'breakfast', name: 'Breakfast & Bakes', icon: 'Croissant' },
  { id: 'mains', name: 'Gourmet Mains', icon: 'Utensils' },
  { id: 'desserts', name: 'Artisan Desserts', icon: 'Cake' },
  { id: 'beverages', name: 'Chilled Coolers', icon: 'GlassWater' }
];

export const MENU_ITEMS = [
  // COFFEE
  {
    id: 'c1',
    name: 'Single-Origin Ethiopian Pour-Over',
    category: 'coffee',
    price: 260,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.9,
    calories: '5 kcal',
    description: 'Manual Chemex pour-over showcasing floral jasmine notes, bergamot citrus, and a silky tea-like finish.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    ingredients: ['100% Arabica Yirgacheffe Beans', 'Filter Pure Water', 'Zero Sugar'],
    allergens: ['None']
  },
  {
    id: 'c2',
    name: 'Spanish Pistachio Iced Latte',
    category: 'coffee',
    price: 310,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.95,
    calories: '240 kcal',
    description: 'Double shot espresso layered over condensed milk, Sicilian pistachio cream, and chilled oat milk.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Double Espresso', 'Condensed Milk', 'Sicilian Pistachio Paste', 'Oat Milk'],
    allergens: ['Nuts', 'Dairy']
  },
  {
    id: 'c3',
    name: 'Velvet Flat White',
    category: 'coffee',
    price: 240,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    rating: 4.8,
    calories: '130 kcal',
    description: 'Micro-foamed whole milk gently poured over a rich ristretto double shot with subtle cocoa undertones.',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Ristretto Double Shot', 'Steamed Whole Milk'],
    allergens: ['Dairy']
  },
  {
    id: 'c4',
    name: 'Cascara Nitro Cold Brew',
    category: 'coffee',
    price: 280,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.9,
    calories: '10 kcal',
    description: '18-hour cold steeped coffee infused with nitrogen and dried coffee cherry husks for a Guinness-like creamy head.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    ingredients: ['18-Hr Cold Brew', 'Cascara Tea Extract', 'Nitrogen Gas Infusion'],
    allergens: ['None']
  },
  {
    id: 'c5',
    name: 'Cortado with Salted Caramel Rim',
    category: 'coffee',
    price: 230,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    rating: 4.7,
    calories: '95 kcal',
    description: 'Equal parts espresso and warm milk served in an artisanal gibraltar glass rimmed with Himalayan pink salt caramel.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Espresso', 'Steamed Milk', 'Salted Caramel Syrup', 'Pink Salt'],
    allergens: ['Dairy']
  },

  // TEAS
  {
    id: 't1',
    name: 'Ceremonial Uji Matcha Latte',
    category: 'tea',
    price: 290,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.9,
    calories: '160 kcal',
    description: 'Stone-ground ceremonial grade matcha from Kyoto, whisked with hot water and velvety steamed almond milk.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Uji Matcha Powder', 'Almond Milk', 'Agave Nectar'],
    allergens: ['Tree Nuts']
  },
  {
    id: 't2',
    name: 'Kashmiri Saffron Kahwa',
    category: 'tea',
    price: 250,
    isVeg: true,
    isBestseller: false,
    isSpicy: true,
    rating: 4.85,
    calories: '80 kcal',
    description: 'Green tea slow-simmered with crushed green cardamom, cinnamon sticks, Kashmiri saffron strands, and slivered almonds.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Kashmiri Green Tea', 'Saffron', 'Cardamom', 'Cinnamon', 'Almonds', 'Wild Honey'],
    allergens: ['Nuts']
  },

  // BREAKFAST & BAKES
  {
    id: 'b1',
    name: 'Truffle Scrambled Brioche Toast',
    category: 'breakfast',
    price: 360,
    isVeg: false,
    isBestseller: true,
    isSpicy: false,
    rating: 4.95,
    calories: '420 kcal',
    description: 'Silky farm eggs cooked in French butter, drizzled with white truffle oil, shaved parmesan, over toasted brioche.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Organic Eggs', 'French Butter', 'White Truffle Oil', 'House Brioche', 'Parmigiano Reggiano', 'Chives'],
    allergens: ['Eggs', 'Dairy', 'Gluten']
  },
  {
    id: 'b2',
    name: 'Almond Twice-Baked Croissant',
    category: 'breakfast',
    price: 240,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.9,
    calories: '380 kcal',
    description: 'Crisp golden layered croissant filled with almond frangipane cream, topped with toasted flaked almonds and powdered sugar.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Laminated Butter Pastry', 'Almond Frangipane', 'Vanilla Syrup', 'Flaked Almonds'],
    allergens: ['Gluten', 'Dairy', 'Tree Nuts']
  },
  {
    id: 'b3',
    name: 'Smoked Hass Avocado & Burrata Tartine',
    category: 'breakfast',
    price: 380,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    rating: 4.85,
    calories: '390 kcal',
    description: 'Grilled artisan sourdough, chunky Hass avocado, creamy Puglia burrata cheese, confit cherry tomatoes, and micro-herbs.',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Woodfired Sourdough', 'Hass Avocado', 'Fresh Burrata', 'Extra Virgin Olive Oil', 'Dukkah Spice'],
    allergens: ['Gluten', 'Dairy']
  },

  // MAINS
  {
    id: 'm1',
    name: 'Wild Mushroom & Black Truffle Tagliatelle',
    category: 'mains',
    price: 490,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.95,
    calories: '510 kcal',
    description: 'Handcrafted fresh tagliatelle tossed in a rich porcini and black truffle butter emulsion with aged Pecorino Romano.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d62816f5?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Fresh Tagliatelle', 'Porcini Mushrooms', 'Black Truffle Paste', 'Pecorino Romano', 'Fresh Thyme'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: 'm2',
    name: 'Charred Sourdough Gourmet Club Sandwich',
    category: 'mains',
    price: 410,
    isVeg: true,
    isBestseller: false,
    isSpicy: true,
    rating: 4.8,
    calories: '460 kcal',
    description: 'Smoked gouda, slow-roasted peppers, pickled jalapenos, pesto mayo, and crisp greens inside thick-cut grilled sourdough.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Sourdough Bread', 'Smoked Gouda', 'Bell Peppers', 'Basil Pesto', 'Jalapenos'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: 'm3',
    name: 'Pan-Seared Herb Polenta Bowl',
    category: 'mains',
    price: 440,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    rating: 4.75,
    calories: '380 kcal',
    description: 'Creamy herb polenta cakes served over charred asparagus, roasted wild mushrooms, and balsamic glaze reduction.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Cornmeal Polenta', 'Asparagus', 'Shiitake Mushrooms', 'Balsamic Glaze'],
    allergens: ['None']
  },

  // DESSERTS
  {
    id: 'd1',
    name: 'Burnt Basque Cheesecake with Berry Compote',
    category: 'desserts',
    price: 320,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.95,
    calories: '340 kcal',
    description: 'Caramelized rustic crust with an ultra-creamy, molten cheese center, paired with homemade wild blueberry compote.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Philadelphia Cream Cheese', 'Organic Sugar', 'Heavy Cream', 'Wild Blueberries'],
    allergens: ['Dairy']
  },
  {
    id: 'd2',
    name: 'Classic Espresso Tiramisu Pot',
    category: 'desserts',
    price: 290,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.9,
    calories: '310 kcal',
    description: 'Espresso-soaked Italian savoiardi ladyfingers layered with velvety mascarpone zabaglione and Valrhona dark cocoa dust.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mascarpone Cheese', 'Savoiardi Biscuits', 'Dark Espresso', 'Valrhona Cocoa'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'd3',
    name: 'Warm Belgian Dark Chocolate Fondant',
    category: 'desserts',
    price: 330,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    rating: 4.85,
    calories: '420 kcal',
    description: 'Baked to order with 70% Callebaut dark chocolate with a warm flowing molten core, served with Madagascar vanilla gelato.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['70% Dark Chocolate', 'French Butter', 'Vanilla Bean Gelato'],
    allergens: ['Dairy', 'Gluten']
  },

  // BEVERAGES
  {
    id: 'bv1',
    name: 'Blood Orange & Rosemary Cold Press',
    category: 'beverages',
    price: 240,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    rating: 4.85,
    calories: '110 kcal',
    description: 'Freshly squeezed Sicilian blood orange, cold-extracted rosemary sprigs, and effervescent sparkling soda.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Blood Orange Juice', 'Fresh Rosemary', 'Sparkling Soda', 'Cane Sugar'],
    allergens: ['None']
  },
  {
    id: 'bv2',
    name: 'Yuzu Botanical Iced Tonic',
    category: 'beverages',
    price: 230,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    rating: 4.8,
    calories: '90 kcal',
    description: 'Japanese yuzu citrus, elderflower cordial, cucumber ribbon, and craft tonic water over crystal clear ice spheres.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Yuzu Extract', 'Elderflower Cordial', 'Craft Tonic', 'Cucumber'],
    allergens: ['None']
  }
];

export const SIGNATURE_DISHES = [
  {
    id: 'sig-1',
    title: 'Single-Origin Manual Pour-Over',
    subtitle: 'Harvested from Yirgacheffe, roasted weekly in small batches for floral sweetness.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    price: '₹260',
    tag: 'Coffee Masterpiece'
  },
  {
    id: 'sig-2',
    title: 'Truffle & Porcini Tagliatelle',
    subtitle: 'Hand-rolled daily pasta in a luxurious black truffle and parmigiano emulsion.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d62816f5?auto=format&fit=crop&w=1200&q=80',
    price: '₹490',
    tag: 'Chef’s Creation'
  },
  {
    id: 'sig-3',
    title: 'Burnt Basque Molten Cheesecake',
    subtitle: 'Rustic golden crust hiding an ultra-creamy, molten Philadelphia center.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80',
    price: '₹320',
    tag: 'Signature Dessert'
  }
];

export const SPECIAL_OFFERS = [
  {
    id: 'off-1',
    title: 'Morning Coffee Combo',
    tagline: 'Any Single-Origin Pour-Over + Warm Butter Croissant',
    discount: '25% OFF',
    code: 'MORNINGBREW',
    badge: 'Popular Deal',
    expiresInHours: 6,
    price: '₹375 (Valued at ₹500)'
  },
  {
    id: 'off-2',
    title: 'Happy Hour BOGO',
    tagline: 'Buy 1 Get 1 on all Cascara & Nitro Cold Brews',
    discount: 'BOGO FREE',
    code: 'BOGOBREW',
    badge: 'Limited Hours (4 PM - 7 PM)',
    expiresInHours: 4,
    price: '2 for ₹280'
  },
  {
    id: 'off-3',
    title: 'Weekend Artisan Brunch',
    tagline: '2 Mains + 2 Specialty Lattes + 1 Basque Cheesecake',
    discount: 'Flat ₹300 OFF',
    code: 'WEEKENDVIBES',
    badge: 'Weekend Only',
    expiresInHours: 48,
    price: '₹1,250 (Valued at ₹1,550)'
  }
];

export const GALLERY_PHOTOS = [
  {
    id: 'g1',
    title: 'Sunlit Courtyard Seating',
    category: 'Ambiance',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    caption: 'Our peaceful courtyard surrounded by lush greenery and gentle afternoon sunlight.'
  },
  {
    id: 'g2',
    title: 'Barista Latte Art Precision',
    category: 'Craft',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=800&q=80',
    caption: 'Every cup poured with silky microfoam and obsessive attention to flavor profile.'
  },
  {
    id: 'g3',
    title: 'Morning Bakery Display',
    category: 'Fresh Bakes',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    caption: 'Warm croissants, sourdough loaves, and pain au chocolat straight from our ovens at 8:00 AM.'
  },
  {
    id: 'g4',
    title: 'Espresso Extraction Close-up',
    category: 'Roastery',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    caption: 'Extracting crema-rich golden espresso using our customized La Marzocco machine.'
  },
  {
    id: 'g5',
    title: 'Work-Friendly High Table',
    category: 'Spaces',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    caption: 'Ergonomic seating and dedicated power sockets for writers, coders, and dreamers.'
  },
  {
    id: 'g6',
    title: 'Evening Candlelight Dining',
    category: 'Evenings',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Intimate evening candlelight ambiance with soft acoustic jazz.'
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: 'r1',
    name: 'Ananya Singhania',
    role: 'Food Blogger & Jaipur Native',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: 'Aura Artisan Café is without question the finest cafe in Jaipur. The Spanish Pistachio Latte and Basque Cheesecake are unmatched. The aesthetic is warm, luxurious, and so peaceful!',
    rating: 5,
    date: '2 days ago'
  },
  {
    id: 'r2',
    name: 'Rohan Malhotra',
    role: 'Tech Founder & Coffee Purist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    text: 'As someone who travels across the world for specialty coffee, their Ethiopian pour-over blew me away. Super fast WiFi, great power plugs, and incredibly polite baristas.',
    rating: 5,
    date: '1 week ago'
  },
  {
    id: 'r3',
    name: 'Dr. Priya Verma',
    role: 'Local Resident, C-Scheme',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    text: 'We hosted my mother’s birthday breakfast here. The staff went above and beyond, and the Truffle Scrambled Brioche was simply divine. A true gem in the heart of Jaipur.',
    rating: 5,
    date: '3 weeks ago'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-8921',
    customerName: 'Kavita Sharma',
    phone: '+91 98290 12345',
    items: [
      { name: 'Spanish Pistachio Iced Latte', qty: 2, price: 310 },
      { name: 'Burnt Basque Cheesecake', qty: 1, price: 320 }
    ],
    total: 940,
    status: 'Preparing',
    orderType: 'Dine-In (Table 4)',
    placedAt: '12 mins ago'
  },
  {
    id: 'ORD-8920',
    customerName: 'Aditya Mehta',
    phone: '+91 94140 88210',
    items: [
      { name: 'Single-Origin Ethiopian Pour-Over', qty: 1, price: 260 },
      { name: 'Almond Twice-Baked Croissant', qty: 1, price: 240 }
    ],
    total: 500,
    status: 'Ready',
    orderType: 'Takeaway',
    placedAt: '24 mins ago'
  }
];

export const INITIAL_RESERVATIONS = [
  {
    id: 'RES-401',
    customerName: 'Vikram & Priya Singhania',
    phone: '+91 98280 66124',
    email: 'vikram.singhania@gmail.com',
    date: 'Tonight',
    time: '7:30 PM',
    guests: 2,
    tableArea: 'Outdoor Garden / Patio',
    specialRequest: 'Corner table with quiet candlelight for anniversary',
    status: 'Confirmed'
  },
  {
    id: 'RES-402',
    customerName: 'Devika Mathur',
    phone: '+91 99280 44109',
    email: 'devika.mathur@corp.in',
    date: 'Tomorrow',
    time: '11:00 AM',
    guests: 6,
    tableArea: 'Work-Friendly High Table',
    specialRequest: 'Power sockets required for team strategy session',
    status: 'Confirmed'
  }
];

export const CAFE_MENU_ITEMS = MENU_ITEMS;
