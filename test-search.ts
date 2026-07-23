import { searchLegalPrecedents } from './src/lib/ai-search';

async function test() {
  console.log("Searching precedents...");
  const relevantCases = await searchLegalPrecedents("Breach of SaaS enterprise contract regarding SLA uptime failures.");
  console.log("Matching Precedents Found:", relevantCases);
}

test();
