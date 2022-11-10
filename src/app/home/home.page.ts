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
  company: any;
  site: any;
  checkpoint: any;
  scannedQRCode: any;
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private scanner: BarcodeScanner, private ds: DataService, private io: IoService) {
    this.encodedData = 'y0ng0p3';
    this.company = 'malambi';
    this.site = 'Quartier Général';
    this.checkpoint = 'QRCode-Bureau-DG';

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
    })
    .then((res) => {})
    .catch(err => {
      // alert(`error while scanning: ${err}`);
    });
  }

  generateQRCode() {
    console.log(this.io.latitude, this.io.longitude);
    const currentLocationString = `latitude:${this.io.latitude}, longitude:${this.io.latitude}`;
    const strings = [this.company, this.site, this.checkpoint, currentLocationString];
    this.encodedData = strings.join('%');
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodedData).then(
        async res => {
          alert(res);
          console.log({res});
        await this.ds.addQRCode(
          this.company,
          this.site,
          this.checkpoint,
          currentLocationString,
          '',
          '',
          this.encodedData,
          res);
          this.encodedData = res;
        }, error => {
          alert(error);
        }
    );
}

}
