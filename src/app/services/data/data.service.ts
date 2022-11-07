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
  checkList = new BehaviorSubject([]);
  private db: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.initializeDatabase();
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  initializeDatabase() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.db = db;

        this.createTables(db);
        this.setTables(db);
      });
  }



  createTables(sqliteObject: SQLiteObject) {
    // Roles Table
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

    // QRCodes Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS qrcodes(
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        name            TEXT,
        checkpoint_id   INTEGER,
        location        TEXT,
        thumb           TEXT,
        created_at      DATETIME,
        updated_at      DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Checks Table
    sqliteObject.executeSql(`
        CREATE TABLE IF NOT EXISTS checks(
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id         INTEGER,
        qrcode_id       INTEGER,
        location        TEXT,
        is_incident     TINYINT,
        created_at      DATETIME
    )`, [])
      .catch((e: any) =>
        console.log('ERROR -> ' + JSON.stringify(e))
      );

    // Incidents Table
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
      );
  }

  setTables(sqliteObject: SQLiteObject) {
    // Roles Table
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

    // QRCodes Table
    sqliteObject.executeSql(`
      INSERT INTO qrcodes 
      (id, name, checkpoint_id, location, thumb) 
      values 
      (1, 'QRCode-Bureau-DG', 1, 'location', 'thumb')`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    // Checks Table
    sqliteObject.executeSql(`
      INSERT INTO checks 
      (id, user_id, qrcode_id, location, is_incident) 
      values 
      (1, 1, 1, 'location', 0)`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));

    // Incidents Table
    sqliteObject.executeSql(`
      INSERT INTO incidents 
      (id, check_id, description) 
      values 
      (1, 1, 'description')`,
      []).catch((e) => console.log('ERROR -> ' + JSON.stringify(e)));
  }

  // get qrcodes
  getQRcodes() {
    return this.db.executeSql('SELECT * FROM qrcodes', []).then(res => {
      const items: QRcode[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            name: res.rows.item(i).name,
            checkpointId: res.rows.item(i).checkpoint_id,
            location: res.rows.item(i).location,
            thumb: res.rows.item(i).thumb,
            createdAt: res.row.item(i).created_at,
            updatedAt: res.row.item(i).updated_at
          });
        }
      }
      this.checkList.next(items);
    });
  }

  // get checks
  getChecks() {
    return this.db.executeSql('SELECT * FROM checks', []).then(res => {
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
    });
  }

  // add a check
  addCheck(qrcodeId: number, location: string, isIncident?: boolean) {
    const data = [qrcodeId, location, isIncident];
    return this.db.executeSql('INSERT INTO checks (qrcode_id, location, is_incident) VALUES (?, ?, ?)', data)
      .then(res => {
        this.getChecks();
      });
  }

}
