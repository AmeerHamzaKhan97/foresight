export const MOCK_CREATORS = [
  {
    handle: "narendramodi",
    displayName: "Narendra Modi",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/narendramodi",
    metadata: {
      description: "Prime Minister of India",
      followersCount: 95000000
    },
    affiliationScore: 90,
    credibilityScore: 88
  },
  {
    handle: "myogiadityanath",
    displayName: "Yogi Adityanath",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/myogiadityanath",
    metadata: {
      description: "Chief Minister, Uttar Pradesh, India",
      followersCount: 28000000
    },
    affiliationScore: 92,
    credibilityScore: 85
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
  narendramodi: [
    {
      _id: "m1",
      type: "affiliation",
      data: {
        entities: [
          { name: "Viksit Bharat", sentiment: "+", confidence: 0.98 },
          { name: "Global South", sentiment: "+", confidence: 0.92 }
        ],
        summary: "Strongly aligned with national development and global leadership narratives."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "m2",
      type: "credibility",
      data: {
        score: 88,
        reasoning: "Official communications with high consistency in policy messaging."
      },
      createdAt: new Date().toISOString()
    }
  ],
  myogiadityanath: [
    {
      _id: "y1",
      type: "affiliation",
      data: {
        entities: [
          { name: "UP Development", sentiment: "+", confidence: 0.96 },
          { name: "Cultural Heritage", sentiment: "+", confidence: 0.94 }
        ],
        summary: "Primary focus on administrative reforms and cultural preservation."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "y2",
      type: "credibility",
      data: {
        score: 85,
        reasoning: "Consistent track record in administrative execution and public safety claims."
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
