import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    
    let textContent = '';
    for (const block of data.content || []) {
      if (block.type === 'text') textContent += block.text;
    }
    
    return NextResponse.json({ text: textContent });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json({ error: 'Failed to call Claude API' }, { status: 500 });
  }
}
