import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(params: { category_id?: string; category_slug?: string }) {
    const url = new URL(`${environment.apiUrl}/api/v1/products`);
    if (params.category_id) {
      url.searchParams.set('categoryId', params.category_id);
    }
    if (params.category_slug) {
      url.searchParams.set('categorySlug', params.category_slug);
    }
    return this.http.get<Product[]>(url.toString());
  }

  getOneBySlug(params: { product_id?: string; product_slug?: string }) {
    if (!params.product_id && !params.product_slug) {
      throw new Error(
        'Se requiere al menos un parámetro: product_id o product_slug',
      );
    }

    const endpoint = params.product_id
      ? `products/${params.product_id}`
      : `products/slug/${params.product_slug}`;

    return this.http.get<Product>(`${environment.apiUrl}/api/v1/${endpoint}`);
  }

  getRelatedProducts(slug: string) {
    const url = new URL(
      `${environment.apiUrl}/api/v1/products/slug/${slug}/related`,
    );
    return this.http.get<Product[]>(url.toString());
  }
}
