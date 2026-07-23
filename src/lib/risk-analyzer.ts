import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeContractRisk(contractText: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert legal risk analyst.' },
        { role: 'user', content: `Analyze the following contract for liabilities:\n\n${contractText}` }
      ],
    });

    return { success: true, analysis: response.choices[0].message.content };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
