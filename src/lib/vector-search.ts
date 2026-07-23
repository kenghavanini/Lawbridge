import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function searchLegalPrecedents(query: string) {
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query.replace(/\n/g, ' '),
    });

    const [{ embedding }] = embeddingResponse.data;

    const { data: matches, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 5,
    });

    if (error) throw error;
    return matches;
  } catch (err) {
    console.error("Vector precedent search failed:", err);
    return [];
  }
}
