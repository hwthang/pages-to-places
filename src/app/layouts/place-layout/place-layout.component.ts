import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

import { Subscription } from 'rxjs';

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
export class PlaceLayoutComponent
  implements AfterViewInit, OnDestroy
{
  private readonly elementRef = inject(ElementRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly places: IPlace[] = PLACES;

  currentSlug = '';

  isOpen = false;

  activeIndex = 0;

  private wheelLocked = false;

  private wheelTimeout?: ReturnType<typeof setTimeout>;

  private routeSubscription?: Subscription;


  // =========================================================
  // INIT
  // =========================================================

  ngAfterViewInit(): void {
    this.subscribeToRoute();
  }


  // =========================================================
  // ROUTE
  // =========================================================

  private subscribeToRoute(): void {
    /*
     * Lắng nghe :slug của route con.
     *
     * Khi chuyển:
     *
     * /place/eiffel-tower
     *        ↓
     * /place/bercy-park
     *
     * PlaceLayoutComponent có thể được Angular reuse,
     * vì vậy cần subscribe thay vì chỉ dùng snapshot.
     */

    this.routeSubscription =
      this.route.firstChild?.paramMap.subscribe((params) => {
        const slug = params.get('slug');

        if (!slug) {
          return;
        }

        this.currentSlug = slug;

        const index = this.places.findIndex(
          (place) => place.slug === slug,
        );

        if (index === -1) {
          console.warn(
            '[PlaceLayout] Không tìm thấy place:',
            slug,
          );

          return;
        }

        /*
         * Đồng bộ navigation với URL.
         */
        this.activeIndex = index;

        console.log(
          '[PlaceLayout] Current place:',
          this.places[index],
        );

        /*
         * Đợi Angular render lại item
         * rồi mới chạy animation.
         */
        requestAnimationFrame(() => {
          if (this.isOpen) {
            this.updateItems();
          }
        });
      });
  }


  // =========================================================
  // OPEN
  // =========================================================

  openPlaces(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      this.updateItems();

      const picker =
        this.elementRef.nativeElement.querySelector(
          '.place-picker',
        );

      const panel =
        this.elementRef.nativeElement.querySelector(
          '.place-picker-panel',
        );

      if (picker) {
        gsap.fromTo(
          picker,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
        );
      }

      if (panel) {
        gsap.fromTo(
          panel,
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
      }
    });
  }


  // =========================================================
  // CLOSE
  // =========================================================

  closePlaces(): void {
    if (!this.isOpen) {
      return;
    }

    const picker =
      this.elementRef.nativeElement.querySelector(
        '.place-picker',
      );

    const panel =
      this.elementRef.nativeElement.querySelector(
        '.place-picker-panel',
      );

    const timeline = gsap.timeline({
      onComplete: () => {
        this.isOpen = false;

        document.body.style.overflow = '';
      },
    });

    if (panel) {
      timeline.to(
        panel,
        {
          opacity: 0,
          scale: 0.96,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
        },
      );
    }

    if (picker) {
      timeline.to(
        picker,
        {
          opacity: 0,
          duration: 0.25,
        },
        '<',
      );
    }
  }


  // =========================================================
  // SELECT PLACE
  // =========================================================

selectPlace(index: number): void {
  const place = this.places[index];

  if (!place) {
    return;
  }

  // So với slug THẬT của route hiện tại, không phải activeIndex
  // (activeIndex có thể đã bị nextPlace()/previousPlace() đổi khi user
  // lăn chuột/bấm phím preview, mà chưa hề navigate).
  if (place.slug === this.currentSlug) {
    this.closePlaces();
    return;
  }

  this.activeIndex = index;

  this.closePlaces();

  this.router.navigate(['/place', place.slug]);
}


  // =========================================================
  // NEXT
  // =========================================================

  nextPlace(): void {
    if (!this.places.length) {
      return;
    }

    if (
      this.activeIndex >=
      this.places.length - 1
    ) {
      this.activeIndex = 0;
    } else {
      this.activeIndex++;
    }

    this.updateItems();
  }


  // =========================================================
  // PREVIOUS
  // =========================================================

  previousPlace(): void {
    if (!this.places.length) {
      return;
    }

    if (this.activeIndex <= 0) {
      this.activeIndex =
        this.places.length - 1;
    } else {
      this.activeIndex--;
    }

    this.updateItems();
  }


  // =========================================================
  // UPDATE CAROUSEL
  // =========================================================

  private updateItems(): void {
    const items =
      this.elementRef.nativeElement.querySelectorAll(
        '.place-picker-item',
      );

    if (!items.length) {
      return;
    }

    items.forEach(
      (item: HTMLElement, index: number) => {
        const distance =
          this.getCircularDistance(
            index,
            this.activeIndex,
            this.places.length,
          );

        const direction =
          this.getCircularDirection(
            index,
            this.activeIndex,
            this.places.length,
          );

        const position =
          distance * direction;


        /*
         * =====================================
         * Y POSITION
         * =====================================
         */

        const y =
          position * 145;


        /*
         * =====================================
         * SCALE
         *
         * Center: 1
         * Near:   0.82
         * Far:    0.64
         * ...
         * =====================================
         */

        const scale =
          Math.max(
            0.38,
            1 - distance * 0.18,
          );


        /*
         * =====================================
         * OPACITY
         * =====================================
         */

        const opacity =
          Math.max(
            0.08,
            1 - distance * 0.25,
          );


        /*
         * =====================================
         * BLUR
         * =====================================
         */

        const blur =
          distance * 1.8;


        /*
         * =====================================
         * X
         * =====================================
         */

        const x =
          Math.abs(position) * 8;


        /*
         * =====================================
         * 3D ROTATION
         * =====================================
         */

        const rotateX =
          position * -8;


        /*
         * =====================================
         * Z INDEX
         * =====================================
         */

        const zIndex =
          100 - distance;


        gsap.to(item, {
          y,
          x,
          scale,
          opacity,
          rotateX,

          filter:
            `blur(${blur}px)`,

          zIndex,

          duration: 0.65,

          ease: 'power3.out',

          overwrite: true,
        });
      },
    );
  }


  // =========================================================
  // CIRCULAR DISTANCE
  // =========================================================

  private getCircularDistance(
    index: number,
    active: number,
    length: number,
  ): number {
    const direct =
      Math.abs(index - active);

    const wrapped =
      length - direct;

    return Math.min(
      direct,
      wrapped,
    );
  }


  // =========================================================
  // CIRCULAR DIRECTION
  // =========================================================

  private getCircularDirection(
    index: number,
    active: number,
    length: number,
  ): number {
    if (index === active) {
      return 0;
    }

    const direct =
      index - active;

    const wrapped =
      direct > 0
        ? direct - length
        : direct + length;

    return Math.abs(direct) <=
      Math.abs(wrapped)
      ? Math.sign(direct)
      : Math.sign(wrapped);
  }


  // =========================================================
  // MOUSE WHEEL
  // =========================================================

  @HostListener(
    'window:wheel',
    ['$event'],
  )
  onWheel(event: WheelEvent): void {
    if (!this.isOpen) {
      return;
    }

    /*
     * Không dùng preventDefault().
     *
     * Tránh:
     *
     * Unable to preventDefault inside
     * passive event listener
     */

    if (this.wheelLocked) {
      return;
    }

    /*
     * Bỏ qua wheel quá nhỏ.
     */
    if (
      Math.abs(event.deltaY) < 20
    ) {
      return;
    }

    this.wheelLocked = true;

    if (event.deltaY > 0) {
      this.nextPlace();
    } else {
      this.previousPlace();
    }

    this.wheelTimeout =
      setTimeout(() => {
        this.wheelLocked = false;
      }, 500);
  }


  // =========================================================
  // KEYBOARD
  // =========================================================

  @HostListener(
    'window:keydown',
    ['$event'],
  )
  onKeyDown(
    event: KeyboardEvent,
  ): void {
    if (!this.isOpen) {
      return;
    }

    switch (event.key) {

      case 'Escape':
        this.closePlaces();
        break;

      case 'ArrowDown':
        this.nextPlace();
        break;

      case 'ArrowUp':
        this.previousPlace();
        break;

    }
  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();

    if (this.wheelTimeout) {
      clearTimeout(
        this.wheelTimeout,
      );
    }

    document.body.style.overflow = '';

    gsap.killTweensOf(
      '.place-picker',
    );

    gsap.killTweensOf(
      '.place-picker-panel',
    );

    gsap.killTweensOf(
      '.place-picker-item',
    );
  }
}