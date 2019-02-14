import { Component, Input, ViewChild } from "@angular/core";
import { FileUploader } from "ng2-file-upload";

// user imports
import { ConfigService } from "../../services/config.service";
import { EventService } from "../../services/event.service";
import { RestService } from "../../services/rest.service";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: "file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"]
})
export class FileUploadComponent {
  //
  constructor(
    private rest: RestService,
    private config: ConfigService,
    private event: EventService,
    private user: UserService
  ) {}

  @Input() uiElement: any;

  _data: any;
  @Input()
  get data(): any {
    return this._data;
  }
  set data(v) {
    this._data = v;
    // set uploader when data is ready
    if (v) this.setUploader();
  }

  get value() {
    if (
      this.data &&
      this.data[this.uiElement.key] &&
      this.data[this.uiElement.key].constructor === Array
    )
      return this.data[this.uiElement.key];
    else if (this.data && this.data[this.uiElement.key])
      return [this.data[this.uiElement.key]];

    return [];
  }

  set value(v: any) {
    if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = v;
    }
  }

  //
  @ViewChild("tableUpload") tableUpload: any;
  @ViewChild("tableFiles") tableFiles: any;

  //
  displayedColumns = ["Name", "Size", "Progress", "Status"];
  public uploader: FileUploader;

  //
  ngOnInit() {}

  // run setUploader when data is ready
  setUploader() {
    let url = this.uiElement.url;
    try {
      url = eval(url);
    } catch (e) {}
    if (url.startsWith("http") == false) {
      if (url.startsWith("/") == false) url = `/${url}`;
      url = `${this.rest.host()}${url}`;
    }

    let method = this.uiElement.method;

    this.uploader = new FileUploader({
      url: url,
      method: method,
      authToken: `Bearer ${localStorage.getItem("token")}`,
      authTokenHeader: "Authorization",
      headers: [{ name: "X-App-Key", value: this.config.configuration["_id"] }],
      autoUpload: true
    });

    // when upload is finished
    this.uploader.onSuccessItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => this.onSuccessUpload(item, response, status, headers);
  }

  onSuccessUpload(item: any, response: any, status: any, headers: any): any {
    // try to convert to object
    try {
      response = JSON.parse(response);
    } catch (e) {}

    // try to get download path
    let downloadPath = response;
    if (this.uiElement.downloadPathTransform)
      downloadPath = eval(this.uiElement.downloadPathTransform);

    // try to get id
    let id = response;
    if (this.uiElement.idTransform) id = eval(this.uiElement.idTransform);

    // save id of the file
    let currentValue = this.value;
    currentValue.push({
      id: id,
      url: downloadPath,
      filename: item.file.name,
      size: item.file.size
    });
    this.value = currentValue;

    // hide splash
    this.event.send("splash-hide");

    // save
    this.event.send({ name: "save" });

    // update table
    if (this.tableFiles) this.tableFiles.renderRows();
  }

  // refresh the table
  change(e) {
    this.event.send("splash-show"); // show splash
  }

  // delete attachment
  delete(row) {
    if (confirm("Are you sure to delete this item?") == true) {
      // delete from the row
      let item = this.value.find(item => item.id == row.id);
      if (item) {
        let index = this.value.indexOf(item);
        if (index > -1) this.value.splice(index, 1);
      }
      if (this.tableFiles) this.tableFiles.renderRows();
      // save
      this.event.send({ name: "save" });
    }
  }

  condition() {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }

  extra(row) {
    let param = "";

    // if in mobile setup pass auth
    if (location.protocol.startsWith("http") == false) {
      if (row.url.indexOf("?") > 0) param = "&";
      else param = "?";
      param += `bearer=${this.user.token()}&navigation_id=${
        this.config.configuration._id
      }`;
    }

    return param;
  }
}
