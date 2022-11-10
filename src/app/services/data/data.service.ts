/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Check } from 'src/app/models/check/check';
import { QRcode } from 'src/app/models/qrcode/qrcode';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  qrcodeList = new BehaviorSubject([]);
  // qrcodeList = [];
  checkList = new BehaviorSubject([]);
  // checkList = [];
  private db: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    // private httpClient: HttpClient,
    // private sqlPorter: SQLitePorter,
  ) {
    const platforms = this.platform.platforms();
    console.log({ platforms });
    this.platform.ready().then(() => {
      this.initializeDatabase();
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  initializeDatabase() {
    console.log('Initialize database...');
    this.sqlite.create({
      name: 'roundcheck.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('Database created...', { db });
        this.db = db;

        this.createTables(db);
        this.setTables(db);
      });
  }


  createTables(sqliteObject: SQLiteObject) {
    /* // Roles Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS roles(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        label       TEXT,
        description TEXT,
        created_at  DATETIME,
        updated_at  DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Users Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS users(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname   TEXT,
        lastname    TEXT,
        username    TEXT,
        address     TEXT,
        token       TEXT,
        role_id     INTEGER,
        created_at  DATETIME,
        updated_at  DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Media Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS media(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        path        TEXT,
        created_at  DATETIME,
        updated_at  DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Companies Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS companies(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT,
        description TEXT,
        image       INTEGER,
        created_at  DATETIME,
        updated_at  DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Sites Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS sites(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        label       TEXT,
        address     TEXT,
        code        TEXT,
        company_id  INTEGER,
        description TEXT,
        created_at  DATETIME,
        updated_at  DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // User's sites Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS users_sites(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     INTEGER,
        site_id    INTEGER,
        created_at  DATETIME,
        updated_at  DATETIME,
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Checkpoints Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS checkpoints(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT,
        description TEXT,
        site_id     INTEGER,
        created_at  DATETIME,
        updated_at  DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );
 */
    // QRCodes Table
    console.log('Creating table "qrcodes"...');
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS qrcodes(
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        company         TEXT,
        site            TEXT,
        checkpoint      TEXT,
        location        TEXT,
        time            TEXT,
        date            TEXT,
        name            TEXT,
        thumb           TEXT,
    )`, [])
      .then(() => console.log('Table "qrcodes" created.'))
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Checks Table
    console.log('Creating table "checks"...');
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS checks(
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        qrcode_id       INTEGER,
        user_id         INTEGER,
        location        TEXT,
        is_incident     TINYINT,
        time            TEXT,
        date            TEXT,
    )`, [])
      .then(() => console.log('Table "checks" created.'))
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    /* // Incidents Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS incidents(
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        check_id    INTEGER,
        description TEXT,
        image       INTEGER,
        created_at  DATETIME,
        updated_at  DATETIME,
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      ); */
  }

  setTables(sqliteObject: SQLiteObject) {
    /* // Roles Table
    sqliteObject.executeSql(`
      INSERT INTO roles
      (id, label, description)
      values
      (1, 'DEFAULT_ROLE', 'Rôle par défaut.')`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    // Users Table
    sqliteObject.executeSql(`
      INSERT INTO users
      (id, firstname, lastname, username, address, token, role_id)
      values
      (1, 'demo', 'checker', 'demoUser', 'adresse', 'token', 1)`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    // Companies Table
    sqliteObject.executeSql(`
      INSERT INTO companies
      (id, name, description)
      values
      (1, 'malambi', 'Tracking & Services')`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    // Sites Table
    sqliteObject.executeSql(`
      INSERT INTO sites
      (id, label, address, code, company_id, description)
      values
      (1, 'malambi - akwa', 'Rue Bebe Elame, Akwa, Douala, Cameroun', 'malambiAkwa2', 1, 'Quatier Général')`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    // User's sites Table
    sqliteObject.executeSql(`
      INSERT INTO users_sites
      (id, user_id, site_id)
      values
      (1, 1, 1)`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    // Checkpoints Table
    sqliteObject.executeSql(`
      INSERT INTO checkpoints
      (id, title, description, site_id)
      values
      (1, 'Bureau-DG', 'Bureau du DG', 1)`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));
 */
    // QRCodes Table
    console.log('Setting table "qrcodes"...');
    sqliteObject.executeSql(`
      INSERT INTO qrcodes (
          company,
          site,
          checkpoint,
          location,
          time,
          date,
          name,
          thumb
        ) VALUES (
            'malambi', 
            'Quartier Général',
            'QRCode-Bureau-DG', 
            'location', 
            '',
            '',
            'name',
            'thumb'
          )`,
      [])
      .then(() => { console.log('Table "qrcodes" set.'); })
      .catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));


    // Checks Table
    console.log('Setting table "checks"...');
    sqliteObject.executeSql(`
      INSERT INTO checks 
      (id, qrcode_id, user_id, location, is_incident, time, date) 
      values 
      (1, 1, 1, 'location', 0, '', '')`,
      [])
      .then(() => { console.log('Table "checks" set.'); })
      .catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    /* // Incidents Table
    sqliteObject.executeSql(`
      INSERT INTO incidents
      (id, check_id, description)
      values
      (1, 1, 'description')`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e))); */
  }

  // get qrcodes
  async getQRcodes() {
    const res = await this.db.executeSql('SELECT * FROM qrcodes', []);
    alert(res);
    const items: QRcode[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          id: res.rows.item(i).id,
          company: res.rows.item(i).company,
          site: res.rows.item(i).site,
          checkpoint: res.rows.item(i).checkpoint_id,
          location: res.rows.item(i).location,
          time: res.row.item(i).time,
          date: res.row.item(i).date,
          name: res.rows.item(i).name,
          thumb: res.rows.item(i).thumb,
        });
      }
    }
    this.qrcodeList.next(items);
  }
  // add a qrcode
  async addQRCode(
    company: string,
    site: string,
    checkpoint: string,
    location: string,
    time: string,
    date: string,
    name?: number,
    thumb?: string
  ) {
    const data = [
      company,
      site,
      checkpoint,
      location,
      time,
      date,
      name,
      thumb
    ];
    const res = await this.db
      .executeSql(`
        INSERT INTO qrcodes (
          company,
          site,
          checkpoint,
          location,
          time,
          date,
          name,
          thumb
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, data);
    this.getQRcodes();
  }

  // get checks
  async getChecks() {
    const res = await this.db.executeSql('SELECT * FROM checks', []);
    // alert(res);
    const items: Check[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          id: res.rows.item(i).id,
          userId: res.rows.item(i).user_id,
          qrcodeId: res.rows.item(i).qrcode_id,
          location: res.rows.item(i).location,
          isIncident: res.rows.item(i).is_incident,
          time: res.rows.item(i).time,
          date: res.rows.item(i).date
        });
      }
    }
    this.checkList.next(items);
  }

  // add a check
  async addCheck(qrcodeId: number, location: string, isIncident?: boolean) {
    const data = [qrcodeId, 1, location, isIncident ? 1 : 0, '', ''];
    const res = await this.db
      .executeSql(
        `INSERT INTO checks (
          qrcode_id, 
          user_id, 
          location, 
          is_incident, 
          time, 
          date
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        data
      );
    this.getChecks();
  }

}
