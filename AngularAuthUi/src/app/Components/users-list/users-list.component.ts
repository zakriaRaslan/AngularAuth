import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
users:any[]=[];
constructor(private Api:ApiService){}
ngOnInit(): void {

    this.Api.getUsers().subscribe((usersList)=>{
      this.users = usersList;
    })
}
}
