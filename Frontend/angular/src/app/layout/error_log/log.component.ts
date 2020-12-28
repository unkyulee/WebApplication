import { Component, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { LogService } from "../../services/log.service";

// user imports
import { BaseComponent } from "../../ui/base.component";

@Component({
  selector: "log-dialog",
  templateUrl: "./log.component.html",
})
export class LogDialogComponent extends BaseComponent {
  constructor(
    public dialogRef: MatDialogRef<LogDialogComponent>,
    public ref: ChangeDetectorRef,
    public logService: LogService
  ) {
    super();
  }

  close() {
    this.dialogRef.close(true);
  }
}
