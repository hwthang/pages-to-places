import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../../../core/services/animation.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  /**
   * Khởi tạo animation khi section xuất hiện
   * trong viewport.
   */
  ngAfterViewInit(): void {
    this.initAnimation();
  }

  private readonly animationService = inject(AnimationService);

  scrollToCta(): void {
    this.animationService.scrollToId('cta');
  }
  /**
   * Animation cho toàn bộ About section.
   */
  private initAnimation(): void {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#about',

        /*
         * Bắt đầu animation khi section
         * đi vào khoảng 75% viewport.
         */
        start: 'top 75%',

        once: true,
      },
    });

    /*
     * Eyebrow xuất hiện từ dưới lên.
     */
    timeline.from('.about-eyebrow', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    /*
     * Title xuất hiện lớn từ dưới lên.
     */
    timeline.from(
      '.about-title',
      {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.3',
    );

    /*
     * Phần nội dung bên phải xuất hiện
     * sau title.
     */
    timeline.from(
      '.about-info',
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.6',
    );

    /*
     * Divider mở rộng từ trái sang phải.
     */
    timeline.from(
      '.about-divider',
      {
        scaleX: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.5',
    );
  }

  /**
   * Dọn ScrollTrigger khi component bị destroy.
   */
  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}
