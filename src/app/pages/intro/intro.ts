import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-intro',
  standalone: true,
  templateUrl: './intro.html',
  styleUrl: './intro.css',
})
export class Intro implements AfterViewInit, OnDestroy {

  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  private redirectTimer?: ReturnType<typeof setTimeout>;

  private heartbeat?: gsap.core.Timeline;
  private progress?: gsap.core.Tween;

  ngAfterViewInit(): void {
    this.initAnimation();
  }


  private initAnimation(): void {

    const root = this.elementRef.nativeElement;

    const logoCircle =
      root.querySelector('.logo-circle');

    const logo =
      root.querySelector('.intro-logo');

    const ring =
      root.querySelector('.logo-ring');

    const ripples =
      root.querySelectorAll('.ripple');

    const progressBar =
      root.querySelector('.intro-progress-bar');

    const progressText =
      root.querySelector('.intro-progress-text');


    if (
      !logoCircle ||
      !logo ||
      !ring ||
      !progressBar
    ) {
      return;
    }


    /*
     * =========================================
     * INITIAL STATE
     * =========================================
     */

    gsap.set(logoCircle, {
      scale: 0.75,
      opacity: 0,
    });

    gsap.set(logo, {
      scale: 0.9,
      opacity: 0,
    });

    gsap.set(ring, {
      scale: 0.75,
      opacity: 0,
    });

    gsap.set(ripples, {
      scale: 0.8,
      opacity: 0,
    });


    /*
     * =========================================
     * LOGO APPEAR
     * =========================================
     */

    const intro = gsap.timeline();

    intro
      .to(logoCircle, {
        scale: 1,
        opacity: 1,

        duration: 0.9,

        ease: 'back.out(1.7)',
      })

      .to(
        logo,
        {
          scale: 1,
          opacity: 1,

          duration: 0.7,

          ease: 'power3.out',
        },
        '-=0.5'
      )

      .to(
        ring,
        {
          scale: 1,
          opacity: 1,

          duration: 0.8,

          ease: 'power2.out',
        },
        '-=0.5'
      );


    /*
     * =========================================
     * HEARTBEAT
     * =========================================
     *
     * Nhịp:
     *
     *      1.00
     *        ↓
     *      1.10  ← beat
     *        ↓
     *      1.00
     *        ↓
     *      1.06  ← second beat
     *        ↓
     *      1.00
     *
     */

    this.heartbeat =
      gsap.timeline({
        repeat: -1,
        repeatDelay: 1.25,
        delay: 1.8,
      });


    this.heartbeat

      // Beat 1
      .to(logoCircle, {
        scale: 1.09,
        duration: 0.16,
        ease: 'power2.out',
      })

      .to(logo, {
        scale: 1.07,
        duration: 0.16,
        ease: 'power2.out',
      }, '<')

      .to(logoCircle, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.inOut',
      })

      .to(logo, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.inOut',
      }, '<')

      // Beat 2
      .to(logoCircle, {
        scale: 1.055,
        duration: 0.12,
        ease: 'power2.out',
      })

      .to(logo, {
        scale: 1.045,
        duration: 0.12,
        ease: 'power2.out',
      }, '<')

      .to(logoCircle, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      })

      .to(logo, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      }, '<');


    /*
     * =========================================
     * RIPPLE EFFECT
     * =========================================
     */

    ripples.forEach(
      (ripple: HTMLElement, index: number) => {

        gsap.to(ripple, {

          scale: 1.8 + index * 0.25,

          opacity: 0,

          duration: 1.8,

          delay:
            2.1 + index * 0.22,

          repeat: -1,

          repeatDelay: 1.25,

          ease: 'power2.out',

          onStart: () => {

            gsap.set(ripple, {
              scale: 1,
              opacity:
                0.32 -
                index * 0.07,
            });

          },

        });

      }
    );


    /*
     * =========================================
     * RING PULSE
     * =========================================
     */

    gsap.to(ring, {

      scale: 1.08,

      opacity: 0.55,

      duration: 0.55,

      repeat: -1,

      yoyo: true,

      repeatDelay: 1.15,

      ease: 'power2.inOut',

      delay: 2,

    });


    /*
     * =========================================
     * PROGRESS 0 → 100
     *
     * Chính xác 7 giây
     * =========================================
     */

    this.progress = gsap.to(progressBar, {

      scaleX: 1,

      duration: 7,

      ease: 'none',

      onUpdate: () => {

        if (!progressText) {
          return;
        }

        const value =
          Math.round(
            (gsap.getProperty(
              progressBar,
              'scaleX'
            ) as number) * 100
          );

        progressText.textContent =
          `${value
            .toString()
            .padStart(2, '0')}%`;
      },

      onComplete: () => {

        if (progressText) {
          progressText.textContent =
            '100%';
        }

      },

    });


    /*
     * =========================================
     * REDIRECT
     *
     * 7s loading
     * + 1s hold
     * = 8s
     * =========================================
     */

    this.redirectTimer =
      setTimeout(() => {

        this.exitIntro();

      }, 8000);
  }


  /*
   * =========================================
   * EXIT
   * =========================================
   */

  private exitIntro(): void {

    const root =
      this.elementRef.nativeElement;

    const content =
      root.querySelector('.intro-content');

    const footer =
      root.querySelector('.intro-footer');


    gsap.timeline({

      onComplete: () => {

        this.router.navigate([
          '/home',
        ]);

      },

    })

      .to(
        content,
        {
          scale: 1.08,
          opacity: 0,

          duration: 0.5,

          ease: 'power2.in',
        }
      )

      .to(
        footer,
        {
          opacity: 0,

          duration: 0.25,
        },
        '<'
      );
  }


  ngOnDestroy(): void {

    if (this.redirectTimer) {
      clearTimeout(
        this.redirectTimer
      );
    }

    this.heartbeat?.kill();

    this.progress?.kill();

    gsap.killTweensOf(
      this.elementRef.nativeElement
    );
  }
}