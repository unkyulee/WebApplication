import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import "zone.js/dist/zone"; // Included with Angular CLI.

//
(window as any).global = window;

import * as obj from "object-path";
(window as any).obj = obj;

import * as moment from "moment";
(window as any).moment = moment;

import * as mustache from "mustache";
(window as any).mustache = mustache.default;

import "file-saver";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
