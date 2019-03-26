import { Injectable } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";

// user imports
import { UserService } from "./user/user.service";
import { EventService } from "./event.service";
import { ConfigService } from "./config.service";
import { last } from '@angular/router/src/utils/collection';

@Injectable()
export class NavService {
  constructor(
    private router: Router,
    private location: Location,
    private event: EventService,
    private user: UserService,
    private config: ConfigService
  ) {
    // set navigation
    this.set();

    // monitor navigation changes
    let that = this;
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        // add to navigation stack
        this.navigate(e.url);

        // save current url
        this.currUrl = e.url;
        this.currNav = this.find(e.url);

        // check if the current url and found url has the same
        if (this.currNav && this.currUrl.includes(this.currNav.url) == false) {
          this.router.navigateByUrl("/");
        }

        // check any auto login parameters to be saved
        let params = this.getParams();

        // see if there is a navigation filter
        if (
          this.config.configuration.navigation &&
          this.config.configuration.navigation.filter
        ) {
          try {
            eval(this.config.configuration.navigation.filter);
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
          data: {
            router: e,
            navigation: this.currNav
          }
        });
      }
    });

    // event handler
    this.event.onEvent.subscribe(e => {
      if (e == "authenticated") {
        // set navigation
        this.set();

        // set initial navigation
        this.currNav = this.find(this.currUrl);
        if (this.currNav) this.router.navigateByUrl(this.currNav.url);

        // send out events - trying to force reload the page
        this.event.send({
          name: "navigation-changed",
          data: {
            router: null,
            navigation: this.currNav
          }
        });
      } else if (e.name == "navigation-updated") {
        // when server has new navigation
        this.config.configuration.angular_navigation = e.data;
        this.set();
      }
    });
  }

  // current navigation settings
  currUrl: string;
  currNav: any;

  // navigation model
  navigation: any[] = [];

  set() {
    try {
      let navigation = this.config.configuration.angular_navigation;
      if (!navigation) {
        // if index.js doesn't contain angular_navigation then get it from the cache
        navigation = JSON.parse(localStorage.getItem("angular_navigation"));
      }

      // Set the settings from the given object
      this.navigation = this.accessConrol(navigation);
    } catch (e) {
      console.error(e);
    }
  }

  accessConrol(navigation) {
    let resultNav = [];

    // get roles from user
    let roleIds = this.user.roles();

    // fitler navigations with ACL
    if (navigation) {
      for (let navItem of navigation) {
        if (navItem.ACL) {
          if (navItem.ACL.find(value => -1 !== roleIds.indexOf(value)))
            resultNav.push(navItem);
        } else {
          resultNav.push(navItem);
        }
      }
    }

    return resultNav;
  }

  find(url: string) {
    if (!this.navigation) return null;

    // split by ?
    url = url.split("?")[0];
    // remove trailing slash
    if (url.substr(-1) === "/") {
      url = url.substr(0, url.length - 1);
    }

    // find item
    let firstNavItem = null;
    for (const navItem of this.navigation) {
      // save first navigation item
      if (firstNavItem == null && navItem.type == "item")
        firstNavItem = navItem;

      // if has children then loop through children
      if (navItem.children) {
        for (const child of navItem.children) {
          // save first navigation item
          if (firstNavItem == null && child.type == "item")
            firstNavItem = child;

          if (child.url && url == child.url) return child;
        }
      }

      // return found item
      if (url == navItem.url) return navItem;
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
    if (typeof value == 'undefined' || value == null) delete param[name];

    // form query string
    let queryString = new URLSearchParams();
    for (let key in param) {
      if (typeof param[key] !== 'undefined' && param[key] != null) {
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
        let lastNav = this.navigationStack[this.navigationStack.length-1];
        if(lastNav && lastNav.startsWith(url))
          this.navigationStack.pop();
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
    if(this.navigationStack[this.navigationStack.length-1] != url) {
      this.navigationStack.push(url);
    }

    // if navigation stack is bigger than 10 then pop oldest
    if (this.navigationStack.length > 10) this.navigationStack.shift();
  }

  navigateByUrl(url) {
    this.router.navigateByUrl(url)
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
    if (this.navigationStack.length > 0)
      this.router.navigateByUrl(
        this.navigationStack[this.navigationStack.length - 1]
      );
    else {
      this.router.navigateByUrl(
        this.currNav.parent_url ? this.currNav.parent_url : this.currNav.url
      );
    }

  }
}
