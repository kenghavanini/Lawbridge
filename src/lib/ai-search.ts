import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function searchLegalPrecedents(clientBriefText: string) {
  try {
    // 1. Generate vector embedding for the client brief
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: clientBriefText,
    });

    const vector = embeddingResponse.data[0].embedding;

    // 2. Call the Supabase pgvector RPC function
    const { data: matches, error } = await supabase.rpc('match_precedents', {
      query_embedding: vector,
      match_threshold: 0.75,
      match_count: 5,
    });

    if (error) throw error;
    return matches;
  } catch (err) {
    console.error("Semantic search failed:", err);
    return [];
  }
}
