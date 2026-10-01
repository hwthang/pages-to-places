import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { PLACES } from '../../data/places';
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
  private readonly cdr = inject(ChangeDetectorRef);

  // =========================================================
  // PLACE
  // =========================================================

  readonly place = signal<IPlace | null>(null);

  // =========================================================
  // IMAGE CAROUSEL
  // =========================================================

  activeImageIndex = 0;

  private carouselInterval?: ReturnType<typeof setInterval>;

  private routeSubscription?: {
    unsubscribe: () => void;
  };

  /*
   * Scope toàn bộ tween + ScrollTrigger được tạo ra trong `refreshAnimations()`
   * (và bất kỳ hàm nào chạy qua `runInContext()`).
   *
   * Lý do dùng gsap.context() thay vì tự gọi killTweensOf()/ScrollTrigger.getAll()
   * thủ công như trước: killTweensOf() chỉ DỪNG tween tại đúng vị trí đang chạy dở,
   * KHÔNG revert style — nếu component bị kill lúc `.content-image`/`.content-text`/
   * `.reference` đang ở giữa trạng thái `opacity:0` (do scrub chưa cuộn tới), giá trị
   * đó bị bỏ lại làm inline style. Lần load place tiếp theo, `gsap.from(el, {opacity:0})`
   * đọc style HIỆN TẠI của `el` làm điểm đích — thấy `opacity:0` đã có sẵn → tween chạy
   * "từ 0 tới 0" → phần tử vô hình vĩnh viễn dù cuộn thế nào.
   *
   * `ctx.revert()` dọn sạch TOÀN BỘ tween + ScrollTrigger được tạo trong context, đồng thời
   * trả style inline về đúng trạng thái trước khi context được tạo — không còn leftover.
   */
  private ctx?: gsap.Context;

  // =========================================================
  // INIT
  // =========================================================

  ngAfterViewInit(): void {
    this.routeSubscription =
      this.route.paramMap.subscribe((params) => {
        const slug = params.get('slug');

        console.log('==============================');
        console.log('[PLACE] slug:', slug);

        this.loadPlace(slug);
      });
  }

  // =========================================================
  // LOAD PLACE
  // =========================================================

  private loadPlace(slug: string | null): void {
    /*
     * Dừng carousel của place cũ.
     */
    this.stopCarousel();

    /*
     * Reset carousel.
     */
    this.activeImageIndex = 0;

    /*
     * Không có slug.
     */
    if (!slug) {
      this.place.set(null);
      return;
    }

    /*
     * Tìm place.
     */
    const foundPlace = NEW_PLACES.find(
      (item) => item.slug === slug,
    );

    console.log(
      '[PLACE] found:',
      foundPlace,
    );

    /*
     * Không tìm thấy.
     */
    if (!foundPlace) {
      this.place.set(null);
      return;
    }

    /*
     * Set data.
     */
    this.place.set(foundPlace);

    console.log(
      '[PLACE] data:',
      this.place(),
    );

    /*
     * Đảm bảo Angular render data mới.
     */
    this.cdr.detectChanges();

    /*
     * Chờ DOM render xong rồi mới chạy animation.
     */
    requestAnimationFrame(() => {
      this.refreshAnimations();

      /*
       * Start image carousel sau khi DOM đã tồn tại.
       */
      this.startCarousel();
    });
  }

  // =========================================================
  // IMAGE CAROUSEL
  // =========================================================

  private startCarousel(): void {
    this.stopCarousel();

    const images = this.place()?.images;

    /*
     * Không có ảnh hoặc chỉ có 1 ảnh
     * thì không cần carousel.
     */
    if (!images || images.length <= 1) {
      return;
    }

    this.carouselInterval =
      setInterval(() => {
        this.nextImage();
      }, 5000);
  }

  private stopCarousel(): void {
    if (!this.carouselInterval) {
      return;
    }

    clearInterval(
      this.carouselInterval,
    );

    this.carouselInterval = undefined;
  }

  // =========================================================
  // NEXT IMAGE
  // =========================================================

  nextImage(): void {
    const images = this.place()?.images;

    if (!images?.length) {
      return;
    }

    const nextIndex =
      (this.activeImageIndex + 1) %
      images.length;

    this.goToImage(nextIndex);
  }

  // =========================================================
  // PREVIOUS IMAGE
  // =========================================================

  previousImage(): void {
    const images = this.place()?.images;

    if (!images?.length) {
      return;
    }

    const previousIndex =
      this.activeImageIndex === 0
        ? images.length - 1
        : this.activeImageIndex - 1;

    this.goToImage(previousIndex);
  }

  // =========================================================
  // GO TO IMAGE
  // =========================================================

  goToImage(index: number): void {
    const images = this.place()?.images;

    if (!images?.length) {
      return;
    }

    if (
      index < 0 ||
      index >= images.length
    ) {
      return;
    }

    if (
      index === this.activeImageIndex
    ) {
      return;
    }

    this.activeImageIndex = index;

    requestAnimationFrame(() => {
      this.animateCarousel();
    });

    /*
     * Reset timer.
     *
     * Sau khi user chuyển ảnh,
     * 5 giây sau mới tự động chuyển tiếp.
     */
    this.startCarousel();
  }

  // =========================================================
  // RUN INSIDE CONTEXT
  // =========================================================

  /*
   * Chạy `fn` bên trong `this.ctx` (nếu context đã tồn tại) để mọi tween tạo ra bên trong
   * cũng được `ctx.revert()` dọn sạch cùng lúc với animation của `refreshAnimations()`.
   *
   * Cần thiết vì `animateCarousel()` còn được gọi độc lập từ `goToImage()` (user đổi ảnh
   * carousel), nằm NGOÀI closure của `gsap.context()` tạo trong `refreshAnimations()`.
   * `ctx.add()` là API chính thức của gsap.context() cho đúng trường hợp này — đăng ký
   * thêm 1 hàm để chạy "trong" context đã có, không tạo context mới.
   */
  private runInContext(fn: () => void): void {
    if (this.ctx) {
      this.ctx.add(fn);
    } else {
      fn();
    }
  }

  // =========================================================
  // CAROUSEL ANIMATION
  // =========================================================

  private animateCarousel(): void {
    this.runInContext(() => {
      const root =
        this.elementRef.nativeElement;

      const slides =
        root.querySelectorAll(
          '.carousel-slide',
        );

      if (!slides.length) {
        return;
      }

      slides.forEach(
        (
          slide: HTMLElement,
          index: number,
        ) => {
          if (
            index ===
            this.activeImageIndex
          ) {
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
            gsap.to(slide, {
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out',
            });
          }
        },
      );
    });
  }

  // =========================================================
  // PAGE ANIMATIONS
  // =========================================================

  private refreshAnimations(): void {
    const currentPlace =
      this.place();

    if (!currentPlace) {
      return;
    }

    const root =
      this.elementRef.nativeElement;

    console.log(
      '[PLACE] init animation:',
      currentPlace.name,
    );

    /*
     * Dọn sạch TOÀN BỘ tween + ScrollTrigger + style leftover của place trước
     * (nếu có) trước khi tạo animation mới. Thay thế hoàn toàn cho cặp
     * killTweensOf() + ScrollTrigger.getAll().forEach(kill) cũ — cách cũ không
     * revert style nên để lại leftover `opacity:0` gây kẹt vô hình vĩnh viễn.
     */
    this.ctx?.revert();

    this.ctx = gsap.context(() => {
      // =======================================================
      // HERO
      // =======================================================

      const heroContent =
        root.querySelector(
          '.hero-content',
        );

      const heroImage =
        root.querySelector(
          '.hero-image',
        );

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

      // =======================================================
      // CONTENT
      // =======================================================

      const sections =
        root.querySelectorAll(
          '.content-section',
        );

      sections.forEach(
        (section: Element) => {
          const image =
            section.querySelector(
              '.content-image',
            );

          const text =
            section.querySelector(
              '.content-text',
            );

          /*
           * `.fromTo()` thay vì `.from()`: target tường minh (opacity:1, y:0)
           * nên không còn phụ thuộc vào style hiện tại của phần tử làm điểm
           * đích — loại bỏ tận gốc lỗi leftover `opacity:0` khi tạo lại tween
           * cho cùng 1 phần tử sau khi component bị revert giữa chừng.
           */
          if (image) {
            gsap.fromTo(
              image,
              {
                opacity: 0,
                scale: 0.85,
                y: 80,
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  end: 'top 30%',
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
                y: 100,
              },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  end: 'top 35%',
                  scrub: 1,
                },
              },
            );
          }
        },
      );

      // =======================================================
      // REFERENCE
      // =======================================================

      const reference =
        root.querySelector(
          '.reference',
        );

      if (reference) {
        gsap.fromTo(
          reference,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: reference,
              start: 'top 80%',
            },
            duration: 1,
            ease: 'power3.out',
          },
        );
      }

      // =======================================================
      // CAROUSEL
      // =======================================================

      this.animateCarousel();

      // =======================================================
      // REFRESH
      // =======================================================

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, root);
  }

  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {
    /*
     * Stop image carousel.
     */
    this.stopCarousel();

    /*
     * Unsubscribe route.
     */
    this.routeSubscription?.unsubscribe();

    /*
     * Revert toàn bộ tween + ScrollTrigger + style của context hiện tại.
     * Thay cho việc tự lọc ScrollTrigger.getAll() + killTweensOf() thủ công.
     */
    this.ctx?.revert();
  }
}