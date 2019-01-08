import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import * as obj from 'object-path'
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit, OnDestroy {
  constructor(
    private event: EventService
    , private config: ConfigService
  ) { }

  /*
  open	boolean	false	Indicates if this FAB Speed Dial is opened
  direction	up, down, left or right	up	The direction to open the action buttons
  animationMode	fling or scale	fling	The animation to apply when opening the action buttons
  fixed	boolean	false	Indicates if this FAB Speed Dial is fixed (user cannot change the open state on click)
  */
  open: boolean
  direction: string = "left"
  animationMode: string = "fling"
  fixed: boolean = false
  spin: boolean = true

  // data
  workflows: any[]

  onEvent: Subscription

  ngOnInit() {
    // load config
    this.applyConfiguration(this.config.configuration)

    // event handlers
    this.onEvent = this.event.onEvent.subscribe(
      event => {
        if( event.name == 'workflow' )
          this.workflows = event.data
        else if( event.name == 'navigation-changed' )
          this.workflows = null
      }
    )
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe()
  }

  accent: string
  applyConfiguration(configuration) {
    this.accent = obj.get(configuration, 'colors.accent')
  }

}
