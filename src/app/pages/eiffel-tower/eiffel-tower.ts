import {
AfterViewInit,
Component,
ElementRef,
inject,
OnDestroy,
ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../core/services/animation.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
selector: 'app-eiffel-tower',
standalone: true,
templateUrl: './eiffel-tower.html',
styleUrl: './eiffel-tower.css',
})
export class EiffelTower implements AfterViewInit, OnDestroy {
@ViewChild('page', { static: false })
page!: ElementRef<HTMLElement>;

private context?: gsap.Context;

private readonly animationService = inject(AnimationService);

scrollToId(id: string): void {
this.animationService.scrollToId(id);
}

ngAfterViewInit(): void {
this.context = gsap.context(() => {
this.initHeroAnimation();
this.initStoryIntroAnimation();
this.initStoryQuoteAnimation();
this.initStoryAnimation();
this.initQuoteAnimation();
this.initCtaAnimation();
});


ScrollTrigger.refresh();


}

/**

* HERO
*
* * Background zoom
* * Background parallax
* * Nội dung xuất hiện lần lượt
* * Title parallax nhẹ khi rời Hero
    */
    private initHeroAnimation(): void {
    const hero = document.querySelector('.hero');


if (!hero) return;



const background = hero.querySelector('.hero__background');
const overlay = hero.querySelector('.hero__overlay');
const eyebrow = hero.querySelector('.hero__eyebrow');
const title = hero.querySelector('.hero__title');
const subtitle = hero.querySelector('.hero__subtitle');
const meta = hero.querySelector('.hero__meta');
const button = hero.querySelector('.hero__button');

const intro = gsap.timeline({
  defaults: {
    ease: 'power3.out',
  },
});

gsap.set(background, {
  scale: 1.15,
  filter: 'blur(18px)',
});

gsap.set(overlay, {
  opacity: 0.8,
});

gsap.set([eyebrow, title, subtitle, meta, button], {
  opacity: 0,
  y: 40,
});

intro
  .to(background, {
    scale: 1,
    filter: 'blur(10px)',
    duration: 2,
  })
  .to(
    overlay,
    {
      opacity: 0.45,
      duration: 1.2,
    },
    '-=1.4',
  )
  .to(
    eyebrow,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
    },
    '-=0.5',
  )
  .to(
    title,
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
    },
    '-=0.5',
  )
  .to(
    subtitle,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
    },
    '-=0.7',
  )
  .to(
    meta,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
    },
    '-=0.5',
  )
  .to(
    button,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
    },
    '-=0.4',
  );

/*
 * Background parallax
 */
gsap.to(background, {
  yPercent: 15,
  ease: 'none',
  scrollTrigger: {
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

/*
 * Title parallax
 *
 * Không cho opacity về 0 để title không biến mất
 * hoàn toàn khi người dùng rời Hero.
 */
gsap.to(title, {
  yPercent: -18,
  opacity: 0.55,
  ease: 'none',
  scrollTrigger: {
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});


}

/**

* STORY INTRO
  */
  private initStoryIntroAnimation(): void {
  const intro = document.querySelector('.story__intro');


if (!intro) return;



const label = intro.querySelector('.section-label');
const title = intro.querySelector('h2');
const description = intro.querySelector('.story__intro-description');

gsap.set(label, {
  opacity: 0,
  y: 30,
});

gsap.set(title, {
  opacity: 0,
  y: 100,
  scale: 0.95,
});

gsap.set(description, {
  opacity: 0,
  y: 40,
});

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: intro,
    start: 'top 75%',
    toggleActions: 'play none none reverse',
  },
});

timeline
  .to(label, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
  })
  .to(
    title,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
    },
    '-=0.3',
  )
  .to(
    description,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.5',
  );


}

/**

* DẪN CHỨNG
*
* Đây là điểm nhấn chính của page.
*
* * Đường viền mở ra
* * Nhãn xuất hiện
* * Câu dẫn chứng trượt lên
* * Nguồn xuất hiện sau cùng
    */
    private initStoryQuoteAnimation(): void {
    const quote = document.querySelector('.story__quote');


if (!quote) return;



const label = quote.querySelector('.story__quote-label');
const text = quote.querySelector('blockquote');
const source = quote.querySelector('.story__quote-source');

gsap.set(quote, {
  opacity: 0,
  y: 80,
});

gsap.set(label, {
  opacity: 0,
  x: -30,
});

gsap.set(text, {
  opacity: 0,
  y: 80,
});

gsap.set(source, {
  opacity: 0,
  y: 20,
});

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: quote,
    start: 'top 75%',
    toggleActions: 'play none none reverse',
  },
});

timeline
  .to(quote, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  })
  .to(
    label,
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.4',
  )
  .to(
    text,
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
    },
    '-=0.2',
  )
  .to(
    source,
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.5',
  );


}

/**

* STORY
*
* * Image zoom
* * Image clip reveal
* * Nội dung xuất hiện lần lượt
* * Content parallax
    */
    private initStoryAnimation(): void {
    const items = gsap.utils.toArray<HTMLElement>('.story__item');


items.forEach((item) => {



  const image = item.querySelector('.story__image');
  const imageWrapper = item.querySelector('.story__image-wrapper');

  const content = item.querySelector('.story__content');
  const label = item.querySelector('.section-label');
  const title = item.querySelector('.story__title');

  const descriptions = gsap.utils.toArray<HTMLElement>(
    item.querySelectorAll('.story__description'),
  );

  gsap.set(image, {
    scale: 1.2,
  });

  gsap.set(imageWrapper, {
    clipPath: 'inset(12% 0% 12% 0%)',
  });

  gsap.set([label, title, ...descriptions], {
    opacity: 0,
    y: 60,
  });

  /*
   * Image parallax
   */
  gsap.to(image, {
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: imageWrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  /*
   * Image reveal
   */
  gsap.to(imageWrapper, {
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: 1.4,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: imageWrapper,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

  /*
   * Text reveal
   */
  gsap.to([label, title, ...descriptions], {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: content,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  /*
   * Content parallax
   */
  gsap.to(content, {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: item,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});


}

/**

* DẤU ẤN
  */
  private initQuoteAnimation(): void {
  const quote = document.querySelector('.quote');


if (!quote) return;



const label = quote.querySelector('.section-label');
const text = quote.querySelector('.quote__text');

const descriptions = gsap.utils.toArray<HTMLElement>(
  quote.querySelectorAll('.quote__description p'),
);

gsap.set(label, {
  opacity: 0,
  y: 30,
});

gsap.set(text, {
  opacity: 0,
  y: 100,
  scale: 0.95,
});

gsap.set(descriptions, {
  opacity: 0,
  y: 50,
});

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: quote,
    start: 'top 70%',
    toggleActions: 'play none none reverse',
  },
});

timeline
  .to(label, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  })
  .to(
    text,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
    },
    '-=0.2',
  )
  .to(
    descriptions,
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.2,
      ease: 'power3.out',
    },
    '-=0.5',
  );


}

/**

* CTA
  */
  private initCtaAnimation(): void {
  const cta = document.querySelector('.cta');


if (!cta) return;



const image = cta.querySelector('.cta__background img');
const overlay = cta.querySelector('.cta__overlay');

const label = cta.querySelector('.section-label');
const title = cta.querySelector('.cta__title');
const description = cta.querySelector('.cta__description');
const button = cta.querySelector('.cta__button');

gsap.set(image, {
  scale: 1.2,
});

gsap.set([label, title, description, button], {
  opacity: 0,
  y: 60,
});

/*
 * Background parallax
 */
gsap.to(image, {
  scale: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: cta,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});

/*
 * Overlay
 */
gsap.to(overlay, {
  opacity: 0.35,
  ease: 'none',
  scrollTrigger: {
    trigger: cta,
    start: 'top 80%',
    end: 'center center',
    scrub: true,
  },
});

/*
 * Content reveal
 */
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: cta,
    start: 'top 65%',
    toggleActions: 'play none none reverse',
  },
});

timeline
  .to(label, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  })
  .to(
    title,
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    },
    '-=0.3',
  )
  .to(
    description,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.4',
  )
  .to(
    button,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    },
    '-=0.3',
  );


}

ngOnDestroy(): void {
this.context?.revert();
}

hehe(): void {
alert('Chưa làm tới hehe');
}
}
