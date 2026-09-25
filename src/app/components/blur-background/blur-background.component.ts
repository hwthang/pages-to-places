import { Component, input } from '@angular/core';

@Component({
  selector: 'app-blur-background',
  standalone: true,
  templateUrl: './blur-background.component.html',
  styleUrl: './blur-background.component.css',
})
export class BlurBackgroundComponent {
  image = input<string>('');
  blur = input<number>(20);
  overlay = input<number>(0.4);
}