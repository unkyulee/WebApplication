import { Injectable } from "@angular/core";
import * as obj from "object-path";

// user imports
import { RestService } from "../rest.service";
import { EventService } from "../event.service";
import { ConfigService } from "../config.service";
import { IndexedDBStrategy } from './indexeddb/indexeddb';

@Injectable()
export class DBService {
  constructor(
    public rest: RestService,
    public event: EventService,
    public config: ConfigService
  ) {
    // setup authentication strategy
    let dbConfig = obj.get(this.config.configuration, "db", {});
    switch (dbConfig.dbStrategy) {
      default:
        this.dbStrategy = new IndexedDBStrategy();
    }

    // connect to the db
    this.dbStrategy.connect(dbConfig)
  }

  // authenticateion strategy object
  dbStrategy: any;

  async insert(table, rows) {
    return await this.dbStrategy.insert(table, rows)
  }

  async list(table, where, sort, limit, skip) {
    return await this.dbStrategy.list(table, where, sort, limit, skip)
  }

  async delete(table, where) {
    return await this.dbStrategy.delete(table, where)
  }
}
