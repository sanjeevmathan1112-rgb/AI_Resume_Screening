const natural = require('natural');
const TfIdf = natural.TfIdf;

exports.calculateSimilarity = (doc1, doc2) => {
  const tfidf = new TfIdf();
  tfidf.addDocument(doc1);
  tfidf.addDocument(doc2);
  
  // Basic cosine similarity approximation between the two documents
  // A simple way using natural's terms
  let score = 0;
  
  // We extract the term vectors for both documents
  const vec1 = {};
  const vec2 = {};
  
  tfidf.listTerms(0).forEach(item => { vec1[item.term] = item.tfidf; });
  tfidf.listTerms(1).forEach(item => { vec2[item.term] = item.tfidf; });
  
  // Calculate dot product
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (const term in vec1) {
    if (vec2[term]) {
      dotProduct += vec1[term] * vec2[term];
    }
    mag1 += vec1[term] * vec1[term];
  }
  
  for (const term in vec2) {
    mag2 += vec2[term] * vec2[term];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  return dotProduct / (mag1 * mag2);
};
