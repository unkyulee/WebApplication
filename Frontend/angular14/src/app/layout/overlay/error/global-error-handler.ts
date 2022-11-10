import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { ErrorDialogService } from "./error-dialog.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorDialogService: ErrorDialogService,
    private zone: NgZone
  ) {}

  handleError(error: any) {
    if (!error) return;
    if (error.code == -100) return;

    // Check if it's an error from an HTTP response
    this.zone.run(() => {
      this.errorDialogService.openDialog(
        error?.message || "Unhandled Error",
        error?.status,
        error?.stack
      );
    });
    console.error("global error", error);
  }
}
