import { Component, Input } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: 'text-area'
  , templateUrl: './text-area.component.html'
})
export class TextAreaComponent {
  constructor(
    public user: UserService
    , public config: ConfigService
  ) { }

  @Input() uiElement: any
  @Input() data: any

  get value() {
    let v = null;

    // do not set value if it is password
    if (this.uiElement.inputType == 'password')
      return

    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (!this.data[this.uiElement.key]) {
        let def = this.uiElement.default        
        try { def = eval(this.uiElement.default) }
        catch (e) { console.error(e) }
        this.data[this.uiElement.key] = def
      }

      // set value
      v = this.data[this.uiElement.key]
    }

    // Transform
    if (this.uiElement.transform) {
      try { v = eval(this.uiElement.transform) }
      catch (e) { }
    }

    return v
  }

  set value(v: any) {
    if (this.data) this.data[this.uiElement.key] = v
  }

}
