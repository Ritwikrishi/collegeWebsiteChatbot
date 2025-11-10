/**
 * RAG (Retrieval-Augmented Generation) Client
 * Loads embeddings and performs semantic search using Transformers.js
 */

class RAGClient {
    constructor() {
        this.data = null;
        this.extractor = null;
        this.isReady = false;
    }

    /**
     * Initialize RAG system - load model and embeddings
     */
    async init() {
        try {
            console.log('🔧 Initializing RAG system...');

            // Load embeddings data
            console.log('📂 Loading embeddings...');
            const response = await fetch('data/embeddings.json');
            if (!response.ok) {
                throw new Error(`Failed to load embeddings: ${response.status}`);
            }
            this.data = await response.json();
            console.log(`✓ Loaded ${this.data.chunks.length} chunks`);

            // Dynamically import Transformers.js
            console.log('📦 Loading Transformers.js model...');
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');

            // Load feature extraction pipeline (same model as Python)
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('✓ Model loaded');

            this.isReady = true;
            console.log('✅ RAG system ready');
            return true;

        } catch (error) {
            console.error('❌ RAG initialization failed:', error);
            this.isReady = false;
            return false;
        }
    }

    /**
     * Search for relevant chunks using semantic similarity
     * @param {string} query - User query
     * @param {number} topK - Number of results to return
     * @returns {Array} Top K relevant chunks with scores
     */
    async search(query, topK = 3) {
        if (!this.isReady) {
            throw new Error('RAG system not initialized');
        }

        try {
            // Generate query embedding
            const queryEmbedding = await this.extractor(query, { pooling: 'mean', normalize: true });

            // Calculate similarities
            const similarities = this.data.embeddings.map((embedding, idx) => {
                const similarity = this.cosineSimilarity(queryEmbedding.data, embedding);
                return {
                    index: idx,
                    score: similarity,
                    chunk: this.data.chunks[idx]
                };
            });

            // Sort by similarity and get top K
            similarities.sort((a, b) => b.score - a.score);
            const topResults = similarities.slice(0, topK);

            console.log(`🔍 Found ${topResults.length} relevant chunks for query:`, query);
            topResults.forEach((result, i) => {
                console.log(`  ${i + 1}. ${result.chunk.metadata.title} (score: ${result.score.toFixed(3)})`);
            });

            return topResults;

        } catch (error) {
            console.error('❌ Search failed:', error);
            throw error;
        }
    }

    /**
     * Calculate cosine similarity between two vectors
     * @param {Array} vecA - First vector
     * @param {Array} vecB - Second vector
     * @returns {number} Similarity score (0-1)
     */
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA === 0 || normB === 0) {
            return 0;
        }

        return dotProduct / (normA * normB);
    }
}
