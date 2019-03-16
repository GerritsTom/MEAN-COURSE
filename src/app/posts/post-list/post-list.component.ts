import { Component } from '@angular/core';

@Component({
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css'],
  templateUrl: './post-list.component.html'
})
export class PostListComponent {

  /*
  posts = [{title: 'First Post', content: 'This is the first post'},
          {title: 'Second Post', content: 'This is the second post'},
          {title: 'Third Post', content: 'This is the third post'}] */

  posts = [];
}
