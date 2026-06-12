import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  async getLocations(params: {
    origin?: string;
    size?: number;
    radius?: number;
  }) {
    const url = new URL(`${environment.apiUrl}/api/v1/locations`);

    if (params.origin) url.searchParams.set('origin', params.origin);
    if (params.size) url.searchParams.set('size', params.size.toString());
    if (params.radius) url.searchParams.set('radius', params.radius.toString());

    const response = await fetch(url.toString());
    return response.json();
  }

  getCurrentPosition(): Promise<string> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          resolve(coords);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
}
