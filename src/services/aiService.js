/**
 * AI Service Module
 * Provides AI-powered features including recommendations, blog generation,
 * vlog descriptions, trending topics, and content performance analysis
 */

/**
 * Retry logic with exponential backoff for API calls
 */
const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const statusCode = error.message.match(/\d{3}/)?.[0];
      // Retry on 503, 429, or network errors
      if ((statusCode === '503' || statusCode === '429' || !statusCode) && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`API call failed (${statusCode}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

/**
 * Generate AI-powered recommendations based on user's content
 */
export const getAiRecommendations = (tasks, persona) => {
  const personaTasks = tasks.filter((task) => task.personaId === persona.id);
  const draftTasks = personaTasks.filter((task) => task.status === 'Draft');
  const overdueTasks = personaTasks.filter((task) => {
    const due = task.dueDate ? new Date(task.dueDate) : null;
    return task.status === 'Draft' && due && due < new Date();
  });
  const highPriorityDrafts = personaTasks.filter((task) => task.priority === 'High' && task.status === 'Draft');
  const publishedCount = personaTasks.filter((task) => task.status === 'Published').length;
  
  const allSuggestions = [];

  if (overdueTasks.length > 0) {
    allSuggestions.push(
      `You have ${overdueTasks.length} overdue draft${overdueTasks.length === 1 ? '' : 's'} for ${persona.name}. Start with "${overdueTasks[0].title}" to reduce risk.`,
    );
  }

  if (highPriorityDrafts.length > 0) {
    allSuggestions.push(
      `Focus on ${highPriorityDrafts.length} high-priority ${highPriorityDrafts.length === 1 ? 'draft' : 'drafts'} in your ${persona.niche} pipeline.`,
    );
  }

  if (draftTasks.length > 3) {
    allSuggestions.push(
      `There are ${draftTasks.length} active drafts. Publish at least 2 this week to keep momentum.`,
    );
  }

  if (publishedCount < 4 && draftTasks.length === 0) {
    allSuggestions.push(
      `Your ${persona.niche} story bank is healthy, but publish one more piece this week to stay consistent.`,
    );
  }

  if (personaTasks.length === 0) {
    allSuggestions.push(
      `Build a new content plan for ${persona.niche} and add a draft to kick off ${persona.name}'s next publishing cycle.`,
    );
  }

  if (allSuggestions.length === 0) {
    allSuggestions.push(
      `All clear for ${persona.name}. Consider adding a new idea and turning it into a priority draft.`,
    );
  }

  // Add rotating tips
  const tips = [
    `Try cross-posting your ${persona.niche} content to reach new audiences.`,
    `Engage with community comments to boost visibility on ${persona.platform}.`,
    `Schedule posts consistently to build audience trust.`,
    `Add multimedia elements (images, videos) to increase engagement.`,
    `Use trending topics in your ${persona.niche} to stay relevant.`,
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  allSuggestions.push(randomTip);

  return allSuggestions;
};

const getAiConfig = () => {
  const apiKey = localStorage.getItem('ai_api_key') || localStorage.getItem('openai_api_key');
  const providerUrl = localStorage.getItem('ai_provider_url');
  const apiHeader = localStorage.getItem('ai_api_header') || 'Authorization';
  return { apiKey, providerUrl, apiHeader };
};

const getHeaders = (apiKey, apiHeader) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiHeader.toLowerCase() === 'authorization') {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    headers[apiHeader] = apiKey;
  }

  return headers;
};

export const generateBlogPost = async (topic, persona) => {
  const { apiKey, providerUrl, apiHeader } = getAiConfig();
  if (!apiKey) throw new Error('API key not set. Please add your AI provider key in Settings.');

  const endpoint = providerUrl || 'https://api.openai.com/v1/chat/completions';
  const prompt = `Write a comprehensive blog post about "${topic}" in the style of a ${persona.niche} expert. Include an introduction, main content with sections, and a conclusion. Make it engaging and informative.`;

  return retryWithBackoff(async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getHeaders(apiKey, apiHeader),
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to generate blog post: ${response.status} ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || JSON.stringify(data);
  });
};

export const generateComments = async (postContent) => {
  const { apiKey, providerUrl, apiHeader } = getAiConfig();
  if (!apiKey) throw new Error('API key not set. Please add your AI provider key in Settings.');

  const endpoint = providerUrl || 'https://api.openai.com/v1/chat/completions';
  const prompt = `Generate 3 thoughtful and engaging comments for the following blog post: "${postContent.substring(0, 500)}..."`;

  return retryWithBackoff(async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getHeaders(apiKey, apiHeader),
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to generate comments: ${response.status} ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content.split('\n').filter((c) => c.trim()) || [];
  });
};

/**
 * Generate vlog description and script suggestions
 */
export const generateVlogDescription = async (topic, persona) => {
  const { apiKey, providerUrl, apiHeader } = getAiConfig();
  if (!apiKey) throw new Error('API key not set. Please add your AI provider key in Settings.');

  const endpoint = providerUrl || 'https://api.openai.com/v1/chat/completions';
  const prompt = `Create an engaging vlog script outline and description for a video about "${topic}" in the style of a ${persona?.niche || 'tech'} content creator.

Include:
1. A catchy video title (max 60 characters)
2. A compelling video description (2-3 sentences)
3. 5 key talking points
4. Suggested tags (comma-separated)
5. Optimal video length recommendation

Format as JSON:
{
  "title": "...",
  "description": "...",
  "talkingPoints": ["...", "..."],
  "tags": ["...", "..."],
  "recommendedLength": "..."
}`;

  return retryWithBackoff(async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getHeaders(apiKey, apiHeader),
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to generate vlog description: ${response.status} ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      return JSON.parse(content);
    } catch {
      return {
        title: topic,
        description: content.substring(0, 200),
        talkingPoints: content.split('\n').filter((l) => l.trim()).slice(0, 5),
        tags: [topic.toLowerCase()],
        recommendedLength: '8-12 minutes',
      };
    }
  });
};

/**
 * Generate trending topics for a niche
 */
export const generateTrendingTopics = async (niche) => {
  const { apiKey, providerUrl, apiHeader } = getAiConfig();
  if (!apiKey) throw new Error('API key not set. Please add your AI provider key in Settings.');

  const endpoint = providerUrl || 'https://api.openai.com/v1/chat/completions';
  const prompt = `Analyze current trends and generate 5 trending topic ideas for a content creator in the "${niche}" niche.

For each topic, provide:
1. Topic title
2. Why it's trending (brief explanation)
3. Content angle suggestion
4. Estimated engagement potential (High/Medium/Low)
5. Best platform for this topic (YouTube, Instagram, TikTok, Blog, etc.)

Format as JSON array:
[
  {
    "title": "...",
    "whyTrending": "...",
    "contentAngle": "...",
    "engagementPotential": "High",
    "bestPlatform": "..."
  }
]

Consider current technology trends, viral topics, and audience interests.`;

  return retryWithBackoff(async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getHeaders(apiKey, apiHeader),
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to generate trending topics: ${response.status} ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';

    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  });
};

/**
 * Analyze content performance and provide insights
 */
export const analyzeContentPerformance = async (posts, persona) => {
  const { apiKey, providerUrl, apiHeader } = getAiConfig();
  if (!apiKey) {
    // Return basic analysis without AI
    return getBasicContentAnalysis(posts);
  }

  const endpoint = providerUrl || 'https://api.openai.com/v1/chat/completions';
  const contentSummary = posts.slice(0, 10).map((p) => ({
    title: p.title,
    platform: p.platform,
    status: p.status,
    priority: p.priority,
  }));

  const prompt = `Analyze this content creator's performance and provide strategic recommendations.

Persona: ${persona.name} (${persona.niche} expert on ${persona.platform})

Recent Content:
${JSON.stringify(contentSummary, null, 2)}

Provide a detailed analysis with:
1. Overall content strategy assessment
2. Publishing consistency score (1-10)
3. Top 3 content gaps to fill
4. Recommended posting schedule
5. Growth opportunities

Format as JSON:
{
  "strategyAssessment": "...",
  "consistencyScore": 7,
  "contentGaps": ["...", "..."],
  "postingSchedule": {
    "recommendedDays": ["Monday", "Wednesday", "Friday"],
    "bestTimes": ["10:00 AM", "2:00 PM"],
    "postsPerWeek": 3
  },
  "growthOpportunities": ["...", "..."]
}`;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getHeaders(apiKey, apiHeader),
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        await response.text();
        throw new Error(`API failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '{}';

      try {
        return JSON.parse(content);
      } catch {
        return getBasicContentAnalysis(posts);
      }
    });
    return result;
  } catch (error) {
    console.warn('Analysis failed, using basic fallback:', error);
    return getBasicContentAnalysis(posts);
  }
};

/**
 * Basic content analysis without AI
 */
const getBasicContentAnalysis = (posts) => {
  const published = posts.filter((p) => p.status === 'Published').length;
  const drafts = posts.filter((p) => p.status === 'Draft').length;
  const total = posts.length;

  const consistencyScore = total > 0 ? Math.min(10, Math.round((published / total) * 10)) : 0;

  return {
    strategyAssessment: `You have ${total} content pieces with ${published} published and ${drafts} in draft. ${
      drafts > published ? 'Focus on publishing your drafts to improve momentum.' : 'Great publishing rhythm!'
    }`,
    consistencyScore,
    contentGaps: [
      'Consider adding more diverse topics',
      'Increase video content',
      'Add tutorial-style posts',
    ],
    postingSchedule: {
      recommendedDays: ['Monday', 'Wednesday', 'Friday'],
      bestTimes: ['10:00 AM', '2:00 PM', '7:00 PM'],
      postsPerWeek: 3,
    },
    growthOpportunities: [
      'Collaborate with other creators',
      'Cross-post to multiple platforms',
      'Engage with community comments',
    ],
  };
};
