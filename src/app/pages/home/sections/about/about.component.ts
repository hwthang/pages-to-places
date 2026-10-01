import {
  AfterViewInit,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';

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
  private readonly animationService = inject(AnimationService);

  private timeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  /**
   * Scroll đến CTA section.
   */
  scrollToBook(): void {
    this.animationService.scrollToId('book');
  }

  /**
   * Animation chính của About section.
   *
   * Flow:
   *
   * 01. Eyebrow xuất hiện
   * 02. Title xuất hiện từng từ
   * 03. Content xuất hiện sau khi title hoàn thành
   * 04. Logo xuất hiện sau content
   */
  private initAnimation(): void {
    const section = document.querySelector('#about');

    if (!section) {
      return;
    }

    const words = section.querySelectorAll('.title-word');
    const eyebrow = section.querySelector('.about-eyebrow');
    const info = section.querySelector('.about-info');
    const divider = section.querySelector('.about-divider');
    const descriptions = section.querySelectorAll('.about-description');
    const link = section.querySelector('.about-link');
    const logo = section.querySelector('.about-logo');

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        once: true,
      },
    });

    /* =====================================================
       01. EYEBROW
       ===================================================== */

    this.timeline.fromTo(
      eyebrow,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      },
    );

    /* =====================================================
       02. TITLE - TỪNG TỪ
       ===================================================== */

    this.timeline.to(
      words,
      {
        y: 0,
        opacity: 1,

        duration: 0.5,

        ease: 'power3.out',

        /*
         * Mỗi 0.14s xuất hiện một từ.
         */
        stagger: 0.14,
      },
      '-=0.2',
    );

    /* =====================================================
       03. CONTENT
       ===================================================== */

    this.timeline.fromTo(
      info,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      },
      '+=0.15',
    );

    /* =====================================================
       04. DIVIDER
       ===================================================== */

    this.timeline.fromTo(
      divider,
      {
        scaleX: 0,
      },
      {
        scaleX: 1,
        duration: 0.7,
        ease: 'power3.out',
      },
      '-=0.5',
    );

    /* =====================================================
       05. DESCRIPTION
       ===================================================== */

    this.timeline.fromTo(
      descriptions,
      {
        y: 25,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      },
      '-=0.35',
    );

    /* =====================================================
       06. CTA
       ===================================================== */

    this.timeline.fromTo(
      link,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.35',
    );

    /* =====================================================
       07. LOGO
       ===================================================== */

    this.timeline.fromTo(
      logo,
      {
        y: 70,
        opacity: 0,
        scale: 0.92,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.35',
    );
  }

  /**
   * Cleanup animation khi component bị destroy.
   */
  ngOnDestroy(): void {
    this.timeline?.kill();

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === document.querySelector('#about')) {
        trigger.kill();
      }
    });
  }
}