import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataService } from '../services/data/data.service';
import { IoService } from '../services/io/io.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  encodedData: any;
  scannedQRCode: any;
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private scanner: BarcodeScanner, private ds: DataService, private io: IoService) {
    this.encodedData = 'y0ng0p3';

    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  scanQRcode() {
    this.scanner.scan().then(async res => {
      this.scannedQRCode = res;
      // await this.ds.getQRcodes();
      // const found = this.ds.qrcodeList.value.find((_) => _.thumb === res);
      await this.ds.addCheck(1, `latitude:${this.io.latitude}, longitude:${this.io.latitude}`, false);
      // alert({checks: this.ds.checkList});
    }).catch(err => {
      alert(err);
    });
  }

  generateQRCode() {
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodedData).then(
        res => {
          // alert(res);
          console.log({res});
        this.ds.addQRCode(this.encodedData, `latitude:${this.io.latitude}, longitude:${this.io.latitude}`, res);
          this.encodedData = res;
        }, error => {
          alert(error);
        }
    );
}

}
