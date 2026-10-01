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
  id:string; //mssv 47.xx.xx.xx
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
    id: '49.01.606.041',
    role: 'Phát triển web',
    image: '/assets/images/team/thành luân.JPG',
  },
  {
    name: 'Thanh Hằng',
    id: '49.01.606.027',
    role: 'Thiết kế & Phát triển web',
    image: '/assets/images/team/thanh-hang.jpg',
  },
  {
    name: 'Quỳnh Trâm',
    id: '49.01.606.085',
    role: 'Nội dung',
    image: '/assets/images/team/quynh-tram.jpg',
  },
  {
    name: 'Như Thuần',
    id: '49.01.606.075',
    role: 'Nội dung',
    image: '/assets/images/team/nhu-thuan.jpg',
  },
  {
    name: 'Bảo Hân',
    id: '49.01.606.031',
    role: 'Nội dung',
    image: '/assets/images/team/bao-han.jpg',
  },
  {
    name: 'Thanh Thu',
    id: '49.01.606.074',
    role: 'Nội dung',
    image: '/assets/images/team/Thanh Thu.jpg',
  },
  {
    name: 'Kiều Vân',
    id: '49.01.606.097',
    role: 'Nội dung',
    image: '/assets/images/team/kieu-van.png',
  },
  {
    name: 'Minh Ngọc',
    id: '49.01.606.053',
    role: 'Nội dung',
    image: '/assets/images/team/minh-ngoc.jpg',
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