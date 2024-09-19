const https = require('follow-redirects').https;

// Define the API endpoint and options
const options = {
  method: 'GET',
  hostname: 'api.dictionaryapi.dev',
  path: '/api/v2/entries/en/prince',
  headers: {},
  maxRedirects: 20,
  timeout: 10000 // 10 seconds
};

// Make the HTTPS request
const req = https.request(options, (res) => {
  let chunks = [];

  // Collect data chunks
  res.on('data', (chunk) => {
    chunks.push(chunk);
  });

  // Handle end of response
  res.on('end', () => {
    try {
      const body = Buffer.concat(chunks).toString();
      const data = JSON.parse(body);

      // Check if data is an array
      if (Array.isArray(data)) {
        data.forEach((entry, index) => {
          console.log(`\nEntry ${index + 1}: ${entry.word}\n`); // Corrected

          // Iterate over meanings
          entry.meanings.forEach((meaning, mIndex) => {
            console.log(`Meaning ${mIndex + 1}: (${meaning.partOfSpeech})`); // Corrected

            // Iterate over definitions
            meaning.definitions.forEach((def, dIndex) => {
              console.log(`  Definition ${dIndex + 1}: ${def.definition}`);

              // Check and display synonyms if available
              if (def.synonyms && def.synonyms.length > 0) {
                console.log(`    Synonyms: ${def.synonyms.join(', ')}`);
              } else {
                console.log(`    Synonyms: None`);
              }

              // Optionally, handle antonyms
              if (def.antonyms && def.antonyms.length > 0) {
                console.log(`    Antonyms: ${def.antonyms.join(', ')}`);
              }
            });

            // Synonyms at the meaning level
            if (meaning.synonyms && meaning.synonyms.length > 0) {
              console.log(`  Synonyms (Meaning Level): ${meaning.synonyms.join(', ')}`);
            }
          });
        });
      } else {
        console.log('Unexpected data format:', data);
      }
    } catch (err) {
      console.error('Error parsing JSON:', err.message);
    }
  });

  // Handle response errors
  res.on('error', (error) => {
    console.error('Response Error:', error);
  });
});

// Handle request errors
req.on('error', (error) => {
  console.error('Request Error:', error);
});

// Handle timeout
req.on('timeout', () => {
  console.error('Request timed out');
  req.abort();
});

// End the request
req.end();
