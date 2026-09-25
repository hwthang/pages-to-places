import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';

import gsap from 'gsap';

import { BlurBackgroundComponent } from '../../../../components/blur-background/blur-background.component';
import { AnimationService } from '../../../../core/services/animation.service';

@Component({
  selector: 'app-book',
  imports: [BlurBackgroundComponent],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements AfterViewInit, OnDestroy {
  /*
   * GSAP context của book.
   *
   * Context này chỉ quản lý animation
   * thuộc book component.
   */
  private context?: gsap.Context;
  private readonly animationService = inject(AnimationService);

  scrollToAuthor(): void {
    this.animationService.scrollToId('author');
  }

  /* =====================================================
     LIFECYCLE
     ===================================================== */

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  ngOnDestroy(): void {
    /*
     * Cleanup toàn bộ GSAP animation
     * khi book bị destroy.
     */
    this.context?.revert();
  }

  /* =====================================================
     ANIMATION
     ===================================================== */

  private initAnimation(): void {
    this.context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      /*
       * ---------------------------------------------------
       * BOOK
       * ---------------------------------------------------
       */

      gsap.set('.book-book', {
        y: 80,
        opacity: 0,
        scale: 0.88,
      });

      timeline.to('.book-book', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power4.out',
      });

      /*
       * ---------------------------------------------------
       * EYEBROW
       * ---------------------------------------------------
       */

      gsap.set('.book-eyebrow', {
        y: 20,
        opacity: 0,
      });

      timeline.to(
        '.book-eyebrow',
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
        },
        '-=0.9',
      );

      /*
       * ---------------------------------------------------
       * TITLE
       * ---------------------------------------------------
       */

      gsap.set('.book-title', {
        y: 50,
        opacity: 0,
      });

      timeline.to(
        '.book-title',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
        },
        '-=0.45',
      );

      /*
       * ---------------------------------------------------
       * AUTHOR
       * ---------------------------------------------------
       */

      gsap.set('.book-author', {
        y: 25,
        opacity: 0,
      });

      timeline.to(
        '.book-author',
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
        },
        '-=0.55',
      );

      /*
       * ---------------------------------------------------
       * DESCRIPTION
       * ---------------------------------------------------
       */

      gsap.set('.book-description', {
        y: 25,
        opacity: 0,
      });

      timeline.to(
        '.book-description',
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
        '-=0.45',
      );

      /*
       * ---------------------------------------------------
       * BUTTON
       * ---------------------------------------------------
       */

      gsap.set('.book-button', {
        y: 25,
        opacity: 0,
      });

      timeline.to(
        '.book-button',
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
        },
        '-=0.4',
      );

      /*
       * ---------------------------------------------------
       * BOOK FLOAT
       * ---------------------------------------------------
       */

      gsap.to('.book-book', {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8,
      });
    });
  }
}
