/**
 * Cloudflare Worker for Election Odyssey
 * Proxies requests to Google Gemini API to hide the API key
 * 
 * Setup: 
 * 1. Deploy this worker to Cloudflare
 * 2. Run: wrangler secret put GEMINI_API_KEY
 * 3. Enter your Gemini API key when prompted
 */

export default {
  async fetch(request, env, ctx) {
    // CORS headers to allow your static site to call this worker
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Change to your domain in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const { prompt, history, context } = await request.json();

      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Missing prompt' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get API key from Cloudflare secret
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured in worker secrets' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Build Gemini API payload with history
      const contents = [
        ...(history || []),
        { role: 'user', parts: [{ text: prompt }] }
      ];

      const geminiPayload = {
        contents: contents,
        systemInstruction: {
          parts: [{ text: context?.systemPrompt || 'You are a helpful assistant.' }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      };

      // Call Gemini API - Using Gemini 2.5 Flash (different quota pool)
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload)
        }
      );

      const data = await geminiResponse.json();

      // Forward Gemini response
      return new Response(JSON.stringify(data), {
        status: geminiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Worker error', 
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
