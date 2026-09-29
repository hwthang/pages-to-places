import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { PLACES } from '../../data/places';
import { IPlace } from '../../core/models/place';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-place',
  standalone: true,
  templateUrl: './place.html',
  styleUrl: './place.css',
})
export class Place implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  activeImageIndex = 0;

  private carouselInterval?: ReturnType<typeof setInterval>;

  private carouselAnimation?: gsap.core.Tween;

  private startCarousel(): void {
    this.stopCarousel();

    if (!this.place()?.images?.length) {
      return;
    }

    this.carouselInterval = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  private stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = undefined;
    }
  }

  nextImage(): void {
    const images = this.place()?.images;

    if (!images?.length) {
      return;
    }

    const nextIndex = (this.activeImageIndex + 1) % images.length;

    this.goToImage(nextIndex);
  }

  previousImage(): void {
    const images = this.place()?.images;

    if (!images?.length) {
      return;
    }

    const previousIndex = this.activeImageIndex === 0 ? images.length - 1 : this.activeImageIndex - 1;

    this.goToImage(previousIndex);
  }

  goToImage(index: number): void {
    const images = this.place()?.images;

    if (!images?.length) {
      return;
    }

    if (index === this.activeImageIndex) {
      return;
    }

    this.activeImageIndex = index;

    requestAnimationFrame(() => {
  this.animateCarousel();
  this.startCarousel();
    });

    this.startCarousel();
  }

  private animateCarousel(): void {
    const root = this.elementRef.nativeElement;

    const slides = root.querySelectorAll('.carousel-slide');

    slides.forEach((slide: any, index: any) => {
      if (index === this.activeImageIndex) {
        gsap.fromTo(
          slide,
          {
            opacity: 0,
            scale: 1.08,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
          },
        );
      } else {
        gsap.set(slide, {
          opacity: 0,
        });
      }
    });
  }

  readonly place = signal<IPlace | null>(null);

  private routeSubscription?: {
    unsubscribe: () => void;
  };

  ngAfterViewInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      console.log('-----------------------------');
      console.log('[PLACE] slug:', slug);

      if (!slug) {
        this.place.set(null);
        return;
      }

      const foundPlace = PLACES.find((item) => item.slug === slug);

      console.log('[PLACE] found:', foundPlace);

      if (!foundPlace) {
        this.place.set(null);
        return;
      }

      /*
       * Signal cập nhật UI
       */
      this.place.set(foundPlace);

      /*
       * Ép Angular render ngay
       */
      this.cdr.detectChanges();

      console.log('[PLACE] signal:', this.place());

      /*
       * Lúc này DOM đã có data
       */
      requestAnimationFrame(() => {
        this.refreshAnimations();
      });
    });
  }

  private refreshAnimations(): void {
    const currentPlace = this.place();

    if (!currentPlace) {
      return;
    }

    console.log('[PLACE] init animation:', currentPlace.name);

    /*
     * Kill animation cũ
     */
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });

    gsap.killTweensOf(this.elementRef.nativeElement);

    const root = this.elementRef.nativeElement;

    /*
     * HERO
     */

    const heroContent = root.querySelector('.hero-content');

    const heroImage = root.querySelector('.hero-image');

    if (heroContent) {
      gsap.fromTo(
        heroContent,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        },
      );
    }

    if (heroImage) {
      gsap.fromTo(
        heroImage,
        {
          opacity: 0,
          scale: 1.1,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
        },
      );
    }

    /*
     * CONTENT
     */

    const sections = root.querySelectorAll('.content-section');

    sections.forEach((section: any) => {
      const image = section.querySelector('.content-image');

      const text = section.querySelector('.content-text');

      if (image) {
        gsap.from(image, {
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 30%',
            scrub: 1,
          },

          opacity: 0,
          scale: 0.85,
          y: 80,
        });
      }

      if (text) {
        gsap.from(text, {
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 1,
          },

          opacity: 0,
          y: 100,
        });
      }
    });

    /*
     * REFERENCE
     */

    const reference = root.querySelector('.reference');

    if (reference) {
      gsap.from(reference, {
        scrollTrigger: {
          trigger: reference,
          start: 'top 80%',
        },

        opacity: 0,
        y: 60,

        duration: 1,

        ease: 'power3.out',
      });
    }

    ScrollTrigger.refresh();
  }

ngOnDestroy(): void {
  this.stopCarousel();

  this.routeSubscription?.unsubscribe();

  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });

  gsap.killTweensOf(this.elementRef.nativeElement);
}
}
