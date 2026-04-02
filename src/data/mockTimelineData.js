export const mockStories = [
  {
    id: 1,
    user: {
      id: 101,
      name: 'Thando Ndlovu',
      avatar: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=150&h=150&fit=crop',
      isSuperhost: true,
      location: 'Cape Town'
    },
    story: {
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=700&fit=crop',
      viewed: false,
      location: 'Clifton Beach'
    }
  },
  {
    id: 2,
    user: {
      id: 102,
      name: 'Johan van der Merwe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      isSuperhost: true,
      location: 'Franschhoek'
    },
    story: {
      image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=400&h=700&fit=crop',
      viewed: false,
      location: 'Stellenbosch Winelands'
    }
  },
  {
    id: 3,
    user: {
      id: 103,
      name: 'Priya Naidoo',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
      isSuperhost: true,
      location: 'Durban'
    },
    story: {
      image: 'https://images.unsplash.com/photo-1590114518871-9b5f5a6f7b5a?w=400&h=700&fit=crop',
      viewed: true,
      location: 'Umhlanga Rocks'
    }
  },
  {
    id: 4,
    user: {
      id: 104,
      name: 'Sipho Dlamini',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop',
      isSuperhost: false,
      location: 'Mbombela'
    },
    story: {
      image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=400&h=700&fit=crop',
      viewed: false,
      location: 'Kruger National Park'
    }
  },
  {
    id: 5,
    user: {
      id: 105,
      name: 'Emma Botha',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      isSuperhost: true,
      location: 'Plettenberg Bay'
    },
    story: {
      image: 'https://images.unsplash.com/photo-1598948485426-ee9815f249d8?w=400&h=700&fit=crop',
      viewed: false,
      location: 'Nature\'s Valley'
    }
  }
];

export const mockPosts = [
  {
    id: 1,
    user: {
      id: 101,
      name: 'Thando Ndlovu',
      avatar: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=200&h=200&fit=crop',
      isSuperhost: true,
      location: 'Cape Town'
    },
    property: {
      id: 201,
      title: 'Clifton 4th Beach Villa - Spectacular Ocean Views',
      description: `Perched on the famous Clifton 4th Beach, this architectural masterpiece offers uninterrupted views of the Atlantic Ocean and Twelve Apostles mountain range. Recently renovated in 2025, the villa seamlessly blends indoor-outdoor living with floor-to-ceiling glass doors opening onto multiple sundecks.

      The property features 5 en-suite bedrooms, each with private ocean-view balconies. The open-plan living area includes a gas fireplace, Sonos sound system throughout, and a gourmet kitchen with scullery. The heated infinity pool seems to merge with the ocean beyond, while the sunken boma area is perfect for winter evenings.

      A direct beach access path takes you down to one of Cape Town's most exclusive beaches. The villa includes secure parking for 3 cars, backup power, and fibre internet. Perfect for summer holidays or winter getaways when the whales are playing offshore.`,
      price: 8500,
      bedrooms: 5,
      bathrooms: 5.5,
      maxGuests: 10,
      sqft: 5500,
      rating: 4.98,
      reviewCount: 89,
      images: [
        'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1590114518871-9b5f5a6f7b5a?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1598948485426-ee9815f249d8?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop'
      ],
      amenities: [
        'Infinity Pool', 
        'Direct Beach Access', 
        'Backup Power', 
        'Staff Quarters',
        'Wine Fridge',
        'Braai Area',
        'Sonos System',
        'Security Guard'
      ],
      location: 'Clifton, Cape Town',
      coordinates: { lat: -33.9416, lng: 18.3776 },
      propertyType: 'Villa',
      yearBuilt: 2010,
      lastRenovated: 2025,
      sustainability: ['Solar Power', 'Water Filtration', 'EV Charger']
    },
    createdAt: '2026-03-01T10:30:00Z',
    likesCount: 1234,
    commentsCount: 89,
    isLiked: false,
    isSaved: true,
    comments: [
      {
        id: 301,
        user: {
          name: 'Michelle Kruger',
          avatar: 'https://images.unsplash.com/photo-1494790108777-847efef7d4a5?w=100&h=100&fit=crop'
        },
        text: 'The most spectacular views in Cape Town! We saw whales from the pool deck in September! 🐋',
        timestamp: '2026-03-01T11:00:00Z',
        likes: 45
      },
      {
        id: 302,
        user: {
          name: 'Ryan Peters',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
        },
        text: 'The walk down to Clifton 4th is worth every step. Best sundowners spot! 🌅',
        timestamp: '2026-03-01T14:30:00Z',
        likes: 23
      }
    ]
  },
  {
    id: 2,
    user: {
      id: 102,
      name: 'Johan van der Merwe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      isSuperhost: true,
      location: 'Franschhoek'
    },
    property: {
      id: 202,
      title: 'La Provence - Luxury Winelands Estate',
      description: `Nestled in the heart of the Franschhoek Valley, this Cape Dutch-style estate sits on 10 hectares of working vineyards with mountain views in every direction. The main house, recently restored by a renowned architect, combines original yellowwood beams with contemporary luxury.

      Five spacious suites open onto private patios overlooking the vineyards. The entertainer's kitchen features a La Canche range and walk-in pantry. The 20-meter lap pool is heated year-round, and the property includes a separate one-bedroom cottage perfect for staff or guests.

      A private tasting room opens onto the wine cellar stocked with award-winning vintages from neighboring estates. The property includes a tennis court, vegetable garden, and olive grove. Minutes from Franschhoek's famous restaurants - La Petite Colombe, Protégé, and Le Coin Français are all within 5km.`,
      price: 12000,
      bedrooms: 6,
      bathrooms: 6.5,
      maxGuests: 14,
      sqft: 7200,
      rating: 4.99,
      reviewCount: 67,
      images: [
        'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop'
      ],
      amenities: [
        'Private Vineyard', 
        'Wine Cellar', 
        'Tennis Court',
        'Pool House',
        'Chef\'s Kitchen',
        'Braai Area',
        'Backup Power',
        'Staff Accommodation'
      ],
      location: 'Franschhoek, Western Cape',
      coordinates: { lat: -33.9125, lng: 19.1246 },
      propertyType: 'Estate',
      yearBuilt: 1880,
      lastRenovated: 2024,
      sustainability: ['Solar Farm', 'Borehole Water', 'Organic Vineyard']
    },
    createdAt: '2026-02-28T15:45:00Z',
    likesCount: 2341,
    commentsCount: 156,
    isLiked: true,
    isSaved: false,
    comments: [
      {
        id: 303,
        user: {
          name: 'Sarah Goldblatt',
          avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=100&h=100&fit=crop'
        },
        text: 'We had our wedding here. The team went above and beyond! Siyabonga to the staff! ❤️',
        timestamp: '2026-02-28T16:20:00Z',
        likes: 89
      }
    ]
  },
  {
    id: 3,
    user: {
      id: 103,
      name: 'Priya Naidoo',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
      isSuperhost: true,
      location: 'Durban'
    },
    property: {
      id: 203,
      title: 'Oyster Rock - Umhlanga Beachfront Penthouse',
      description: `Directly on Umhlanga's famous beachfront promenade, this duplex penthouse offers panoramic Indian Ocean views from every room. Wake up to dolphins playing in the surf and watch the sun rise over the ocean from your private rooftop terrace.

      The open-plan living area features imported Italian marble floors, a gas fireplace, and sliding glass doors that disappear into walls, creating an seamless indoor-outdoor flow. Three bedroom suites, each with ocean-view bathrooms and private balconies. The rooftop entertainment area includes a rim-flow pool, wet bar, and built-in gas braai.

      The building offers 24-hour security, undercover parking for 2 vehicles, and direct access to the promenade. Walk to the Oyster Box Hotel for curry lunches or Umhlanga's best restaurants. Gateway Theatre of Shopping is 5 minutes away.`,
      price: 5500,
      bedrooms: 3,
      bathrooms: 3.5,
      maxGuests: 6,
      sqft: 3200,
      rating: 4.96,
      reviewCount: 112,
      images: [
        'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=1200&h=800&fit=crop'
      ],
      amenities: [
        'Beachfront',
        'Rooftop Pool',
        'Gas Braai',
        'Backup Power',
        '24hr Security',
        'Beach Access',
        'Smart Home',
        'Wine Storage'
      ],
      location: 'Umhlanga Rocks, Durban',
      coordinates: { lat: -29.7268, lng: 31.0868 },
      propertyType: 'Penthouse',
      yearBuilt: 2022,
      sustainability: ['Solar Geysers', 'Rainwater Harvesting', 'Energy Efficient']
    },
    createdAt: '2026-03-02T09:15:00Z',
    likesCount: 876,
    commentsCount: 43,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: 304,
        user: {
          name: 'Thabo Mkhize',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
        },
        text: 'The sunrise views are something else! Best spot for morning coffee ☕',
        timestamp: '2026-03-02T10:30:00Z',
        likes: 34
      }
    ]
  },
  {
    id: 4,
    user: {
      id: 104,
      name: 'Sipho Dlamini',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop',
      isSuperhost: true,
      location: 'Mbombela'
    },
    property: {
      id: 204,
      title: 'Bush Lodge - Kruger National Park Boundary',
      description: `Experience the African bush from this architect-designed lodge located on a private game reserve bordering the Kruger National Park. No fences separate you from the wildlife - elephants, lions, and rhinos roam freely past your deck.

      Four luxury suites feature outdoor showers, private plunge pools, and viewing decks overlooking a permanent waterhole. The main lodge area includes a boma under ancient leadwood trees, a 25-meter lap pool, and a wine cellar stocked with South Africa's best.

      Included in your stay: private game drives in an open safari vehicle with experienced guides, bush walks, all meals prepared by our private chef, and airport transfers from Nelspruit. Witness the Big Five in their natural habitat.`,
      price: 15000,
      bedrooms: 4,
      bathrooms: 4.5,
      maxGuests: 8,
      sqft: 4800,
      rating: 5.0,
      reviewCount: 45,
      images: [
        'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1598948485426-ee9815f249d8?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1581101760112-2c6690b75a3d?w=1200&h=800&fit=crop'
      ],
      amenities: [
        'Private Game Drives',
        'Plunge Pools',
        'Boma Fire',
        'Chef Service',
        'Spa Treatments',
        'Outdoor Showers',
        'Safari Vehicle',
        'Helicopter Pad'
      ],
      location: 'Sabi Sand, Mpumalanga',
      coordinates: { lat: -24.8466, lng: 31.5426 },
      propertyType: 'Lodge',
      yearBuilt: 2023,
      sustainability: ['Solar Powered', 'Water Treatment', 'Conservation Levy']
    },
    createdAt: '2026-02-27T12:00:00Z',
    likesCount: 2345,
    commentsCount: 178,
    isLiked: true,
    isSaved: true,
    comments: [
      {
        id: 305,
        user: {
          name: 'Kate Vermaak',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
        },
        text: 'A leopard visited our deck during sunset. Unforgettable experience! 🐆',
        timestamp: '2026-02-27T14:00:00Z',
        likes: 156
      }
    ]
  },
  {
    id: 5,
    user: {
      id: 105,
      name: 'Emma Botha',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      isSuperhost: true,
      location: 'Plettenberg Bay'
    },
    property: {
      id: 205,
      title: 'Seascape - Robberg Beachfront Sanctuary',
      description: `Perched on the dunes of Robberg Beach, this contemporary masterpiece offers direct access to one of the Garden Route's most pristine beaches. Watch whales breaching from your living room during season (June-November) and dolphins playing year-round.

      Four bedroom suites, each with ocean-facing decks and heated towel rails. The main suite includes a freestanding bath positioned to watch the waves. The entertainment deck features a heated pool, outdoor shower, and built-in braai with sea views.

      The house is designed for indoor-outdoor living with stacking glass doors that open the entire living area to the ocean. Features include underfloor heating throughout, a gym with ocean views, and secure parking for 4 vehicles. Walking distance to Robberg Nature Reserve and Plettenberg Bay's best restaurants.`,
      price: 7200,
      bedrooms: 4,
      bathrooms: 4.5,
      maxGuests: 8,
      sqft: 4200,
      rating: 4.97,
      reviewCount: 78,
      images: [
        'https://images.unsplash.com/photo-1598948485426-ee9815f249d8?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1591825729269-c9eb3f19f4d8?w=1200&h=800&fit=crop'
      ],
      amenities: [
        'Beachfront',
        'Heated Pool',
        'Underfloor Heating',
        'Gym',
        'Braai Area',
        'Backup Power',
        'Surfboard Storage',
        'Outdoor Shower'
      ],
      location: 'Robberg, Plettenberg Bay',
      coordinates: { lat: -34.0589, lng: 23.3716 },
      propertyType: 'House',
      yearBuilt: 2024,
      sustainability: ['Solar System', 'Heat Pump', 'Water Tank']
    },
    createdAt: '2026-03-03T08:30:00Z',
    likesCount: 654,
    commentsCount: 32,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: 306,
        user: {
          name: 'Andre Ferreira',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop'
        },
        text: 'Perfect for the annual Plett Rage! Best location in town 🎉',
        timestamp: '2026-03-03T09:45:00Z',
        likes: 28
      }
    ]
  },
  {
    id: 6,
    user: {
      id: 106,
      name: 'Lerato Mofokeng',
      avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
      isSuperhost: false,
      location: 'Johannesburg'
    },
    property: {
      id: 206,
      title: 'The Houghton Estate - Johannesburg Grandeur',
      description: `Behind electric security gates in prestigious Houghton, this neo-Georgian mansion offers urban sanctuary with country-like grounds. The property has hosted ambassadors, celebrities, and royalty.

      Six bedroom suites, formal dining for 20, a library with gas fireplace, and a professional-grade kitchen. The grounds include a cricket pitch-sized lawn, heated pool with pool house, and a tennis court. The separate two-bedroom cottage is perfect for staff or guests.

      Minutes from Sandton's financial district and Johannesburg's best private schools. The property includes borehole water, full solar backup, and a 10-car garage. Perfect for diplomatic functions or family living.`,
      price: 18000,
      bedrooms: 6,
      bathrooms: 7,
      maxGuests: 14,
      sqft: 12000,
      rating: 4.95,
      reviewCount: 34,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop'
      ],
      amenities: [
        'Tennis Court',
        'Pool House',
        'Staff Quarters',
        'Solar Backup',
        'Borehole',
        'Wine Cellar',
        'Home Theater',
        'Gym'
      ],
      location: 'Houghton, Johannesburg',
      coordinates: { lat: -26.1557, lng: 28.0473 },
      propertyType: 'Estate',
      yearBuilt: 2005,
      lastRenovated: 2025,
      sustainability: ['Solar Array', 'Borehole Water', 'LED Lighting']
    },
    createdAt: '2026-02-26T11:00:00Z',
    likesCount: 543,
    commentsCount: 28,
    isLiked: false,
    isSaved: false,
    comments: []
  }
];

export const mockTrending = [
  {
    id: 1,
    title: 'Clifton Beach Villa',
    location: 'Cape Town',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100&h=100&fit=crop',
    score: '12.4k',
    price: 'R8,500'
  },
  {
    id: 2,
    title: 'Franschhoek Estate',
    location: 'Winelands',
    image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=100&h=100&fit=crop',
    score: '10.2k',
    price: 'R12,000'
  },
  {
    id: 3,
    title: 'Kruger Bush Lodge',
    location: 'Mpumalanga',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=100&h=100&fit=crop',
    score: '9.8k',
    price: 'R15,000'
  },
  {
    id: 4,
    title: 'Umhlanga Penthouse',
    location: 'Durban',
    image: 'https://images.unsplash.com/photo-1590114518871-9b5f5a6f7b5a?w=100&h=100&fit=crop',
    score: '8.7k',
    price: 'R5,500'
  },
  {
    id: 5,
    title: 'Plettenberg Bay',
    location: 'Garden Route',
    image: 'https://images.unsplash.com/photo-1598948485426-ee9815f249d8?w=100&h=100&fit=crop',
    score: '7.9k',
    price: 'R7,200'
  }
];

export const mockSuggested = [
  {
    id: 201,
    name: 'Thando Ndlovu',
    avatar: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=100&h=100&fit=crop',
    followers: '12.5k',
    location: 'Cape Town',
    properties: 8
  },
  {
    id: 202,
    name: 'Johan van der Merwe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    followers: '10.2k',
    location: 'Franschhoek',
    properties: 5
  },
  {
    id: 203,
    name: 'Priya Naidoo',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    followers: '8.7k',
    location: 'Durban',
    properties: 4
  },
  {
    id: 204,
    name: 'Sipho Dlamini',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop',
    followers: '7.9k',
    location: 'Mbombela',
    properties: 3
  }
];

export const mockDestinations = [
  {
    city: 'Cape Town',
    country: 'South Africa',
    flag: '🇿🇦',
    count: 345,
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=50&h=50&fit=crop',
    priceRange: 'R850 - R25,000'
  },
  {
    city: 'Franschhoek',
    country: 'South Africa',
    flag: '🇿🇦',
    count: 89,
    image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=50&h=50&fit=crop',
    priceRange: 'R2,500 - R18,000'
  },
  {
    city: 'Durban',
    country: 'South Africa',
    flag: '🇿🇦',
    count: 234,
    image: 'https://images.unsplash.com/photo-1590114518871-9b5f5a6f7b5a?w=50&h=50&fit=crop',
    priceRange: 'R650 - R12,000'
  },
  {
    city: 'Kruger Park',
    country: 'South Africa',
    flag: '🇿🇦',
    count: 67,
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=50&h=50&fit=crop',
    priceRange: 'R3,500 - R45,000'
  },
  {
    city: 'Plettenberg Bay',
    country: 'South Africa',
    flag: '🇿🇦',
    count: 123,
    image: 'https://images.unsplash.com/photo-1598948485426-ee9815f249d8?w=50&h=50&fit=crop',
    priceRange: 'R1,200 - R15,000'
  },
  {
    city: 'Johannesburg',
    country: 'South Africa',
    flag: '🇿🇦',
    count: 456,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=50&h=50&fit=crop',
    priceRange: 'R550 - R22,000'
  }
];