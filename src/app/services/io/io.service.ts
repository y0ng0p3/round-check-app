import { Injectable } from '@angular/core';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class IoService {
  encodedData: any;
  company: any;
  site: any;
  checkpoint: any;
  scannedQRCode: BarcodeScanResult;
  barcodeScannerOptions: BarcodeScannerOptions;
  dataLength = null;

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
    const stringLength = this.generateRandomNumber(3, 5);

    for (let i = 1; i < stringLength; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }

    return outString;
  }


  public generateQRCode() {
    this.getCurrentLocation();
    // this.randomData();
    this.nextData();
    console.log(this.latitude, this.longitude);
    const currentLocationString = `latitude:${this.latitude}, longitude:${this.longitude}`;
    const strings = [this.company, this.site, this.checkpoint];
    this.encodedData = strings.join('%');
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodedData)
      .then(
        res => {
          alert(res.format);
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
          const key = this.dataLength++;
          const value = {
            id: key,
            company: this.company,
            site: this.site,
            checkpoint: this.checkpoint,
            location: {
              latitude: this.latitude,
              longitude: this.longitude
            },
            time: '',
            date: '',
            name: this.encodedData,
            thumb: res
          };
          // await this.ds.set(`${key}`, value);
          alert(`io: ${value.name}`);
          this.ds.addDataList(value);
          // this.encodedData = res;
        })
      .catch(err => {
        alert(`Error while encoding code: ${err}`);
      });
    return this.encodedData;
  }

  public scanQRcode() {
    // this.getCurrentLocation();
    this.nextData();
    this.scanner.scan()
      .then((res: BarcodeScanResult) => {
        // if (this.ds.keys.length !== this.ds.qrcodeList.value.length) {

        // await this.ds.getAll();

        // }

        // const found = this.ds.qrcodeList.value.find((_) => _.thumb === res);
        // if (found) {alert(found.thumb);}
        // return found ? found : null;

        this.scannedQRCode = res;
        console.log({ ioScannedCode: this.scannedQRCode });
        // await this.ds.addCheck(1, `latitude:${this.latitude}, longitude:${this.latitude}`, false);
        // alert({checks: this.ds.checkList});

        const key = this.dataLength++;
        const value = {
          id: key,
          company: this.company,
          site: this.site,
          checkpoint: this.checkpoint,
          location: {
            latitude: this.latitude,
            longitude: this.longitude
          },
          time: '',
          date: '',
          name: this.encodedData,
          thumb: res.text
        };
        this.ds.addDataList(value);
      })
      .catch((err: any) => {
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
  private nextData() {
    const nextDataLength = this.dataLength === null ? this.ds.dataList.length++ : this.dataLength++;
    // alert(`nextDataLength: ${nextDataLength}`);
    // this.encodedData = this.generateRandomString();
    this.company = 'Compagnie ' + nextDataLength;
    this.site = 'Site ' + nextDataLength;
    this.checkpoint = 'Checkpoint ' + nextDataLength;
    this.dataLength = nextDataLength;
  }
}
