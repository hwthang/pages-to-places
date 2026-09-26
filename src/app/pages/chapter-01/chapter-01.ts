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
selector: 'app-chapter01',
standalone: true,
templateUrl: './chapter-01.html',
styleUrl: './chapter-01.css',
})
export class Chapter01 implements AfterViewInit, OnDestroy {

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
this.initPlacesAnimation();
this.initEvidenceAnimation();
this.initMeaningAnimation();
this.initCtaAnimation();
});


ScrollTrigger.refresh();


}

/**

* HERO
  */
  private initHeroAnimation(): void {
  const hero = document.querySelector('.hero');


if (!hero) return;



const background = hero.querySelector('.hero__background');
const eyebrow = hero.querySelector('.hero__eyebrow');
const title = hero.querySelector('.hero__title');
const subtitle = hero.querySelector('.hero__subtitle');
const button = hero.querySelector('.hero__button');

gsap.set(background, {
  scale: 1.12,
});

gsap.set(
  [eyebrow, title, subtitle, button],
  {
    opacity: 0,
    y: 50,
  },
);

const intro = gsap.timeline({
  defaults: {
    ease: 'power3.out',
  },
});

intro
  .to(background, {
    scale: 1,
    duration: 2,
  })
  .to(
    eyebrow,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
    },
    '-=1.2',
  )
  .to(
    title,
    {
      opacity: 1,
      y: 0,
      duration: 1,
    },
    '-=0.4',
  )
  .to(
    subtitle,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
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
    '-=0.3',
  );

gsap.to(background, {
  yPercent: 12,
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

* HAI ĐỊA ĐIỂM
*
* Tsim Sha Tsui East và Ladies' Market
* được animate độc lập nhưng cùng một cấu trúc.
  */
  private initPlacesAnimation(): void {
  const cards = gsap.utils.toArray<HTMLElement>('.place-card');


cards.forEach((card, index) => {



  const images = gsap.utils.toArray<HTMLElement>(
    card.querySelectorAll('.place-card__image img'),
  );

  const content = card.querySelector('.place-card__content');
  const label = card.querySelector('.section-label');
  const title = card.querySelector('h3');

  const quote = card.querySelector('.place-card__quote');

  const paragraphs = gsap.utils.toArray<HTMLElement>(
    card.querySelectorAll(
      '.place-card__content p:not(.place-card__quote)',
    ),
  );

  /*
   * Mỗi ảnh có chuyển động hơi khác nhau.
   * Ảnh chính chuyển động mạnh hơn.
   */
  images.forEach((image, imageIndex) => {

    gsap.set(image, {
      scale: imageIndex === 0 ? 1.14 : 1.08,
    });

    gsap.to(image, {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

  });


  /*
   * Nội dung.
   */
  gsap.set(
    [label, title, quote, ...paragraphs],
    {
      opacity: 0,
      y: 45,
    },
  );


  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: 'top 75%',
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
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.25',
    )
    .to(
      quote,
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.3',
    )
    .to(
      paragraphs,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      },
      '-=0.4',
    );


  /*
   * Hai card lệch nhẹ để tạo nhịp trên desktop.
   * Không áp dụng trên mobile.
   */
  gsap.to(content, {
    y: index === 0 ? -20 : 20,
    ease: 'none',
    scrollTrigger: {
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

});


}

/**

* DẪN CHỨNG
*
* Phần trích dẫn được làm nổi bật nhất.
  */
  private initEvidenceAnimation(): void {
  const evidence = document.querySelector('.evidence');


if (!evidence) return;



const label = evidence.querySelector('.section-label');
const quote = evidence.querySelector('.evidence__quote');

const paragraphs = gsap.utils.toArray<HTMLElement>(
  evidence.querySelectorAll('.evidence__body p'),
);

gsap.set(label, {
  opacity: 0,
  y: 30,
});

gsap.set(quote, {
  opacity: 0,
  y: 90,
  scale: 0.94,
});

gsap.set(paragraphs, {
  opacity: 0,
  y: 40,
});

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: evidence,
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
    quote,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.3,
      ease: 'power3.out',
    },
    '-=0.2',
  )
  .to(
    paragraphs,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
    },
    '-=0.5',
  );


}

/**

* Ý NGHĨA
  */
  private initMeaningAnimation(): void {
  const meaning = document.querySelector('.meaning');


if (!meaning) return;



const label = meaning.querySelector('.section-label');
const title = meaning.querySelector('h2');

const paragraphs = gsap.utils.toArray<HTMLElement>(
  meaning.querySelectorAll('p'),
);

gsap.set(
  [label, title, ...paragraphs],
  {
    opacity: 0,
    y: 60,
  },
);

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: meaning,
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
    title,
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    },
    '-=0.2',
  )
  .to(
    paragraphs,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    },
    '-=0.4',
  );


}

/**

* CTA
  */
  private initCtaAnimation(): void {
  const cta = document.querySelector('.cta');


if (!cta) return;



const background = cta.querySelector('.cta__background');
const label = cta.querySelector('.section-label');
const title = cta.querySelector('h2');
const button = cta.querySelector('.cta__button');

gsap.set(background, {
  scale: 1.15,
});

gsap.set(
  [label, title, button],
  {
    opacity: 0,
    y: 60,
  },
);

gsap.to(background, {
  scale: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: cta,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: cta,
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
    title,
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    },
    '-=0.25',
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
}
