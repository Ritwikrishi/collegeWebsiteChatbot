"""
Embedding Generator - Creates embeddings for RAG using sentence-transformers
"""
import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer


class EmbeddingGenerator:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        """
        Initialize embedding generator

        Args:
            model_name: Name of sentence-transformers model
        """
        print(f"📦 Loading model: {model_name}")
        self.model = SentenceTransformer(model_name)
        print(f"✓ Model loaded")

    def generate_embeddings(self, chunks, batch_size=32):
        """
        Generate embeddings for all chunks

        Args:
            chunks: List of chunk dicts with 'content' key
            batch_size: Batch size for encoding

        Returns:
            list: List of embeddings (as lists)
        """
        print(f"\n🔢 Generating embeddings for {len(chunks)} chunks...")

        # Extract texts
        texts = [chunk['content'] for chunk in chunks]

        # Generate embeddings in batches
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=True,
            convert_to_numpy=True
        )

        # Convert to list of lists for JSON serialization
        embeddings_list = embeddings.tolist()

        print(f"✓ Generated {len(embeddings_list)} embeddings")
        print(f"   Dimension: {len(embeddings_list[0])}")

        return embeddings_list

    def save_knowledge_base(self, chunks, embeddings, output_file):
        """
        Save chunks and embeddings to JSON file

        Args:
            chunks: List of chunk dicts
            embeddings: List of embedding vectors
            output_file: Path to output file
        """
        knowledge_base = {
            'chunks': chunks,
            'embeddings': embeddings,
            'model': 'all-MiniLM-L6-v2',
            'embedding_dim': len(embeddings[0]) if embeddings else 0
        }

        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(knowledge_base, f, indent=2, ensure_ascii=False)

        # Get file size
        file_size = os.path.getsize(output_file) / (1024 * 1024)  # MB

        print(f"\n💾 Saved to: {output_file}")
        print(f"   File size: {file_size:.2f} MB")
        print(f"   Chunks: {len(chunks)}")
        print(f"   Embeddings: {len(embeddings)}")


if __name__ == "__main__":
    print("=" * 60)
    print("  EMBEDDING GENERATOR")
    print("=" * 60)

    # Load knowledge base
    input_file = 'data/knowledge_base.json'
    print(f"\n📂 Loading: {input_file}")

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            chunks = json.load(f)
    except FileNotFoundError:
        print(f"❌ File not found: {input_file}")
        print("💡 Run processor first: python process_documents.py")
        exit(1)

    print(f"✓ Loaded {len(chunks)} chunks")

    # Generate embeddings
    generator = EmbeddingGenerator()
    embeddings = generator.generate_embeddings(chunks, batch_size=32)

    # Save
    output_file = 'data/embeddings.json'
    generator.save_knowledge_base(chunks, embeddings, output_file)

    print(f"\n✅ Embeddings generated successfully!")
    print(f"\n📌 Next step: Open index.html in browser to test chatbot")
