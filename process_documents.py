"""
Document Processor - Chunks scraped content for RAG
"""
import json
import os


class DocumentProcessor:
    def __init__(self, chunk_size=500, chunk_overlap=50):
        """
        Initialize document processor

        Args:
            chunk_size: Size of each chunk in characters
            chunk_overlap: Overlap between chunks in characters
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text, metadata):
        """
        Split text into overlapping chunks

        Args:
            text: Text to chunk
            metadata: Metadata dict to attach to each chunk

        Returns:
            list: List of chunk dicts
        """
        chunks = []
        text = text.strip()

        if len(text) == 0:
            return chunks

        # If text is shorter than chunk size, return as single chunk
        if len(text) <= self.chunk_size:
            chunks.append({
                'content': text,
                'metadata': metadata
            })
            return chunks

        # Split into chunks with overlap
        start = 0
        while start < len(text):
            end = start + self.chunk_size

            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence end
                sentence_ends = ['. ', '.\n', '! ', '!\n', '? ', '?\n']
                best_break = end

                for i in range(end, max(start + self.chunk_size // 2, start), -1):
                    for ending in sentence_ends:
                        if text[i:i+len(ending)] == ending:
                            best_break = i + len(ending)
                            break
                    if best_break != end:
                        break

                end = best_break

            chunk_text = text[start:end].strip()

            if chunk_text:
                chunks.append({
                    'content': chunk_text,
                    'metadata': {
                        **metadata,
                        'chunk_index': len(chunks)
                    }
                })

            # Move start position with overlap
            start = end - self.chunk_overlap if end < len(text) else end

        return chunks

    def process_documents(self, scraped_data):
        """
        Process all scraped documents into chunks

        Args:
            scraped_data: List of scraped page dicts

        Returns:
            list: List of all chunks
        """
        all_chunks = []

        for page in scraped_data:
            metadata = {
                'url': page['url'],
                'title': page['title'],
                'word_count': page['word_count'],
                'scraped_at': page.get('scraped_at', '')
            }

            chunks = self.chunk_text(page['content'], metadata)
            all_chunks.extend(chunks)

        return all_chunks

    def save_chunks(self, chunks, output_file):
        """
        Save chunks to JSON file

        Args:
            chunks: List of chunk dicts
            output_file: Path to output file
        """
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(chunks, f, indent=2, ensure_ascii=False)

        print(f"💾 Saved {len(chunks)} chunks to: {output_file}")


if __name__ == "__main__":
    print("=" * 60)
    print("  DOCUMENT PROCESSOR")
    print("=" * 60)

    # Load scraped data
    input_file = 'data/scraped_data.json'
    print(f"\n📂 Loading: {input_file}")

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            scraped_data = json.load(f)
    except FileNotFoundError:
        print(f"❌ File not found: {input_file}")
        print("💡 Run scraper first: python run_scraper.py")
        exit(1)

    print(f"✓ Loaded {len(scraped_data)} pages")

    # Process into chunks
    processor = DocumentProcessor(chunk_size=500, chunk_overlap=50)
    print(f"\n🔪 Chunking documents (size={processor.chunk_size}, overlap={processor.chunk_overlap})...")

    chunks = processor.process_documents(scraped_data)
    print(f"✓ Created {len(chunks)} chunks")

    # Save
    output_file = 'data/knowledge_base.json'
    processor.save_chunks(chunks, output_file)

    print(f"\n✅ Processing completed!")
    print(f"\n📌 Next step: python generate_embeddings.py")
