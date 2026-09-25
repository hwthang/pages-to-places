import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BlurBackgroundComponent } from '../../../../components/blur-background/blur-background.component';
import { AnimationService } from '../../../../core/services/animation.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-author',
  imports: [BlurBackgroundComponent],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css',
})
export class AuthorComponent implements AfterViewInit, OnDestroy {
  /*
   * GSAP context dùng để quản lý toàn bộ
   * animation thuộc Author component.
   *
   * Khi component bị destroy,
   * toàn bộ animation + ScrollTrigger sẽ được cleanup.
   */
  private context?: gsap.Context;

  private readonly animationService = inject(AnimationService);

  scrollToBook(): void {
    this.animationService.scrollToId('book');
  }

  /* =====================================================
     LIFECYCLE
     ===================================================== */

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  ngOnDestroy(): void {
    /*
     * Xóa animation khi rời component.
     */
    this.context?.revert();
  }

  /* =====================================================
     AUTHOR ANIMATION
     ===================================================== */

  private initAnimation(): void {
    this.context = gsap.context(() => {
      /*
       * Timeline chính.
       *
       * paused: true
       * → timeline chỉ chạy khi ScrollTrigger kích hoạt.
       */
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      /* =================================================
         1. BACKGROUND
         ================================================= */

      /*
       * Background ban đầu:
       *
       * - hơi zoom
       * - hơi mờ
       */
      gsap.set('.author-background', {
        scale: 1.08,
        opacity: 0,
      });

      timeline.to(
        '.author-background',
        {
          scale: 1,
          opacity: 1,
          duration: 1.8,
          ease: 'power2.out',
        },
        0,
      );

      /* =================================================
         2. AVATAR GLOW
         ================================================= */

      /*
       * Glow ban đầu rất nhỏ.
       */
      gsap.set('.author-glow', {
        scale: 0.5,
        opacity: 0,
      });

      timeline.to(
        '.author-glow',
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
        },
        0.1,
      );

      /* =================================================
         3. AVATAR
         ================================================= */

      /*
       * Avatar bắt đầu:
       *
       * y: 80
       * → nằm thấp hơn vị trí thực.
       *
       * scale: 0.75
       * → nhỏ hơn.
       *
       * rotate: -8
       * → hơi nghiêng.
       */
      gsap.set('.author-avatar', {
        y: 40,
        scale: 0.75,
        opacity: 0,
        rotate: -8,
      });

      timeline.to(
        '.author-avatar',
        {
          y: 0,
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.3,
          ease: 'power4.out',
        },
        0.25,
      );

      /* =================================================
         4. LABEL
         ================================================= */

      gsap.set('.author-label', {
        y: 20,
        opacity: 0,
      });

      timeline.to(
        '.author-label',
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
        },
        0.65,
      );

      /* =================================================
         5. AUTHOR NAME
         ================================================= */

      gsap.set('.author-name', {
        y: 60,
        opacity: 0,
      });

      timeline.to(
        '.author-name',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
        },
        0.55,
      );

      /* =================================================
         6. DIVIDER
         ================================================= */

      /*
       * Divider ban đầu không có width.
       */
      gsap.set('.author-divider span:first-child', {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      timeline.to(
        '.author-divider span:first-child',
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.9,
      );

      /* =================================================
         7. PARIS TEXT
         ================================================= */

      gsap.set('.author-divider span:last-child', {
        opacity: 0,
        x: 15,
      });

      timeline.to(
        '.author-divider span:last-child',
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
        },
        1.05,
      );

      /* =================================================
         8. DESCRIPTION
         ================================================= */

      gsap.set('.author-description', {
        y: 30,
        opacity: 0,
      });

      timeline.to(
        '.author-description',
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
        1.1,
      );

      /* =================================================
         9. QUOTE
         ================================================= */

      gsap.set('.author-quote', {
        y: 30,
        opacity: 0,
      });

      timeline.to(
        '.author-quote',
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        1.3,
      );

      /* =================================================
         10. SCROLL TRIGGER
         ================================================= */

      ScrollTrigger.create({
        trigger: '#author',

        /*
         * Khi top của section đi đến 70%
         * viewport thì animation bắt đầu.
         */
        start: 'top 70%',

        /*
         * Chạy animation.
         */
        onEnter: () => {
          timeline.play();
        },

        /*
         * Nếu muốn scroll ngược lên và animation
         * chạy lại từ đầu thì giữ onLeaveBack.
         */
        onLeaveBack: () => {
          timeline.restart();
        },

        /*
         * markers: true,
         *
         * Bật dòng này khi debug vị trí trigger.
         */
        // markers: true,
      });

      /* =================================================
         11. AVATAR FLOAT
         ================================================= */

      /*
       * Sau khi avatar xuất hiện,
       * cho avatar floating rất nhẹ.
       *
       * Không dùng ScrollTrigger cho animation này
       * vì nó cần chạy liên tục.
       */
      gsap.to('.author-avatar', {
        y: -8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });
    }, document);
  }
}
