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

  /*
   * Chống wheel / swipe liên tục
   */
  private navigationLocked = false;

  /*
   * Touch
   */
  private touchStartY = 0;

  private touchStartX = 0;

  private touchStartTime = 0;

  /*
   * Ngưỡng swipe
   */
  private readonly swipeThreshold = 45;

  /*
   * Khoảng thời gian tối thiểu
   * giữa 2 lần chuyển item
   */
  private readonly navigationLockDuration = 500;

  /*
   * Subscription route
   */
  private routeSubscription?: {
    unsubscribe: () => void;
  };

  /*
   * Lưu overflow body trước khi mở picker
   */
  private previousBodyOverflow = '';

  /*
   * =========================================
   * LIFECYCLE
   * =========================================
   */

  ngAfterViewInit(): void {
    this.routeSubscription = this.route.firstChild?.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      this.currentSlug = slug ?? '';

      const index = this.places.findIndex((place) => place.slug === slug);

      if (index >= 0) {
        this.activeIndex = index;
      }

      /*
       * Route thay đổi khi picker đang mở.
       * Cập nhật lại vị trí carousel.
       */
      if (this.isOpen) {
        requestAnimationFrame(() => {
          this.updateItems();
        });
      }
    });
  }

  /*
   * =========================================
   * FORMAT
   * =========================================
   */

  formatNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }

  /*
   * =========================================
   * OPEN
   * =========================================
   */

  openPlaces(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    /*
     * Lưu trạng thái overflow hiện tại
     */
    this.previousBodyOverflow = document.body.style.overflow;

    /*
     * Khóa scroll background
     */
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      const picker = this.elementRef.nativeElement.querySelector('.place-picker');

      if (picker) {
        picker.focus();
      }

      this.updateItems();

      this.animateOpen();
    });
  }

  /*
   * =========================================
   * CLOSE
   * =========================================
   */

  closePlaces(): void {
    if (!this.isOpen) {
      return;
    }

    const panel = this.elementRef.nativeElement.querySelector('.place-picker-panel');

    const picker = this.elementRef.nativeElement.querySelector('.place-picker');

    /*
     * Không có DOM thì đóng ngay
     */
    if (!panel || !picker) {
      this.finishClose();

      return;
    }

    gsap.to(panel, {
      opacity: 0,

      scale: 0.96,

      y: 20,

      duration: 0.35,

      ease: 'power2.in',
    });

    gsap.to(picker, {
      opacity: 0,

      duration: 0.4,

      delay: 0.05,

      ease: 'power2.in',

      onComplete: () => {
        this.finishClose();
      },
    });
  }

  private finishClose(): void {
    this.isOpen = false;

    /*
     * Khôi phục scroll body
     */
    document.body.style.overflow = this.previousBodyOverflow;

    /*
     * Reset lock
     */
    this.navigationLocked = false;
  }

  /*
   * =========================================
   * OPEN ANIMATION
   * =========================================
   */

  private animateOpen(): void {
    const picker = this.elementRef.nativeElement.querySelector('.place-picker');

    const panel = this.elementRef.nativeElement.querySelector('.place-picker-panel');

    if (!picker || !panel) {
      return;
    }

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

  /*
   * =========================================
   * NAVIGATION
   * =========================================
   */

  nextPlace(): void {
    if (this.navigationLocked) {
      return;
    }

    if (!this.places.length) {
      return;
    }

    this.navigationLocked = true;

    if (this.activeIndex >= this.places.length - 1) {
      this.activeIndex = 0;
    } else {
      this.activeIndex++;
    }

    this.updateItems();

    this.releaseNavigationLock();
  }

  previousPlace(): void {
    if (this.navigationLocked) {
      return;
    }

    if (!this.places.length) {
      return;
    }

    this.navigationLocked = true;

    if (this.activeIndex <= 0) {
      this.activeIndex = this.places.length - 1;
    } else {
      this.activeIndex--;
    }

    this.updateItems();

    this.releaseNavigationLock();
  }

  private releaseNavigationLock(): void {
    window.setTimeout(() => {
      this.navigationLocked = false;
    }, this.navigationLockDuration);
  }

  /*
   * =========================================
   * SELECT
   * =========================================
   */

  selectPlace(index: number): void {
    if (index < 0 || index >= this.places.length) {
      return;
    }

    const selectedPlace = this.places[index];

    if (!selectedPlace) {
      return;
    }

    this.activeIndex = index;

    /*
     * Cập nhật animation trước
     */
    this.updateItems();

    /*
     * Đóng picker
     */
    this.closePlaces();

    /*
     * Navigate Angular.
     *
     * Không dùng window.location.assign()
     * để tránh reload toàn bộ website.
     */
    window.location.assign(`/place/${selectedPlace.slug}`);
  }

  /*
   * =========================================
   * GSAP CAROUSEL
   * =========================================
   */

  private updateItems(): void {
    const root = this.elementRef.nativeElement;

    const items = root.querySelectorAll('.place-picker-item');

    if (!items.length) {
      return;
    }

    items.forEach((item: HTMLElement, index: number) => {
      const distance = this.getCircularDistance(index, this.activeIndex, this.places.length);

      const direction = this.getCircularDirection(index, this.activeIndex, this.places.length);

      const position = distance * direction;

      /*
       * Y
       */
      const y = position * 145;

      /*
       * Scale
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
       * Perspective
       */
      const x = Math.abs(position) * 8;

      /*
       * Rotation
       */
      const rotateX = position * -8;

      /*
       * Layer
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

  /*
   * =========================================
   * CIRCULAR POSITION
   * =========================================
   */

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

  /*
   * =========================================
   * BACKDROP
   * =========================================
   */

  onPickerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    /*
     * Chỉ xử lý click trực tiếp
     * vào container.
     *
     * Không ảnh hưởng click item/button.
     */
    if (target.classList.contains('place-picker')) {
      this.closePlaces();
    }
  }

  /*
   * =========================================
   * MOUSE WHEEL
   * =========================================
   */

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (!this.isOpen) {
      return;
    }

    /*
     * Không gọi preventDefault().
     *
     * Tránh lỗi:
     *
     * Unable to preventDefault inside
     * passive event listener
     *
     * Body đã bị overflow:hidden,
     * picker cũng dùng touch-action:none.
     */

    if (Math.abs(event.deltaY) < 10) {
      return;
    }

    if (event.deltaY > 0) {
      this.nextPlace();
    } else {
      this.previousPlace();
    }
  }

  /*
   * =========================================
   * TOUCH START
   * =========================================
   */

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!this.isOpen) {
      return;
    }

    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    this.touchStartY = touch.clientY;

    this.touchStartX = touch.clientX;

    this.touchStartTime = Date.now();
  }

  /*
   * =========================================
   * TOUCH END
   * =========================================
   */

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.isOpen) {
      return;
    }

    const touch = event.changedTouches[0];

    if (!touch) {
      return;
    }

    const deltaY = this.touchStartY - touch.clientY;

    const deltaX = this.touchStartX - touch.clientX;

    const duration = Date.now() - this.touchStartTime;

    /*
     * Nếu kéo ngang nhiều hơn kéo dọc
     * thì bỏ qua.
     */
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return;
    }

    /*
     * Swipe quá nhanh / quá nhỏ
     */
    if (Math.abs(deltaY) < this.swipeThreshold) {
      return;
    }

    /*
     * Tránh gesture quá dài
     */
    if (duration > 1200) {
      return;
    }

    if (deltaY > 0) {
      /*
       * Vuốt lên
       */
      this.nextPlace();
    } else {
      /*
       * Vuốt xuống
       */
      this.previousPlace();
    }
  }

  /*
   * =========================================
   * KEYBOARD
   * =========================================
   */

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();

        this.closePlaces();

        break;

      case 'ArrowDown':

      case 'PageDown':
        event.preventDefault();

        this.nextPlace();

        break;

      case 'ArrowUp':

      case 'PageUp':
        event.preventDefault();

        this.previousPlace();

        break;

      case 'Home':
        event.preventDefault();

        this.activeIndex = 0;

        this.updateItems();

        break;

      case 'End':
        event.preventDefault();

        this.activeIndex = this.places.length - 1;

        this.updateItems();

        break;
    }
  }

  /*
   * =========================================
   * DESTROY
   * =========================================
   */

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();

    /*
     * Khôi phục scroll
     */
    document.body.style.overflow = this.previousBodyOverflow || '';

    /*
     * Kill animation
     */
    const root = this.elementRef.nativeElement;

    gsap.killTweensOf(root.querySelector('.place-picker'));

    gsap.killTweensOf(root.querySelector('.place-picker-panel'));

    gsap.killTweensOf(root.querySelectorAll('.place-picker-item'));
  }
}
