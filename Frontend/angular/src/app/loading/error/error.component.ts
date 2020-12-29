import { Component, Input } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment";

@Component({
  selector: "error-dialog",
  templateUrl: "./error.component.html",
})
export class ErrorComponent {
  constructor(public dialogRef: MatDialogRef<ErrorComponent>) {}

  @Input() error: any;

  now() {
    return moment().format("L LT")
  }

  close() {
    this.dialogRef.close(true);
  }
}
