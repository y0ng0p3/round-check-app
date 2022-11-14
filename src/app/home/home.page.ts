import { Component } from '@angular/core';

import { IoService } from '../services/io/io.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  encodedData: any;
  scannedQRCode: any;
  constructor(private io: IoService) {

  }

  scanQRcode() {
    this.scannedQRCode = this.io.scanQRcode();
    this.encodedData = this.scanQRcode.name;
  }

  generateQRCode() {
    this.io.generateQRCode();
  }

}
