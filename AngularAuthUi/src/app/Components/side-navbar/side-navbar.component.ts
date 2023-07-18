import { Component } from '@angular/core';
import{faPen} from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent {
penIcon = faPen;
}
