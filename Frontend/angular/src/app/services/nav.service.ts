import { Injectable } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";

// user imports
import { EventService } from "./event.service";
import { ConfigService } from "./config.service";
import { PermissionService } from "./permission.service";
import { UtilService } from "./util.service";

@Injectable()
export class NavService {
  constructor(
    private router: Router,
    private location: Location,
    private event: EventService,
    private config: ConfigService,
    private permission: PermissionService,
    private util: UtilService
  ) {
    // monitor navigation changes
    router.events.subscribe((e) => this.routerEventHandler(e));

    // event handler
    this.event.onEvent.subscribe((e) => this.eventHandler(e));
  }

  clear() {
    this.config.set("nav", null);
    this.config.set("theme", null);
  }

  routerEventHandler(e) {
    if (e instanceof NavigationEnd) {
      // add to navigation stack
      this.navigate(e.url);

      // split if #
      e.url = e.url.split("#")[0];

      // save current url
      this.currUrl = e.url;
      this.currNav = this.find(e.url);
      if (this.currNav) {
        // check if the current url and found url has the same
        if (this.currNav && this.currUrl.includes(this.currNav.url) == false) {
          this.router.navigateByUrl("/");
        }

        // see if there is a navigation filter
        if (this.config.get("navigation.filter")) {
          try {
            eval(this.config.get("navigation.filter"));
          } catch (e) {
            console.error(e);
          }
        }

        // if it is at the root with no navigation assigned
        // then navigate to the first item
        if (e.url == "/") {
          let first = this.find(e.url);
          if (first && first.url != e.url) this.router.navigateByUrl(first.url);
        }

        // send out events
        this.event.send({
          name: "navigation-changed",
          data: this.currNav,
        });
      }
    }
  }

  eventHandler(e) {
    if (e.name == "navigation-updated") {
      // set initial navigation
      this.currNav = this.find(this.currUrl);
      if (this.currNav) {
        // keep the current query string before changing the nav
        let url = this.currNav.url;
        let queryStrings = this.location.path().split("?");
        if (queryStrings.length > 1) url += `?${queryStrings[1]}`;

        this.router.navigateByUrl(url);

        // send out events - trying to force reload the page
        this.event.send({
          name: "navigation-changed",
          data: this.currNav,
        });
      }
    } else if (e.name == "nav-badge") {
      // find navigation fits the url
      let navigation = this.config.get("nav");
      for (let nav of navigation) {
        if (nav.url == e.url) {
          nav.badge = e.badge;
        }
      }
      // send navigation updated
      this.event.send({ name: "navigation-changed" });
    }
  }

  // current navigation settings
  currUrl: string;
  currNav: any;

  find(url: string) {
    let navigation = this.config.get("nav");
    if (!navigation) return null;

    // split by ?
    url = url.split("?")[0];
    // remove trailing slash
    if (url.substr(-1) === "/") {
      url = url.substr(0, url.length - 1);
    }

    // find item
    let firstNavItem = null;
    for (const navItem of navigation) {
      if (this.permission.check(navItem)) {
        // save first navigation item
        if (firstNavItem == null && !navItem.children) {
          if (navItem.type == "desktop" && !this.util.isElectron()) {
          } else if (navItem.type == "sub") {
          } else {
            firstNavItem = navItem;
          }
        }

        // if has children then loop through children
        if (navItem.children) {
          for (const child of navItem.children) {
            if (this.permission.check(child)) {
              // save first navigation item
              if (firstNavItem == null && !child.children) {
                if (navItem.type == "desktop" && !this.util.isElectron()) {
                } else if (navItem.type == "sub") {
                } else {
                  firstNavItem = child;
                }
              }

              if (
                child.url &&
                url == child.url &&
                this.permission.check(navItem)
              )
                return child;
            }
          }
        }

        // return found item
        if (url == navItem.url) return navItem;
      }
    }

    return firstNavItem;
  }

  // get/set parameter on the URL without reloading the page
  getParams() {
    let tempUrl = this.location.path().split("?");
    if (tempUrl.length > 1) {
      let url = "?" + this.location.path().split("?")[1];
      let params = {},
        queryString = url.substring(1),
        regex = /([^&=]+)=([^&]*)/g,
        m;

      while ((m = regex.exec(queryString))) {
        if (params[decodeURIComponent(m[1])]) {
          // if it already exists then convert to array
          params[decodeURIComponent(m[1])] = [params[decodeURIComponent(m[1])]];
          params[decodeURIComponent(m[1])].push(
            decodeURIComponent(m[2]).replace(/\+/g, " ")
          );
        } else {
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]).replace(
            /\+/g,
            " "
          );
        }
      }

      return params;
    }

    return {};
  }

  setParam(name, value, navigate = false) {
    let param = this.getParams();

    // set param
    param[name] = value;

    // remove param if empty
    if (typeof value == "undefined" || value == null) delete param[name];

    // form query string
    let queryString = new URLSearchParams();
    for (let key in param) {
      if (typeof param[key] !== "undefined" && param[key] != null) {
        if (Array.isArray(param[key])) {
          for (let v of param[key]) queryString.append(key, v);
        } else {
          queryString.set(key, param[key]);
        }
      }
    }

    // refresh the page
    if (this.currUrl) {
      let url = this.currUrl.split("?")[0];
      if (navigate == true) {
        // navigate to link
        this.router.navigateByUrl(`${url}?${queryString.toString()}`);
      } else {
        // update url - without renavigating to the page
        this.location.replaceState(url, queryString.toString());
        // leave only last stack of the navigation history of the same page
        let lastNav = this.navigationStack[this.navigationStack.length - 1];
        if (lastNav && lastNav.startsWith(url)) this.navigationStack.pop();
        // update navigation statck
        this.navigate(`${url}?${queryString.toString()}`);
      }
    }
  }

  // navigate back
  navigationStack = [];

  navigate(url) {
    // add to navigation stack
    // if last entry is the same then don't add to the queu
    if (this.navigationStack[this.navigationStack.length - 1] != url) {
      this.navigationStack.push(url);
    }

    // if navigation stack is bigger than 10 then pop oldest
    if (this.navigationStack.length > 10) this.navigationStack.shift();
  }

  navigateByUrl(url) {
    this.router.navigateByUrl(url);
  }

  navPopStack(match?) {
    if (match && this.navigationStack.length) {
      let url = this.navigationStack[this.navigationStack.length - 1];
      if (url.startsWith(match)) {
        this.navigationStack.pop();
      }
    } else {
      this.navigationStack.pop();
    }
  }

  back() {
    // pop stack
    this.navPopStack();

    // go to last element
    if (this.currNav.parent_url) {
      // when stack is empty and parent_url exists then go to parent url
      this.router.navigateByUrl(this.currNav.parent_url);
    } else if (this.navigationStack.length > 0) {
      this.router.navigateByUrl(
        this.navigationStack[this.navigationStack.length - 1]
      );
    } else {
      // go back one url
      history.go(-1);
    }
  }

  /**
   * Check if the given url can be found
   * in one of the given parent's children
   *
   * @param parent
   * @param url
   * @returns {any}
   */
  isUrlInChildren(parent, url) {
    if (url) {
      if (!parent.children) return false;

      for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].children)
          if (this.isUrlInChildren(parent.children[i], url)) return true;

        if (
          parent.children[i].url === url ||
          url.includes(parent.children[i].url)
        )
          return true;
      }
    }

    return false;
  }
}
