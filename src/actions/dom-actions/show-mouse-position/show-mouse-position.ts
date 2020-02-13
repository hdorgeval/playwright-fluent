import { Page } from 'playwright';

declare const window: Window;
declare const document: Document;

export async function showMousePosition(page: Page | undefined): Promise<void> {
  if (!page) {
    throw new Error('Cannot show mouse position because no browser has been launched');
  }
  // code from https://gist.github.com/aslushnikov/94108a4094532c7752135c42e12a00eb
  await page.evaluateOnNewDocument(() => {
    // Install mouse helper only for top-level frame.
    if (window !== window.parent) return;
    window.addEventListener(
      'DOMContentLoaded',
      () => {
        const box = document.createElement('playwright-mouse-pointer');
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
        playwright-mouse-pointer {
          pointer-events: none;
          position: absolute;
          top: 0;
          z-index: 10000;
          left: 0;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,.4);
          border: 1px solid white;
          border-radius: 10px;
          margin: -10px 0 0 -10px;
          padding: 0;
          transition: background .2s, border-radius .2s, border-color .2s;
        }
        playwright-mouse-pointer.button-1 {
          transition: none;
          background: rgba(0,0,0,0.9);
        }
        playwright-mouse-pointer.button-2 {
          transition: none;
          border-color: rgba(0,0,255,0.9);
        }
        playwright-mouse-pointer.button-3 {
          transition: none;
          border-radius: 4px;
        }
        playwright-mouse-pointer.button-4 {
          transition: none;
          border-color: rgba(255,0,0,0.9);
        }
        playwright-mouse-pointer.button-5 {
          transition: none;
          border-color: rgba(0,255,0,0.9);
        }
      `;
        document.head.appendChild(styleElement);
        document.body.appendChild(box);
        document.addEventListener(
          'mousemove',
          (event) => {
            box.style.left = event.pageX + 'px';
            box.style.top = event.pageY + 'px';
          },
          true,
        );
        document.addEventListener(
          'mousedown',
          (event) => {
            box.classList.add('button-' + event.which);
          },
          true,
        );
        document.addEventListener(
          'mouseup',
          (event) => {
            box.classList.remove('button-' + event.which);
          },
          true,
        );
      },
      false,
    );
  });
}
