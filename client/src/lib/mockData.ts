export const MOCK_CREATORS = [
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
  },
  {
    handle: "elonmusk",
    displayName: "Elon Musk",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/elonmusk",
    metadata: {
      description: "X Everything App",
      followersCount: 170000000
    },
    affiliationScore: 40,
    credibilityScore: 65
  },
  {
    handle: "vitalikbuterin",
    displayName: "Vitalik Buterin",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/VitalikButerin",
    metadata: {
      description: "Fere libenter homines id quod volunt credunt",
      followersCount: 5000000
    },
    affiliationScore: 85,
    credibilityScore: 92
  }
];

export const MOCK_SIGNALS = {
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
  ],
  elonmusk: [
    {
      _id: "s3",
      type: "affiliation",
      data: {
        entities: [
          { name: "Techno-optimism", sentiment: "+", confidence: 0.92 },
          { name: "Free Speech Absolutism", sentiment: "+", confidence: 0.85 }
        ],
        summary: "Highly focused on technological advancement and platform governance."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "s4",
      type: "credibility",
      data: {
        score: 65,
        reasoning: "High impact but occasionally promotes unverified information or memes."
      },
      createdAt: new Date().toISOString()
    }
  ],
  VitalikButerin: [
    {
      _id: "s5",
      type: "affiliation",
      data: {
        entities: [
          { name: "Ethereum Ecosystem", sentiment: "+", confidence: 0.98 },
          { name: "Decentralized Governance", sentiment: "+", confidence: 0.94 }
        ],
        summary: "Primary focus on blockchain development and philosophical decentralization."
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: "s6",
      type: "credibility",
      data: {
        score: 92,
        reasoning: "Deep technical expertise and transparent communication about complex systems."
      },
      createdAt: new Date().toISOString()
    }
  ]
};
