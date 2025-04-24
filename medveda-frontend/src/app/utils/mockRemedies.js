// utils/mockRemedies.js

const mockRemedy = {
    id: 1,
    title: 'Turmeric Milk',
    description: 'A traditional Ayurvedic remedy known for its anti-inflammatory properties.',
    image: 'https://example.com/turmeric-milk.jpg',
    ingredients: '• 1 cup milk\n• 1/2 tsp turmeric\n• Honey (optional)',
    preparation: '• Heat the milk\n• Add turmeric\n• Stir well and serve warm',
    health_benefits: '• Boosts immunity• Reduces inflammation• Improves sleep• Relieves cold symptoms',
    is_saved: false,
    reviews: [
      {
        id: 1,
        user: 'Jane Doe',
        comment: 'Really helped with my sore throat!',
        rating: 5,
      },
      {
        id: 2,
        user: 'John Smith',
        comment: 'Tastes great and very soothing.',
        rating: 4,
      },
    ],
  };
  
  export default mockRemedy;
  