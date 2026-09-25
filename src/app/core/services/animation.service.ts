import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

@Injectable({
  providedIn: 'root',
})
export class AnimationService {

  /**
   * Scroll mượt đến element thông qua HTML id.
   *
   * Ví dụ:
   * animationService.scrollToId('author');
   */
  scrollToId(id: string): void {

    // Tìm element trong DOM
    const element = document.getElementById(id);

    // Không tồn tại element thì không làm gì
    if (!element) {
      return;
    }

    // GSAP thực hiện smooth scroll
    gsap.to(window, {
      duration: 1.2,

      scrollTo: {
        y: element,
        autoKill: true,
      },

      ease: 'power3.inOut',
    });
  }
}