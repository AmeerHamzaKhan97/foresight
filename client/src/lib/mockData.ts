export const MOCK_CREATORS = [
  {
    handle: "SrBachchan",
    displayName: "Amitabh Bachchan",
    status: "ACTIVE",
    profileImage: "https://unavatar.io/twitter/SrBachchan",
    metadata: {
      description: "Actor, producer, television host, former politician and occasional playback singer.",
      followersCount: 48900000
    },
    affiliationScore: 85,
    credibilityScore: 92
  },
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
  SrBachchan: [
    {
      _id: "69836946274a287551200672",
      type: "affiliation",
      data: {
        entities: [
          { name: "Nanavati", sentiment: "+", strength: 0.9 }
        ],
        reasoning: "The content primarily consists of personal health updates, expressions of gratitude, and spiritual reflections. The only identifiable entity fitting the criteria of a brand or company is 'Nanavati', which is mentioned as providing 'excellent care and nursing', indicating a strong positive sentiment. There are no mentions of specific politicians, political parties, or defined ideologies/movements."
      },
      reasoning: "The content primarily consists of personal health updates, expressions of gratitude, and spiritual reflections. The only identifiable entity fitting the criteria of a brand or company is 'Nanavati', which is mentioned as providing 'excellent care and nursing', indicating a strong positive sentiment. There are no mentions of specific politicians, political parties, or defined ideologies/movements.",
      createdAt: "2026-02-04T15:44:06.164Z"
    },
    {
      _id: "69836953274a287551200678",
      type: "credibility",
      data: {
        claims: [
          { text: "I have tested CoVid- have been discharged.", verifiable: true, hasEvidence: true },
          { text: "I am back home in solitary quarantine.", verifiable: true, hasEvidence: false },
          { text: "excellent care and nursing at Nanavati made it possible for me to see this day.", verifiable: true, hasEvidence: false },
          { text: "My daughter and daughter-in-law were discharged from the hospital.", verifiable: true, hasEvidence: true },
          { text: "I have tested CoviD positive.", verifiable: true, hasEvidence: true },
          { text: "I was shifted to Hospital.", verifiable: true, hasEvidence: true },
          { text: "hospital informing authorities.", verifiable: true, hasEvidence: true },
          { text: "family and staff undergone tests , results awaited.", verifiable: true, hasEvidence: false },
          { text: "Irfaan Khan passed away.", verifiable: true, hasEvidence: true }
        ],
        overallConfidence: "High"
      },
      reasoning: "Strong clinical documentation and public verified statements.",
      createdAt: "2026-02-04T15:44:19.361Z"
    },
    {
      _id: "69836953274a287551200679",
      type: "credibility",
      data: {
        claims: [
          { text: "Initial reports of health issues were accurate.", verifiable: true, hasEvidence: true },
          { text: "Follow-up testing confirmed recovery.", verifiable: true, hasEvidence: true }
        ],
        overallConfidence: "High"
      },
      reasoning: "Consistent updates with hospital-verified information.",
      createdAt: "2026-02-05T01:00:00.000Z"
    }
  ],
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
      reasoning: "Consistent history of transparent reviews and technical analysis.",
      createdAt: new Date().toISOString()
    },
    {
      _id: "mw2",
      type: "credibility",
      data: {
        score: 92,
        reasoning: "Consistent history of transparent reviews and technical analysis."
      },
      reasoning: "Consistent history of transparent reviews and technical analysis.",
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
      reasoning: "Deeply aligned with scientific philanthropy and sustainable energy.",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: "b2",
      type: "credibility",
      data: {
        score: 94,
        reasoning: "Data-driven approach to global problems with high transparency."
      },
      reasoning: "Data-driven approach to global problems with high transparency.",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: "b3",
      type: "credibility",
      data: {
        score: 96,
        reasoning: "Continued documentation of foundation impact with peer-reviewed backing."
      },
      reasoning: "Continued documentation of foundation impact with peer-reviewed backing.",
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
      reasoning: "Centered on cinematic achievements and cultural influence.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: "t2",
      type: "credibility",
      data: {
        score: 85,
        reasoning: "Initial analysis of engagement quality."
      },
      reasoning: "Initial analysis of engagement quality.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: "t3",
      type: "credibility",
      data: {
        score: 89,
        reasoning: "Authentic engagement and high consistency in personal branding."
      },
      reasoning: "Authentic engagement and high consistency in personal branding.",
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
      reasoning: "Strongly aligned with scientific integrity and educational outreach.",
      createdAt: new Date().toISOString()
    },
    {
      _id: "s2",
      type: "credibility",
      data: {
        score: 98,
        reasoning: "Consistently cites peer-reviewed sources and corrects errors publicly."
      },
      reasoning: "Consistently cites peer-reviewed sources and corrects errors publicly.",
      createdAt: new Date().toISOString()
    }
  ]
};
