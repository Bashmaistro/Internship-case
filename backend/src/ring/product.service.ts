import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Ring } from '../../models/product.model';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Filters {
  minPrice?: number;
  maxPrice?: number;
  minPopularity?: number;
  maxPopularity?: number;
}

@Injectable()
export class ProductsService {
  private readonly filePath = path.join(__dirname, '../../../data/products.json');
  private readonly logger = new Logger(ProductsService.name);

  async getAllProducts(filters?: Filters): Promise<Ring[]> {
  const goldPrice = await this.fetchGoldPrice();
  const rawData = fs.readFileSync(this.filePath, 'utf8');
  const products = JSON.parse(rawData);

  let result = products.map((p: any) => {
    const ring = new Ring(p);
    const price = (ring.popularityScore + 1) * ring.weight * goldPrice;
    return { ...ring, price: parseFloat(price.toFixed(2)) };
  });

  if (filters) {
    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.minPopularity !== undefined) {
      result = result.filter(p => p.popularityScore >= filters.minPopularity!);
    }
    if (filters.maxPopularity !== undefined) {
      result = result.filter(p => p.popularityScore <= filters.maxPopularity!);
    }
  }

  return result;
}
  getProductByName(name: string): Ring | undefined {
    const rawData = fs.readFileSync(this.filePath, 'utf8');
    const products = JSON.parse(rawData);
    const product = products.find((p: any) => p.name.toLowerCase() === name.toLowerCase());
    return product ? new Ring(product) : undefined;
  }

  async fetchGoldPrice(): Promise<number> {
    try {
      const url = 'https://finance.yahoo.com/quote/GC=F/';

      const { data: html } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        },
      });

      const $ = cheerio.load(html);

      const priceText = $('fin-streamer[data-symbol="GC=F"][data-field="regularMarketPrice"]').first().text();

      if (!priceText) {
        throw new Error('Fiyat bilgisi alınamadı.');
      }

      const price = parseFloat(priceText.replace(',', ''));

      const pricePerGram = price / 31.1035;
      return pricePerGram;
    } catch (error) {
      this.logger.error(`Altın fiyatı scraping başarısız: ${error.message}`);
      throw new Error('Altın fiyatı alınamadı.');
    }
  }
}
