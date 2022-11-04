import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import "zone.js/dist/zone"; // Included with Angular CLI.

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
