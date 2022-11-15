import { Component } from '@angular/core';
import { BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { QRcode } from '../models/qrcode/qrcode';
import { DataService } from '../services/data/data.service';

import { IoService } from '../services/io/io.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  encodedData = 'y0ng0p3';
  scannedQRCode: BarcodeScanResult;
  listData: QRcode[];
  constructor(private io: IoService, private ds: DataService) {
    this.listData = this.ds.dataList;
  }

  scanQRcode() {
    this.io.scanQRcode();
    // setTimeout(() => {
      this.scannedQRCode = this.io.scannedQRCode;
      console.log({homeScannedCode: this.scannedQRCode});
    // }, 1000);
  }

  generateQRCode() {
    this.encodedData = this.io.generateQRCode();
  }

}
