import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { IPlace } from '../../core/models/place';
import { NEW_PLACES } from '../../data/new-places';

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

  readonly place = signal<IPlace | null>(null);

  activeImageIndex = 0;

  private carouselInterval?: ReturnType<typeof setInterval>;
  private routeSubscription?: { unsubscribe: () => void };
  private ctx?: gsap.Context;

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngAfterViewInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.loadPlace(params.get('slug'));
    });
  }

  ngOnDestroy(): void {
    this.stopCarousel();
    this.routeSubscription?.unsubscribe();
    this.ctx?.revert();
  }

  // =========================================================
  // LOAD PLACE
  // =========================================================

  private loadPlace(slug: string | null): void {
    this.stopCarousel();
    this.ctx?.revert();

    this.activeImageIndex = 0;

    const foundPlace = NEW_PLACES.find(
      (place) => place.slug === slug,
    );

    this.place.set(foundPlace ?? null);

    if (!foundPlace) {
      return;
    }

    requestAnimationFrame(() => {
      this.initAnimations();
      this.startCarousel();
    });
  }

  // =========================================================
  // HERO CAROUSEL
  // =========================================================

  private startCarousel(): void {
    this.stopCarousel();

    const images = this.place()?.images;

    if (!images || images.length <= 1) {
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

  private nextImage(): void {
    const images = this.place()?.images;

    if (!images?.length) {
      return;
    }

    this.activeImageIndex =
      (this.activeImageIndex + 1) % images.length;

    this.animateCarousel();
  }

  private animateCarousel(): void {
    const slides =
      this.elementRef.nativeElement.querySelectorAll(
        '.carousel-slide',
      );

    slides.forEach((slide: HTMLElement, index: number) => {
      if (index === this.activeImageIndex) {
        gsap.fromTo(
          slide,
          {
            opacity: 0,
            scale: 1.06,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
          },
        );
      } else {
        gsap.to(slide, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });
  }

  // =========================================================
  // GSAP ANIMATIONS
  // =========================================================

  private initAnimations(): void {
    const root = this.elementRef.nativeElement;

    this.ctx = gsap.context(() => {
      // -------------------------------------------------------
      // HERO
      // -------------------------------------------------------

      gsap.from('.carousel-content', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from('.carousel-label', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.carousel-content h2', {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power4.out',
      });

      this.animateCarousel();

      // -------------------------------------------------------
      // CONTENT
      // -------------------------------------------------------

      const sections =
        root.querySelectorAll('.content-section');

      sections.forEach((section: Element) => {
        const image =
          section.querySelector('.content-image');

        const text =
          section.querySelector('.content-text');

        if (image) {
          gsap.fromTo(
            image,
            {
              opacity: 0,
              y: 80,
              scale: 0.92,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'top 35%',
                scrub: 1,
              },
            },
          );
        }

        if (text) {
          gsap.fromTo(
            text,
            {
              opacity: 0,
              y: 70,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'top 35%',
                scrub: 1,
              },
            },
          );
        }
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, root);
  }
}