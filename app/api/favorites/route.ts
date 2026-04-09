import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { productId, action } = await request.json();
    
    // Construct the absolute path to favorites.txt (in project root)
    const filePath = path.join(process.cwd(), 'favorites.txt');
    
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] Action: ${action}, Product ID: ${productId}\n`;

    await fs.appendFile(filePath, logLine);

    return NextResponse.json({ success: true, message: `Successfully logged ${action} for product ${productId}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to write to favorites file' }, { status: 500 });
  }
}
