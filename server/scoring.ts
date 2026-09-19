import { GoogleGenAI } from '@google/genai';

export interface CandidateInput {
  candidateName: string;
  fileName: string;
  content: string;
}

export interface ScoreOutput {
  candidateName: string;
  fileName: string;
  score: number; // 0.0 to 1.0
  tier: 1 | 2 | 3;
  matchedSkills: string[];
  missingSkills: string[];
  pros: string[];
  cons: string[];
  nextAction: string;
  rawBreakdown: {
    method: string;
    model?: string;
    similarity?: number;
    details?: string;
    [key: string]: any;
  };
}

export interface TierThresholds {
  tier1_min: number;
  tier2_min: number;
}

// Common English stopwords for TF-IDF keyword extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
  'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
  'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
  'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'years',
  'experience', 'work', 'working', 'skills', 'responsibilities', 'role', 'team', 'candidate', 'ability', 'knowledge',
  'strong', 'good', 'proficient', 'required', 'preferred', 'including', 'job', 'description', 'company'
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9+#.]{2,}/g) || [])
    .filter((w) => !STOP_WORDS.has(w) && !/^\d+$/.test(w));
}

/**
 * Assigns tier 1, 2, or 3 based on numeric score and configured thresholds.
 */
export function assignTier(score: number, thresholds: TierThresholds): 1 | 2 | 3 {
  if (score >= thresholds.tier1_min) return 1;
  if (score >= thresholds.tier2_min) return 2;
  return 3;
}

/**
 * Rule-based rationale generation based on score and extracted keywords.
 */
export function generateDefaultRationale(
  score: number,
  tier: 1 | 2 | 3,
  matched: string[],
  missing: string[]
): { pros: string[]; cons: string[]; nextAction: string } {
  const pros: string[] = [];
  const cons: string[] = [];
  let nextAction = '';

  if (tier === 1) {
    pros.push('Exceptional overlap with core JD requirements and target domain competencies');
    if (matched.length > 0) {
      pros.push(`Verified proficiency in key matched areas: ${matched.slice(0, 4).join(', ')}`);
    }
    pros.push('Strong background profile meeting primary senior qualifications');
    if (missing.length > 0) {
      cons.push(`Verify depth in secondary requirements during interview: ${missing.slice(0, 3).join(', ')}`);
    } else {
      cons.push('No critical skill gaps identified against stated job description');
    }
    nextAction = 'Fast-track: Schedule Stage 1 Technical / Leadership Interview';
  } else if (tier === 2) {
    pros.push('Solid foundational skillset with moderate alignment to stated role parameters');
    if (matched.length > 0) {
      pros.push(`Demonstrated capability in: ${matched.slice(0, 3).join(', ')}`);
    }
    if (missing.length > 0) {
      cons.push(`Noticeable gaps or lower keyword relevance in: ${missing.slice(0, 4).join(', ')}`);
    }
    cons.push('May require targeted upskilling or supplementary technical evaluation');
    nextAction = 'Technical Screen: Assign take-home assessment or focused phone screen';
  } else {
    if (matched.length > 0) {
      pros.push(`Transferable foundational skills found in: ${matched.slice(0, 3).join(', ')}`);
    } else {
      pros.push('General professional qualifications present');
    }
    if (missing.length > 0) {
      cons.push(`Significant mismatch on core requirements: missing ${missing.slice(0, 5).join(', ')}`);
    }
    cons.push('Profile lacks prerequisite domain seniority or technical specialization for this position');
    nextAction = 'Archive / Hold: Retain on file for junior, alternate, or future talent pipelines';
  }

  return { pros, cons, nextAction };
}

/**
 * TF-IDF + Cosine Similarity scoring baseline.
 * Deterministic, offline, zero-network fallback that always works.
 */
export function scoreCandidatesWithTfIdf(
  jdText: string,
  candidates: CandidateInput[],
  thresholds: TierThresholds,
  topK: number = 10
): ScoreOutput[] {
  const jdTokens = tokenize(jdText);
  const candidateTokenSets = candidates.map((c) => tokenize(c.content));

  // Build document corpus (JD + all candidates)
  const corpus: string[][] = [jdTokens, ...candidateTokenSets];
  const numDocs = corpus.length;

  // Calculate Document Frequency (DF) for each term
  const dfMap = new Map<string, number>();
  for (const doc of corpus) {
    const uniqueTerms = new Set(doc);
    for (const term of uniqueTerms) {
      dfMap.set(term, (dfMap.get(term) || 0) + 1);
    }
  }

  // Calculate TF-IDF vectors
  const computeTfIdfVector = (docTokens: string[]): Map<string, number> => {
    const tfMap = new Map<string, number>();
    for (const term of docTokens) {
      tfMap.set(term, (tfMap.get(term) || 0) + 1);
    }

    const vector = new Map<string, number>();
    const totalTerms = docTokens.length || 1;
    for (const [term, count] of tfMap.entries()) {
      const tf = count / totalTerms;
      const df = dfMap.get(term) || 1;
      const idf = Math.log(1 + numDocs / df);
      vector.set(term, tf * idf);
    }
    return vector;
  };

  const jdVector = computeTfIdfVector(jdTokens);

  // Compute JD vector norm
  let jdNorm = 0;
  for (const val of jdVector.values()) {
    jdNorm += val * val;
  }
  jdNorm = Math.sqrt(jdNorm);

  // Rank top JD terms by TF-IDF weight
  const sortedJdTerms = Array.from(jdVector.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term);

  return candidates.map((candidate, idx) => {
    const cvTokens = candidateTokenSets[idx];
    const cvVector = computeTfIdfVector(cvTokens);
    const cvTokenSet = new Set(cvTokens);

    // Cosine similarity
    let dotProduct = 0;
    let cvNorm = 0;
    for (const [term, val] of cvVector.entries()) {
      cvNorm += val * val;
      if (jdVector.has(term)) {
        dotProduct += val * (jdVector.get(term) || 0);
      }
    }
    cvNorm = Math.sqrt(cvNorm);

    const rawSim = jdNorm > 0 && cvNorm > 0 ? dotProduct / (jdNorm * cvNorm) : 0;
    // Scale slightly for realistic HR distribution (raw cosine can be dense around 0.3-0.7)
    const normalizedScore = Math.min(1.0, Math.max(0.05, Math.round(Math.pow(rawSim, 0.75) * 100) / 100));

    // Overlapping matched terms
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const term of sortedJdTerms) {
      if (cvTokenSet.has(term)) {
        if (matchedSkills.length < topK) matchedSkills.push(term);
      } else {
        if (missingSkills.length < topK) missingSkills.push(term);
      }
    }

    const tier = assignTier(normalizedScore, thresholds);
    const { pros, cons, nextAction } = generateDefaultRationale(
      normalizedScore,
      tier,
      matchedSkills,
      missingSkills
    );

    return {
      candidateName: candidate.candidateName,
      fileName: candidate.fileName,
      score: normalizedScore,
      tier,
      matchedSkills,
      missingSkills,
      pros,
      cons,
      nextAction,
      rawBreakdown: {
        method: 'tfidf_cosine',
        similarity: Math.round(rawSim * 1000) / 1000,
        jdTermCount: jdTokens.length,
        cvTermCount: cvTokens.length
      }
    };
  });
}

/**
 * Gemini AI scoring engine using @google/genai with gemini-2.5-flash.
 * Evaluates resumes contextually, analyzing domain requirements, technical nuances,
 * and experience depth beyond simple keyword counting.
 */
async function scoreCandidateWithGemini(
  ai: GoogleGenAI,
  jdText: string,
  candidate: CandidateInput,
  thresholds: TierThresholds,
  topK: number
): Promise<ScoreOutput> {
  const prompt = `You are Sunjet Energy's expert Senior Technical Recruiter & Talent Screening Engine.
Analyze the following Candidate CV against the specified Job Description (JD).

Job Description:
"""
${jdText.slice(0, 5000)}
"""

Candidate Name: ${candidate.candidateName}
File Name: ${candidate.fileName}
Candidate Resume Content:
"""
${candidate.content.slice(0, 7000)}
"""

Return a strictly formatted JSON object with NO markdown wrapper, conforming to this exact schema:
{
  "score": number, // Overall suitability score between 0.00 and 1.00 (e.g. 0.85 for 85%)
  "matchedSkills": string[], // Up to ${topK} verified matching technical and domain skills
  "missingSkills": string[], // Up to ${topK} missing requirements or critical gaps
  "pros": string[], // 2 to 3 concise bullet points highlighting candidate strengths
  "cons": string[], // 1 to 3 concise bullet points highlighting gaps or risks
  "nextAction": string, // Recommended HR action (e.g. "Schedule Stage 1 Interview", "Technical Assessment", or "Archive for future")
  "summary": string // 1-2 sentence executive assessment of fit
}

Be rigorous and objective. If the candidate lacks essential certifications, tech stack requirements, or required years of experience, reflect that accurately in the score.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const responseText = response.text || '';
    const parsed = JSON.parse(responseText);

    const rawScore = typeof parsed.score === 'number' ? parsed.score : 0.5;
    const clampedScore = Math.min(1.0, Math.max(0.0, Math.round(rawScore * 100) / 100));
    const tier = assignTier(clampedScore, thresholds);

    return {
      candidateName: candidate.candidateName,
      fileName: candidate.fileName,
      score: clampedScore,
      tier,
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills.slice(0, topK) : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, topK) : [],
      pros: Array.isArray(parsed.pros) && parsed.pros.length > 0 ? parsed.pros : ['Strong core capabilities'],
      cons: Array.isArray(parsed.cons) && parsed.cons.length > 0 ? parsed.cons : ['No major flags identified'],
      nextAction: parsed.nextAction || (tier === 1 ? 'Schedule Interview' : tier === 2 ? 'Technical Screen' : 'Retain on file'),
      rawBreakdown: {
        method: 'gemini_ai',
        model: 'gemini-2.5-flash',
        similarity: clampedScore,
        details: parsed.summary || 'Gemini 2.5 Flash talent assessment'
      }
    };
  } catch (err: any) {
    console.warn(`[Gemini] Scoring failed for ${candidate.fileName}, falling back to TF-IDF:`, err?.message || err);
    // Fallback to single candidate TF-IDF
    const fallbackResults = scoreCandidatesWithTfIdf(jdText, [candidate], thresholds, topK);
    return fallbackResults[0];
  }
}

/**
 * Main coordinator function invoked by /api/screen in server.ts.
 */
export async function scoreCandidatesWithAI(
  jdText: string,
  candidates: CandidateInput[],
  method: string,
  thresholds: TierThresholds,
  topK: number = 10
): Promise<ScoreOutput[]> {
  const normalizedMethod = (method || 'gemini_ai').toLowerCase();

  // If user explicitly chose TF-IDF or if no Gemini key exists
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());

  if (normalizedMethod === 'tfidf' || !hasGeminiKey) {
    if (normalizedMethod !== 'tfidf' && !hasGeminiKey) {
      console.log('[scoring] GEMINI_API_KEY not configured — using TF-IDF baseline scorer.');
    }
    return scoreCandidatesWithTfIdf(jdText, candidates, thresholds, topK);
  }

  // Use Gemini 2.5 Flash
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const results: ScoreOutput[] = [];

    // Process candidates with concurrency cap (3 at a time)
    const chunkSize = 3;
    for (let i = 0; i < candidates.length; i += chunkSize) {
      const chunk = candidates.slice(i, i + chunkSize);
      const chunkPromises = chunk.map((candidate) =>
        scoreCandidateWithGemini(ai, jdText, candidate, thresholds, topK)
      );
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    return results;
  } catch (err: any) {
    console.warn('[scoring] Gemini batch scoring error, falling back to TF-IDF:', err?.message || err);
    return scoreCandidatesWithTfIdf(jdText, candidates, thresholds, topK);
  }
}
