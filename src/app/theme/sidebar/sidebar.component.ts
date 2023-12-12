import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() showToggle = true;
  @Input() showUser = true;
  @Input() showEmail = true;
  @Input() showHeader = true;
  @Input() toggleChecked = false;

  // @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<boolean>();

  // ... restante del código

  toggleSidebar() {
    this.toggleCollapsed.emit(!this.toggleChecked);
  }
}
