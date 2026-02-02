import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

async function testSignals() {
  try {
    console.log('--- Testing Signals API ---');
    console.log(`API_URL: ${API_URL}`);

    // 0. Health check
    console.log('Performing health check...');
    try {
      const healthRes = await axios.get('http://localhost:5000/health');
      console.log('Health check response:', healthRes.data);
    } catch (healthErr: any) {
      console.error('Health check failed:', healthErr.message);
    }
    
    // 1. Get creators to find a handle
    console.log('Fetching creators...');
    const creatorsRes = await axios.get(`${API_URL}/creators?query=a`); // Search for 'a' to get some results
    console.log('Creators response status:', creatorsRes.status);
    const creators = creatorsRes.data.creators;
    
    if (!creators || creators.length === 0) {
      console.log('No creators found with query "a".');
      return;
    }
    
    const handle = creators[0].handle;
    console.log(`Testing signals for handle: ${handle}`);
    
    // 2. Fetch signals for the handle
    const signalsRes = await axios.get(`${API_URL}/creators/${handle}/signals`);
    console.log('Signals response status:', signalsRes.status);
    const signals = signalsRes.data.signals;
    
    console.log(`Found ${signals.length} signals.`);
    if (signals.length > 0) {
      console.log('First signal preview:');
      console.log(JSON.stringify(signals[0], null, 2));
    } else {
      console.log('No signals found for this creator yet. This is expected if the AI hasn\'t processed them.');
    }
    
    console.log('--- Test Complete ---');
  } catch (error: any) {
    if (error.response) {
      console.error('Test failed with response data:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Test failed with message:', error.message);
    }
  }
}

testSignals();
