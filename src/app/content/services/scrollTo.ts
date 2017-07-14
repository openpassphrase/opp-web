import { Injectable, NgZone } from '@angular/core';

declare const requestAnimationFrame: any;
declare const webkitRequestAnimationFrame: any;
declare const mozRequestAnimationFrame: any;

@Injectable()
export class ScrollToService {
  requestAnimFrame: any;

  constructor(private ngZone: NgZone) {
    this.requestAnimFrame = requestAnimationFrame ||
    webkitRequestAnimationFrame ||
    mozRequestAnimationFrame ||
    function (callback) { setTimeout(callback, 1000 / 60); };
  }

  scrollTo(to: number, duration: number, callback?) {
    const self = this;
    // because it's so fucking difficult to detect the scrolling element, just move them all
    function move(amount: number) {
      document.documentElement.scrollTop = amount;
      (<any>document.body.parentNode).scrollTop = amount;
      document.body.scrollTop = amount;
    }
    function position() {
      return document.documentElement.scrollTop || (<any>document.body.parentNode).scrollTop || document.body.scrollTop;
    }
    const start = position(),
      change = to - start,
      increment = 20;
    let currentTime = 0;
    duration = (typeof (duration) === 'undefined') ? 500 : duration;

    const animateScroll = function () {
      // increment the time
      currentTime += increment;
      // find the value with the quadratic in-out easing function
      const val = easeInOutQuad(currentTime, start, change, duration);
      // move the document.body
      move(val);
      // do the animation unless its over
      if (currentTime < duration) {
        self.requestAnimFrame(animateScroll);
      } else {
        if (callback && typeof (callback) === 'function') {
          // the animation is done so lets callback
          callback();
        }
      }
    };

    this.ngZone.runOutsideAngular(() => {
      animateScroll();
    });
  }
}

function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

function easeInCubic(t, b, c, d) {
  const tc = (t /= d) * t * t;
  return b + c * (tc);
};

function inOutQuintic(t, b, c, d) {
  const ts = (t /= d) * t,
    tc = ts * t;
  return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
};
