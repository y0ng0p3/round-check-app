import { Injectable } from '@angular/core';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class IoService {

  public latitude = 0;
  public longitude = 0;
  public geolocation: Geolocation = new Geolocation();

  constructor() {
    this.getCurrentLocation();
  }

  private getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('resp location: ');
      console.log(resp);
    }).catch((error) => {
      console.log('Error getting location');
      console.log(error);
    });
  }
}
