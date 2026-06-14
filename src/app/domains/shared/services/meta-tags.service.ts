import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

export interface PageMetaData {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const defaultMetaData: PageMetaData = {
  title: 'Ng Store',
  description: 'Ng Store is an e-commerce application built with Angular',
  image: 'https://example.com/default-image.jpg',
  url: 'https://ngstore.app',
};

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  titleService = inject(Title);
  metaService = inject(Meta);

  updateMetaTags(metaData: Partial<PageMetaData>) {
    const metaDataToUpdate = { ...defaultMetaData, ...metaData };

    const tags = this.generateMetaDefinitions(metaDataToUpdate);
    tags.forEach((tag) => this.metaService.updateTag(tag));
    this.titleService.setTitle(metaDataToUpdate.title);
  }

  private generateMetaDefinitions(metaData: PageMetaData): MetaDefinition[] {
    return [
      {
        property: 'title',
        content: metaData.title,
      },
      {
        property: 'description',
        content: metaData.description || defaultMetaData.description,
      },
      {
        property: 'og:title',
        content: metaData.title,
      },
      {
        property: 'og:description',
        content: metaData.description || defaultMetaData.description,
      },
      {
        property: 'og:image',
        content: metaData.image ?? defaultMetaData.image!,
      },
      {
        property: 'og:url',
        content: metaData.url ?? defaultMetaData.url!,
      },
    ];
  }
}
