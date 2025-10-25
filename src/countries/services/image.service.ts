import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCanvas } from 'canvas';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma';

@Injectable()
export class ImageService {
  private readonly summaryPath: string;
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.summaryPath =
      this.config.get<string>('SUMMARY_IMAGE_PATH') || 'cache/summary.png';
  }

  async generateSummaryImage(timestamp: Date) {
    const top5 = await this.prisma.country.findMany({
      where: { estimated_gdp: { not: null } },
      orderBy: { estimated_gdp: 'desc' },
      take: 5,
      select: { name: true, estimated_gdp: true },
    });

    const total = await this.prisma.country.count();

    // Create canvas
    const width = 1200;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Sans';
    ctx.fillText('Countries Summary', 40, 60);

    // Timestamp and total
    ctx.font = '20px Sans';
    ctx.fillText(`Last refresh: ${timestamp.toISOString()}`, 40, 100);
    ctx.fillText(`Total countries: ${total}`, 40, 130);

    // Top 5 list
    ctx.font = '22px Sans';
    ctx.fillText('Top 5 by estimated GDP', 40, 180);

    let y = 220;
    top5.forEach((t, idx) => {
      const gdpStr = t.estimated_gdp
        ? Number(t.estimated_gdp).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })
        : 'N/A';
      ctx.fillText(`${idx + 1}. ${t.name} — ${gdpStr}`, 60, y);
      y += 36;
    });

    // Ensure directory exists
    const dir = path.dirname(this.summaryPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Save file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(this.summaryPath, buffer);
  }

  fetchSummaryImage() {
    if (!existsSync(this.summaryPath)) {
      throw new NotFoundException('Image not found');
    }
    return readFileSync(this.summaryPath);
  }
}
