import { Component, inject, input, linkedSignal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { Meta, Title } from '@angular/platform-browser';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  readonly slug = input.required<string>();

  productRs = rxResource({
    request: () => ({
      slug: this.slug(),
    }),
    loader: ({ request }) => {
      return this.productService
        .getOneBySlug({ product_slug: request.slug })
        .pipe(
          tap((product) => {
            this.titleService.setTitle(product.title);
            this.metaService.updateTag({
              name: 'description',
              content: product.description,
            });
            this.metaService.updateTag({
              property: 'og:title',
              content: product.title,
            });
            this.metaService.updateTag({
              property: 'og:image',
              content: product.images[0],
            });
            this.metaService.updateTag({
              property: 'og:description',
              content: product.description,
            });
            this.metaService.updateTag({
              property: 'og:url',
              //content: `${environment.domain}/products/${product.slug}`,
            });
          }),
        );
    },
  });

  $cover = linkedSignal({
    source: this.productRs.value,
    computation: (product, previousValue) => {
      if (product && product.images.length > 0) {
        return product.images[0];
      }
      return previousValue?.value;
    },
  });

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  titleService = inject(Title);
  metaService = inject(Meta);

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productRs.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
