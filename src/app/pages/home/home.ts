import { Component } from '@angular/core';
import { CtaComponent } from './sections/cta/cta.component';
import { AuthorComponent } from './sections/author/author.component';
import { BookComponent } from './sections/book/book.component';
import { AboutComponent } from './sections/about/about.component';
import { MembersComponent } from './sections/members/members.component';


@Component({
  selector: 'app-home',
  imports: [
    CtaComponent,
    AuthorComponent,
    BookComponent,
    AboutComponent,
    MembersComponent
],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}