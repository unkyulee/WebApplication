import { Component, Input } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "error-dialog",
  templateUrl: "./error.component.html",
})
export class ErrorComponent {
  constructor(public dialogRef: MatDialogRef<ErrorComponent>) {}

  @Input() error: any;
  type;

  ngOnInit() {
    this.type = this.error.constructor.name;
  }

  close() {
    this.dialogRef.close(true);
  }
}
