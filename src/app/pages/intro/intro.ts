import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';

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

  private bubbleAnimations: gsap.core.Tween[] = [];

  private stainAnimations: gsap.core.Tween[] = [];

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  private initAnimation(): void {
    const root = this.elementRef.nativeElement;

    const logoCircle = root.querySelector('.logo-circle');

    const logo = root.querySelector('.intro-logo');

    const ring = root.querySelector('.logo-ring');

    const ripples = root.querySelectorAll('.ripple');

    const bubbles = root.querySelectorAll('.bubble');

    const stains = root.querySelectorAll('.stain');

    const progressBar = root.querySelector('.intro-progress-bar');

    const progressText = root.querySelector('.intro-progress-text');

    if (!logoCircle || !logo || !ring || !progressBar) {
      return;
    }

    /* =========================================
       INITIAL STATE
    ========================================= */

    gsap.set(logoCircle, {
      scale: 0.72,
      opacity: 0,
    });

    gsap.set(logo, {
      scale: 0.82,
      opacity: 0,
    });

    gsap.set(ring, {
      scale: 0.7,
      opacity: 0,
    });

    gsap.set(ripples, {
      scale: 0.75,
      opacity: 0,
    });

    gsap.set(bubbles, {
      scale: 0.3,
      opacity: 0,
    });

    gsap.set(stains, {
      scale: 0.7,
      opacity: 0,
    });

    /* =========================================
       LOGO APPEAR
    ========================================= */

    const intro = gsap.timeline();

    intro
      .to(logoCircle, {
        scale: 1,
        opacity: 1,

        duration: 1.1,

        ease: 'back.out(1.7)',
      })

      .to(
        logo,
        {
          scale: 1,
          opacity: 1,

          duration: 0.9,

          ease: 'power3.out',
        },
        '-=0.65',
      )

      .to(
        ring,
        {
          scale: 1,
          opacity: 1,

          duration: 0.9,

          ease: 'power2.out',
        },
        '-=0.6',
      );

    /* =========================================
       ORGANIC STAINS
    ========================================= */

    stains.forEach((stain: any, index: any) => {
      gsap.to(stain, {
        scale: 1.05 + index * 0.08,

        opacity: 0.22 + index * 0.04,

        duration: 1.8 + index * 0.25,

        delay: index * 0.2,

        ease: 'power2.out',
      });

      const animation = gsap.to(stain, {
        x: index % 2 === 0 ? 35 : -35,

        y: index % 2 === 0 ? -25 : 25,

        rotation: index % 2 === 0 ? 8 : -8,

        duration: 5 + index * 0.8,

        repeat: -1,

        yoyo: true,

        ease: 'sine.inOut',
      });

      this.stainAnimations.push(animation);
    });

    /* =========================================
       HEARTBEAT
    ========================================= */

    this.heartbeat = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.25,
      delay: 1.8,
    });

    this.heartbeat

      .to(logoCircle, {
        scale: 1.09,
        duration: 0.16,
        ease: 'power2.out',
      })

      .to(
        logo,
        {
          scale: 1.07,
          duration: 0.16,
          ease: 'power2.out',
        },
        '<',
      )

      .to(logoCircle, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.inOut',
      })

      .to(
        logo,
        {
          scale: 1,
          duration: 0.2,
          ease: 'power2.inOut',
        },
        '<',
      )

      .to(logoCircle, {
        scale: 1.055,
        duration: 0.12,
        ease: 'power2.out',
      })

      .to(
        logo,
        {
          scale: 1.045,
          duration: 0.12,
          ease: 'power2.out',
        },
        '<',
      )

      .to(logoCircle, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      })

      .to(
        logo,
        {
          scale: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '<',
      );

    /* =========================================
       RIPPLE
    ========================================= */

    ripples.forEach((ripple: any, index: any) => {
      gsap.to(ripple, {
        scale: 1.65 + index * 0.35,

        opacity: 0,

        duration: 2.4 + index * 0.25,

        delay: 1.8 + index * 0.3,

        repeat: -1,

        repeatDelay: 1.15,

        ease: 'power2.out',

        onStart: () => {
          gsap.set(ripple, {
            scale: 1,

            opacity: 0.42 - index * 0.07,
          });
        },
      });
    });

    /* =========================================
       RING PULSE
    ========================================= */

    gsap.to(ring, {
      scale: 1.08,

      opacity: 0.55,

      duration: 0.65,

      repeat: -1,

      yoyo: true,

      repeatDelay: 1.1,

      ease: 'power2.inOut',

      delay: 2,
    });

    /* =========================================
       FLOATING BUBBLES
    ========================================= */

    bubbles.forEach((bubble: any, index: any) => {
      const direction = index % 2 === 0 ? 1 : -1;

      /*
       * Bubble xuất hiện rõ
       */

      gsap.to(bubble, {
        opacity: 0.68 + (index % 4) * 0.07,

        scale: 1,

        duration: 1.1,

        delay: 0.8 + index * 0.1,

        ease: 'back.out(1.5)',
      });

      /*
       * Bay theo chiều dọc
       */

      const floatAnimation = gsap.to(bubble, {
        x: direction * (20 + (index % 4) * 12),

        y: -(35 + (index % 5) * 14),

        rotation: direction * (8 + index * 2),

        duration: 3.5 + (index % 5) * 0.6,

        repeat: -1,

        yoyo: true,

        ease: 'sine.inOut',

        delay: index * 0.15,
      });

      this.bubbleAnimations.push(floatAnimation);

      /*
       * Co giãn nhẹ
       */

      const breathing = gsap.to(bubble, {
        scale: 0.82 + (index % 3) * 0.12,

        duration: 2.2 + (index % 4) * 0.4,

        repeat: -1,

        yoyo: true,

        ease: 'sine.inOut',

        delay: index * 0.18,
      });

      this.bubbleAnimations.push(breathing);
    });

    /* =========================================
       PROGRESS 0 → 100
       7 SECONDS
    ========================================= */

    this.progress = gsap.to(progressBar, {
      scaleX: 1,

      duration: 7,

      ease: 'none',

      onUpdate: () => {
        if (!progressText) {
          return;
        }

        const value = Math.round((gsap.getProperty(progressBar, 'scaleX') as number) * 100);

        progressText.textContent = `${value.toString().padStart(2, '0')}%`;
      },

      onComplete: () => {
        if (progressText) {
          progressText.textContent = '100%';
        }
      },
    });

    /* =========================================
       REDIRECT
       7s + 1s HOLD
    ========================================= */

    this.redirectTimer = setTimeout(() => {
      this.exitIntro();
    }, 8000);
  }

  /* =========================================
     EXIT
  ========================================= */

  private exitIntro(): void {
    const root = this.elementRef.nativeElement;

    const content = root.querySelector('.intro-content');

    const footer = root.querySelector('.intro-footer');

    gsap
      .timeline({
        onComplete: () => {
          this.router.navigate(['/home']);
        },
      })

      .to(content, {
        scale: 1.08,
        opacity: 0,

        duration: 0.5,

        ease: 'power2.in',
      })

      .to(
        footer,
        {
          opacity: 0,

          duration: 0.25,
        },
        '<',
      );
  }

  /* =========================================
     DESTROY
  ========================================= */

  ngOnDestroy(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }

    this.heartbeat?.kill();

    this.progress?.kill();

    this.bubbleAnimations.forEach((animation) => animation.kill());

    this.stainAnimations.forEach((animation) => animation.kill());

    gsap.killTweensOf(this.elementRef.nativeElement);
  }
}
