import { Injectable } from '@angular/core';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class IoService {
  encodedData: any;
  company: any;
  site: any;
  checkpoint: any;
  scannedQRCode: any;
  barcodeScannerOptions: BarcodeScannerOptions;

  public latitude = 0;
  public longitude = 0;
  public geolocation: Geolocation = new Geolocation();

  constructor(private scanner: BarcodeScanner, private ds: DataService) {
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  public generateRandomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public generateRandomString(): string {
    let outString = '';
    const inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const stringLength = this.generateRandomNumber(25, 255);

    for (let i = 1; i < stringLength; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }

    return outString;
  }


  public generateQRCode() {
    this.getCurrentLocation();
    this.randomData();
    console.log(this.latitude, this.longitude);
    const currentLocationString = `latitude:${this.latitude}, longitude:${this.longitude}`;
    const strings = [this.company, this.site, this.checkpoint, currentLocationString];
    this.encodedData = strings.join('%');
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodedData)
      .then(
        async res => {
          // alert(res);
          console.log({ res });
          /* await this.ds.addQRCode(
            this.company,
            this.site,
            this.checkpoint,
            currentLocationString,
            '',
            '',
            this.encodedData,
            res); */
            const key = `${this.ds.keys.length + 1}`;
            const value = {
              company: this.company,
              site: this.site,
              checkpoint: this.checkpoint,
              location: currentLocationString,
              time: '',
              date: '',
              encodedData: this.encodedData,
              thumb: res
            };
            await this.ds.set(key, value);
          // this.encodedData = res;
        }, error => {
          alert(error);
        }
      )
      .catch(err => {
        alert(`Error while encoding code: ${err}`);
      });
  }

  public scanQRcode(): any | null {
    this.getCurrentLocation();
    this.randomData();
    this.scanner.scan().then(async res => {
      // if (this.ds.keys.length !== this.ds.qrcodeList.value.length) {
        await this.ds.getAll();
      // }
      const found = this.ds.qrcodeList.value.find((_) => _.thumb === res);
      return found ? found : null;
      // await this.ds.addCheck(1, `latitude:${this.latitude}, longitude:${this.latitude}`, false);
      // alert({checks: this.ds.checkList});
    })
      .catch(err => {
        alert(`Error while scanning: ${err}`);
      });
  }

  private getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('resp location: ');
      // alert(`latitude: ${resp.coords.latitude}, longitude: ${resp.coords.longitude}`);
    }).catch((error) => {
      console.log('Error getting location');
      console.log(error);
    });
  }

  private randomData() {
    this.encodedData = this.generateRandomString();
    this.company = this.generateRandomString();
    this.site = this.generateRandomString();
    this.checkpoint = this.generateRandomString();
  }
}
