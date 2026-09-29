import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import { gsap } from 'gsap';

import { PLACES } from '../../data/places';
import { IPlace } from '../../core/models/place';

@Component({
  selector: 'app-place-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './place-layout.component.html',
  styleUrl: './place-layout.component.css',
})
export class PlaceLayoutComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  readonly places: IPlace[] = PLACES;

  currentSlug = '';

  isOpen = false;

  activeIndex = 0;

  private wheelLocked = false;

  private routeSubscription?: {
    unsubscribe: () => void;
  };

  ngAfterViewInit(): void {
    this.routeSubscription = this.route.firstChild?.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      this.currentSlug = slug ?? '';

      const index = this.places.findIndex((place) => place.slug === slug);

      if (index >= 0) {
        this.activeIndex = index;
      }

      if (this.isOpen) {
        requestAnimationFrame(() => {
          this.updateItems();
        });
      }
    });
  }

  openPlaces(): void {
    this.isOpen = true;

    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      this.updateItems();

      gsap.fromTo(
        '.place-picker',
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
        },
      );

      gsap.fromTo(
        '.place-picker-panel',
        {
          opacity: 0,
          scale: 0.96,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        },
      );
    });
  }

  closePlaces(): void {
    gsap.to('.place-picker-panel', {
      opacity: 0,
      scale: 0.96,
      y: 20,
      duration: 0.35,
      ease: 'power2.in',
    });

    gsap.to('.place-picker', {
      opacity: 0,
      duration: 0.4,
      delay: 0.05,
      onComplete: () => {
        this.isOpen = false;

        document.body.style.overflow = '';
      },
    });
  }

  nextPlace(): void {
    if (this.activeIndex >= this.places.length - 1) {
      this.activeIndex = 0;
    } else {
      this.activeIndex++;
    }

    this.updateItems();
  }

  previousPlace(): void {
    if (this.activeIndex <= 0) {
      this.activeIndex = this.places.length - 1;
    } else {
      this.activeIndex--;
    }

    this.updateItems();
  }

  selectPlace(index: number): void {
    if (index === this.activeIndex) {
      this.closePlaces();
      return;
    }

    this.activeIndex = index;

    window.location.assign(`/place/${PLACES[index].slug}`);

    this.updateItems();
  }

  private updateItems(): void {
    const items = this.elementRef.nativeElement.querySelectorAll('.place-picker-item');

    items.forEach((item: HTMLElement, index: number) => {
      const distance = this.getCircularDistance(index, this.activeIndex, this.places.length);

      const direction = this.getCircularDirection(index, this.activeIndex, this.places.length);

      const position = distance * direction;

      /*
       * Vị trí theo trục Y.
       *
       * Item ở giữa:
       * position = 0
       *
       * Item phía trên:
       * position < 0
       *
       * Item phía dưới:
       * position > 0
       */
      const y = position * 145;

      /*
       * Scale:
       *
       * 0  -> 1
       * 1  -> 0.78
       * 2  -> 0.58
       * 3  -> 0.4
       */
      const scale = Math.max(0.38, 1 - distance * 0.18);

      /*
       * Opacity
       */
      const opacity = Math.max(0.08, 1 - distance * 0.25);

      /*
       * Blur
       */
      const blur = distance * 1.8;

      /*
       * X tạo cảm giác perspective
       */
      const x = Math.abs(position) * 8;

      /*
       * Rotation nhẹ theo chiều
       */
      const rotateX = position * -8;

      /*
       * Z-index
       */
      const zIndex = 100 - distance;

      gsap.to(item, {
        y,
        x,
        scale,
        opacity,
        rotateX,
        filter: `blur(${blur}px)`,
        zIndex,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: true,
      });
    });
  }

  private getCircularDistance(index: number, active: number, length: number): number {
    const direct = Math.abs(index - active);

    const wrapped = length - direct;

    return Math.min(direct, wrapped);
  }

  private getCircularDirection(index: number, active: number, length: number): number {
    if (index === active) {
      return 0;
    }

    const direct = index - active;

    const wrapped = direct > 0 ? direct - length : direct + length;

    return Math.abs(direct) <= Math.abs(wrapped) ? Math.sign(direct) : Math.sign(wrapped);
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (!this.isOpen) {
      return;
    }

    event.preventDefault();

    if (this.wheelLocked) {
      return;
    }

    this.wheelLocked = true;

    if (event.deltaY > 0) {
      this.nextPlace();
    } else {
      this.previousPlace();
    }

    setTimeout(() => {
      this.wheelLocked = false;
    }, 500);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      this.closePlaces();
    }

    if (event.key === 'ArrowDown') {
      this.nextPlace();
    }

    if (event.key === 'ArrowUp') {
      this.previousPlace();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();

    document.body.style.overflow = '';

    gsap.killTweensOf('.place-picker');
    gsap.killTweensOf('.place-picker-panel');
    gsap.killTweensOf('.place-picker-item');
  }
}
