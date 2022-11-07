import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  encodedData: any;
  scannedQRCode: any;
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private scanner: BarcodeScanner) {
    this.encodedData = 'y0ng0p3';

    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  scanQRcode() {
    this.scanner.scan().then(res => {
      this.scannedQRCode = res;
    }).catch(err => {
      alert(err);
    });
  }

  generateQRCode() {
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodedData).then(
        res => {
          alert(res);
          this.encodedData = res;
        }, error => {
          alert(error);
        }
    );
}

}
