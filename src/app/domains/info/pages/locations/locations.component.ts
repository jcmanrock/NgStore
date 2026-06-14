import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  resource,
} from '@angular/core';
import { LocationsService } from '@shared/services/locations.service';
import type * as LeafletType from 'leaflet';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LocationsComponent {
  private locationsService = inject(LocationsService);
  private cdr = inject(ChangeDetectorRef);
  private map!: LeafletType.Map;
  private L!: typeof LeafletType;

  locationRs = resource({
    loader: async () => {
      const origin = await this.locationsService.getCurrentPosition();
      const locations = await this.locationsService.getLocations({ origin });
      return locations;
    },
  });

  constructor() {
    afterNextRender(async () => {
      const leaflet = await import('leaflet');
      const L = leaflet.default ?? leaflet;
      this.L = L;

      const iconDefault = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = iconDefault;

      this.map = L.map('map').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      this.cdr.detectChanges();
    });

    effect(() => {
      const locations = this.locationRs.value();
      if (!locations || !this.map || !this.L) return;

      locations.forEach(
        (location: { latitude: number; longitude: number; name: string }) => {
          this.L.marker([location.latitude, location.longitude])
            .addTo(this.map)
            .bindPopup(location.name);
        },
      );
    });
  }
}
