export const MOCK_CREATORS = [
  {
    handle: "mrwhosetheboss",
    displayName: "Arun Maini",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/mrwhosetheboss",
    metadata: {
      description: "Tech enthusiast. Probably talking about a new phone.",
      followersCount: 4500000
    },
    affiliationScore: 70,
    credibilityScore: 92
  },
  {
    handle: "BillGates",
    displayName: "Bill Gates",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/BillGates",
    metadata: {
      description: "Sharing things I'm learning through my foundation work and other interests.",
      followersCount: 62000000
    },
    affiliationScore: 78,
    credibilityScore: 94
  },
  {
    handle: "tarak9999",
    displayName: "Jr NTR",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/tarak9999",
    metadata: {
      description: "Actor",
      followersCount: 7500000
    },
    affiliationScore: 65,
    credibilityScore: 89
  },
  {
    handle: "veritasium",
    displayName: "Veritasium",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/veritasium",
    metadata: {
      description: "An element of truth - videos about science, education, and anything else I find interesting.",
      followersCount: 14500000
    },
    affiliationScore: 75,
    credibilityScore: 98
  }
];

export const MOCK_SIGNALS = {
  mrwhosetheboss: [
    {
      _id: "mw1",
      type: "affiliation",
      data: {
        entities: [
          { name: "Consumer Tech", sentiment: "+", confidence: 0.95 },
          { name: "Smartphone Innovation", sentiment: "+", confidence: 0.90 }
        ],
        summary: "Highly aligned with tech education and product reviews."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "mw2",
      type: "credibility",
      data: {
        score: 92,
        reasoning: "Consistent history of transparent reviews and technical analysis."
      },
      createdAt: new Date().toISOString()
    }
  ],
  BillGates: [
    {
      _id: "b1",
      type: "affiliation",
      data: {
        entities: [
          { name: "Global Health", sentiment: "+", confidence: 0.95 },
          { name: "Climate Innovation", sentiment: "+", confidence: 0.90 }
        ],
        summary: "Deeply aligned with scientific philanthropy and sustainable energy."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "b2",
      type: "credibility",
      data: {
        score: 94,
        reasoning: "Data-driven approach to global problems with high transparency."
      },
      createdAt: new Date().toISOString()
    }
  ],
  tarak9999: [
    {
      _id: "t1",
      type: "affiliation",
      data: {
        entities: [
          { name: "Telugu Cinema", sentiment: "+", confidence: 0.99 },
          { name: "Indian Film Industry", sentiment: "+", confidence: 0.95 }
        ],
        summary: "Centered on cinematic achievements and cultural influence."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "t2",
      type: "credibility",
      data: {
        score: 89,
        reasoning: "Authentic engagement and high consistency in personal branding."
      },
      createdAt: new Date().toISOString()
    }
  ],
  veritasium: [
    {
      _id: "s1",
      type: "affiliation",
      data: {
        entities: [
          { name: "Science Communication", sentiment: "+", confidence: 0.95 },
          { name: "Educational Tech", sentiment: "+", confidence: 0.88 }
        ],
        summary: "Strongly aligned with scientific integrity and educational outreach."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "s2",
      type: "credibility",
      data: {
        score: 98,
        reasoning: "Consistently cites peer-reviewed sources and corrects errors publicly."
      },
      createdAt: new Date().toISOString()
    }
  ]
};
