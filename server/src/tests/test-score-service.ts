import { ScoreService } from '../services/scoreService';
import { ISignal } from '../models/Signal';
import mongoose from 'mongoose';

const mockCreatorId = new mongoose.Types.ObjectId();

const mockSignals: Partial<ISignal>[] = [
  {
    type: 'affiliation',
    data: {
      entities: [
        { name: 'Tesla', sentiment: '+', strength: 5 },
        { name: 'SpaceX', sentiment: '+', strength: 4 }
      ]
    }
  },
  {
    type: 'affiliation',
    data: {
      entities: [
        { name: 'Tesla', sentiment: '+', strength: 3 },
        { name: 'Blue Origin', sentiment: '-', strength: 2 }
      ]
    }
  },
  {
    type: 'credibility',
    data: {
      claims: [
        { text: 'Claim 1', verifiable: true, hasEvidence: true },
        { text: 'Claim 2', verifiable: true, hasEvidence: false },
        { text: 'Claim 3', verifiable: false, hasEvidence: false }
      ],
      overallConfidence: 'High',
      contradictionsFound: false
    }
  }
];

function runTests() {
  console.log('--- Testing ScoreService ---');

  const results = ScoreService.calculateScores(mockSignals as ISignal[]);

  // Test Affiliation Aggregation
  console.log('\nAffiliation Results:');
  results.affiliation.forEach(a => {
    console.log(`- ${a.entityName}: Score=${a.sentimentScore.toFixed(2)}, Strength=${a.strength.toFixed(2)}, Count=${a.occurrences}`);
  });

  const tesla = results.affiliation.find(a => a.entityName === 'tesla');
  if (tesla && tesla.sentimentScore === 0.8 && tesla.occurrences === 2) {
    console.log('✅ Tesla affiliation correct (0.8 score)');
  } else {
    console.log('❌ Tesla affiliation failed', tesla);
  }

  const blueOrigin = results.affiliation.find(a => a.entityName === 'blue origin');
  if (blueOrigin && blueOrigin.sentimentScore === -0.4) {
    console.log('✅ Blue Origin affiliation correct (-0.4 score)');
  } else {
    console.log('❌ Blue Origin affiliation failed', blueOrigin);
  }

  // Test Credibility Aggregation
  console.log('\nCredibility Results:');
  console.log(JSON.stringify(results.credibility, null, 2));

  if (results.credibility.totalClaims === 3 && results.credibility.verifiableClaims === 2 && results.credibility.claimsWithEvidence === 1) {
    console.log('✅ Credibility counts correct');
  } else {
    console.log('❌ Credibility counts failed', results.credibility);
  }

  if (results.credibility.evidenceRatio === 0.5 && results.credibility.finalScore === 70) {
    console.log('✅ Credibility scoring correct (score: 70)');
  } else {
    console.log('❌ Credibility scoring failed', results.credibility);
  }

  console.log('\n--- Tests Complete ---');
}

runTests();
