import {
  AfterViewInit,
  Component,
  OnDestroy,
} from '@angular/core';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ITeamMember {
  name: string;
  role: string;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-members',
  standalone: true,
  templateUrl: './members.component.html',
  styleUrl: './members.component.css',
})
export class MembersComponent implements AfterViewInit, OnDestroy {

  teamMembers: ITeamMember[] = [
    {
      name: 'Thành Luân',
      role: 'Phát triển',
      image: '/assets/images/team/member-default.png',
    },
    {
      name: 'Thanh Hằng',
      role: 'Thiết kế',
      image: '/assets/images/team/embexiu.png',
    },
    {
      name: 'Quỳnh Trâm',
      role: 'Phát triển',
      image: '/assets/images/team/member-default.png',
    },
    {
      name: 'Như Thuần',
      role: 'Nội dung',
      image: '/assets/images/team/member-default.png',
    },
    {
      name: 'Bảo Hân',
      role: 'Thiết kế',
      image: '/assets/images/team/member-default.png',
    },
    {
      name: 'Thanh Thu',
      role: 'Phát triển',
      image: '/assets/images/team/member-default.png',
    },
    {
      name: 'Vân',
      role: 'Nội dung',
      image: '/assets/images/team/member-default.png',
    },
    {
      name: 'Ngọc',
      role: 'Phát triển',
      image: '/assets/images/team/member-default.png',
    },
  ];


  ngAfterViewInit(): void {
    this.initAnimation();
  }


  /**
   * Animation xuất hiện từng thành viên
   * khi section đi vào viewport.
   */
  private initAnimation(): void {

    gsap.from('.members-eyebrow', {
      scrollTrigger: {
        trigger: '#members',
        start: 'top 75%',
        once: true,
      },

      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });


    gsap.from('.members-title', {
      scrollTrigger: {
        trigger: '#members',
        start: 'top 75%',
        once: true,
      },

      y: 70,
      opacity: 0,
      duration: 1,
      delay: 0.1,
      ease: 'power3.out',
    });


    gsap.from('.members-introduction', {
      scrollTrigger: {
        trigger: '#members',
        start: 'top 75%',
        once: true,
      },

      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
    });


    /*
     * Các card xuất hiện lần lượt.
     */
    gsap.from('.member-card', {
      scrollTrigger: {
        trigger: '.members-grid',
        start: 'top 80%',
        once: true,
      },

      y: 60,
      opacity: 0,

      duration: 0.8,

      stagger: 0.1,

      ease: 'power3.out',
    });
  }


  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(
      trigger => trigger.kill(),
    );
  }
}