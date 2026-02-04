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

const generateDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const MOCK_SIGNALS = {
  mrwhosetheboss: [
    { _id: "mw-a1", type: "affiliation", data: { entities: [{ name: "Consumer Tech", sentiment: "+", confidence: 0.95 }], summary: "Dominant focus on smartphone ecosystem and consumer electronics." }, createdAt: generateDate(2) },
    { _id: "mw-a2", type: "affiliation", data: { entities: [{ name: "Sustainability", sentiment: "+", confidence: 0.85 }], summary: "Increasing support for repairability and sustainable manufacturing." }, createdAt: generateDate(5) },
    { _id: "mw-a3", type: "affiliation", data: { entities: [{ name: "AI Integration", sentiment: "+", confidence: 0.92 }], summary: "Significant focus on AI capabilities in mobile hardware." }, createdAt: generateDate(10) },
    { _id: "mw-a4", type: "affiliation", data: { entities: [{ name: "Apple Ecosystem", sentiment: "+", confidence: 0.65 }], summary: "Balanced but consistent coverage of iOS platform changes." }, createdAt: generateDate(15) },
    { _id: "mw-a5", type: "affiliation", data: { entities: [{ name: "Android Innovation", sentiment: "+", confidence: 0.88 }], summary: "Strong advocacy for hardware competition in the Android space." }, createdAt: generateDate(20) },
    
    { _id: "mw-c1", type: "credibility", data: { score: 95, reasoning: "Verified hardware benchmarks match public independent testing data." }, createdAt: generateDate(1) },
    { _id: "mw-c2", type: "credibility", data: { score: 90, reasoning: "Detailed disclosure of review unit origins and sponsorship status." }, createdAt: generateDate(3) },
    { _id: "mw-c3", type: "credibility", data: { score: 94, reasoning: "Scientific approach to camera testing using standardized charts." }, createdAt: generateDate(6) },
    { _id: "mw-c4", type: "credibility", data: { score: 92, reasoning: "Consistent battery life testing methodology across different brands." }, createdAt: generateDate(8) },
    { _id: "mw-c5", type: "credibility", data: { score: 93, reasoning: "Transparent correction regarding initial software bug findings." }, createdAt: generateDate(11) },
    { _id: "mw-c6", type: "credibility", data: { score: 91, reasoning: "In-depth teardown analysis confirms internal component quality claims." }, createdAt: generateDate(14) },
    { _id: "mw-c7", type: "credibility", data: { score: 96, reasoning: "Multiple citations of engineering specs during hardware reviews." }, createdAt: generateDate(17) },
    { _id: "mw-c8", type: "credibility", data: { score: 92, reasoning: "Consistent long-term usage updates on previously reviewed devices." }, createdAt: generateDate(21) },
    { _id: "mw-c9", type: "credibility", data: { score: 94, reasoning: "Evidence-backed critique of anti-repair software locks." }, createdAt: generateDate(25) },
    { _id: "mw-c10", type: "credibility", data: { score: 95, reasoning: "Consistent high accuracy in pre-launch speculative analysis." }, createdAt: generateDate(29) }
  ],
  BillGates: [
    { _id: "bg-a1", type: "affiliation", data: { entities: [{ name: "Global Health", sentiment: "+", confidence: 0.98 }], summary: "Stark alignment with vaccine architecture and disease eradication." }, createdAt: generateDate(2) },
    { _id: "bg-a2", type: "affiliation", data: { entities: [{ name: "Climate Change", sentiment: "+", confidence: 0.96 }], summary: "Strong advocacy for net-zero technologies and green energy." }, createdAt: generateDate(6) },
    { _id: "bg-a3", type: "affiliation", data: { entities: [{ name: "Nuclear Energy", sentiment: "+", confidence: 0.90 }], summary: "Support for Next-gen nuclear as a base-load power source." }, createdAt: generateDate(12) },
    { _id: "bg-a4", type: "affiliation", data: { entities: [{ name: "Sustainable Farming", sentiment: "+", confidence: 0.85 }], summary: "Alignment with agricultural innovation for food security." }, createdAt: generateDate(18) },
    { _id: "bg-a5", type: "affiliation", data: { entities: [{ name: "Digital Education", sentiment: "+", confidence: 0.92 }], summary: "Support for remote learning technologies and global connectivity." }, createdAt: generateDate(24) },
    
    { _id: "bg-c1", type: "credibility", data: { score: 98, reasoning: "Cites peer-reviewed epidemiological data in health discussions." }, createdAt: generateDate(4) },
    { _id: "bg-c2", type: "credibility", data: { score: 96, reasoning: "Transparent reporting on foundation outcomes, including failures." }, createdAt: generateDate(7) },
    { _id: "bg-c3", type: "credibility", data: { score: 94, reasoning: "Consistent use of scientific consensus in climate projections." }, createdAt: generateDate(10) },
    { _id: "bg-c4", type: "credibility", data: { score: 95, reasoning: "Detailed white-papers provided for all major foundation policy shifts." }, createdAt: generateDate(13) },
    { _id: "bg-c5", type: "credibility", data: { score: 92, reasoning: "Public correction of past predictions regarding energy costs." }, createdAt: generateDate(16) },
    { _id: "bg-c6", type: "credibility", data: { score: 97, reasoning: "Evidence-based discussion on global poverty reduction metrics." }, createdAt: generateDate(19) },
    { _id: "bg-c7", type: "credibility", data: { score: 93, reasoning: "Consistent alignment with WHO and other global health bodies." }, createdAt: generateDate(22) },
    { _id: "bg-c8", type: "credibility", data: { score: 96, reasoning: "Uses historical data to project future technological impacts." }, createdAt: generateDate(25) },
    { _id: "bg-c9", type: "credibility", data: { score: 95, reasoning: "High verifiability of claims through public foundation ledgers." }, createdAt: generateDate(28) },
    { _id: "bg-c10", type: "credibility", data: { score: 98, reasoning: "Transparent disclosure of personal investments in climate tech." }, createdAt: generateDate(30) }
  ],
  tarak9999: [
    { _id: "nt-a1", type: "affiliation", data: { entities: [{ name: "Telugu Cinema", sentiment: "+", confidence: 0.99 }], summary: "Deep rooted alignment with the evolution of Tollywood." }, createdAt: generateDate(1) },
    { _id: "nt-a2", type: "affiliation", data: { entities: [{ name: "Film Heritage", sentiment: "+", confidence: 0.95 }], summary: "Consistent tribute to cinematic legacy and artistic history." }, createdAt: generateDate(4) },
    { _id: "nt-a3", type: "affiliation", data: { entities: [{ name: "Global Indian Cinema", sentiment: "+", confidence: 0.90 }], summary: "Increasing alignment with the crossover of Indian films to global audiences." }, createdAt: generateDate(9) },
    { _id: "nt-a4", type: "affiliation", data: { entities: [{ name: "Authentic Storytelling", sentiment: "+", confidence: 0.88 }], summary: "Support for original narratives and experimental scripts." }, createdAt: generateDate(15) },
    { _id: "nt-a5", type: "affiliation", data: { entities: [{ name: "Fan Engagement", sentiment: "+", confidence: 0.96 }], summary: "Strong focus on responsible fandom and community welfare." }, createdAt: generateDate(21) },
    
    { _id: "nt-c1", type: "credibility", data: { score: 92, reasoning: "Consistent public statements regarding career choices and projects." }, createdAt: generateDate(3) },
    { _id: "nt-c2", type: "credibility", data: { score: 88, reasoning: "Authentic personal branding with minimal contradictory messaging." }, createdAt: generateDate(6) },
    { _id: "nt-c3", type: "credibility", data: { score: 90, reasoning: "Transparent communication about upcoming film schedules." }, createdAt: generateDate(8) },
    { _id: "nt-c4", type: "credibility", data: { score: 94, reasoning: "High consistency in values expressed during public interviews." }, createdAt: generateDate(11) },
    { _id: "nt-c5", type: "credibility", data: { score: 91, reasoning: "Direct clarification of rumors without engaging in controversy." }, createdAt: generateDate(14) },
    { _id: "nt-c6", type: "credibility", data: { score: 89, reasoning: "Consistent support for industry peers through social media." }, createdAt: generateDate(17) },
    { _id: "nt-c7", type: "credibility", data: { score: 93, reasoning: "Evidence-backed philanthropic activities through established NGOs." }, createdAt: generateDate(20) },
    { _id: "nt-c8", type: "credibility", data: { score: 90, reasoning: "Predictable pattern of film promotion and release announcements." }, createdAt: generateDate(23) },
    { _id: "nt-c9", type: "credibility", data: { score: 88, reasoning: "Respectful and verifiable references to cinematic history." }, createdAt: generateDate(26) },
    { _id: "nt-c10", type: "credibility", data: { score: 95, reasoning: "High reliability of information provided in official press releases." }, createdAt: generateDate(29) }
  ],
  veritasium: [
    { _id: "v-a1", type: "affiliation", data: { entities: [{ name: "Science Education", sentiment: "+", confidence: 0.99 }], summary: "Core alignment with accurate and engaging science communication." }, createdAt: generateDate(2) },
    { _id: "v-a2", type: "affiliation", data: { entities: [{ name: "STEM Research", sentiment: "+", confidence: 0.96 }], summary: "Strong support for university research and basic science." }, createdAt: generateDate(5) },
    { _id: "v-a3", type: "affiliation", data: { entities: [{ name: "Critical Thinking", sentiment: "+", confidence: 0.98 }], summary: "consistent advocacy for the scientific method and skeptical analysis." }, createdAt: generateDate(10) },
    { _id: "v-a4", type: "affiliation", data: { entities: [{ name: "Independent Media", sentiment: "+", confidence: 0.92 }], summary: "Support for non-traditional educational content creation." }, createdAt: generateDate(16) },
    { _id: "v-a5", type: "affiliation", data: { entities: [{ name: "Curiosity-Driven Learning", sentiment: "+", confidence: 0.94 }], summary: "Aligned with lifelong learning and intellectual exploration." }, createdAt: generateDate(22) },
    
    { _id: "v-c1", type: "credibility", data: { score: 99, reasoning: "Extensive citation of peer-reviewed journals for every major claim." }, createdAt: generateDate(1) },
    { _id: "v-c2", type: "credibility", data: { score: 97, reasoning: "Direct collaboration with actual researchers and subject matter experts." }, createdAt: generateDate(4) },
    { _id: "v-c3", type: "credibility", data: { score: 98, reasoning: "Transparent process of peer-reviewing videos before public release." }, createdAt: generateDate(7) },
    { _id: "v-c4", type: "credibility", data: { score: 96, reasoning: "Public retraction and pinned correction of a past physics error." }, createdAt: generateDate(9) },
    { _id: "v-c5", type: "credibility", data: { score: 99, reasoning: "High verifiability of experimental setups and data recording." }, createdAt: generateDate(12) },
    { _id: "v-c6", type: "credibility", data: { score: 97, reasoning: "Consistent use of visual aids to simplify but accurately represent data." }, createdAt: generateDate(15) },
    { _id: "v-c7", type: "credibility", data: { score: 98, reasoning: "Evidence-backed rebuttal of popular scientific misconceptions." }, createdAt: generateDate(19) },
    { _id: "v-c8", type: "credibility", data: { score: 95, reasoning: "Transparent disclosure regarding sponsorship from educational tools." }, createdAt: generateDate(24) },
    { _id: "v-c9", type: "credibility", data: { score: 99, reasoning: "Matches consensus within the international scientific community." }, createdAt: generateDate(27) },
    { _id: "v-c10", type: "credibility", data: { score: 98, reasoning: "History of visiting laboratories to verify claims in person." }, createdAt: generateDate(31) }
  ]
};
