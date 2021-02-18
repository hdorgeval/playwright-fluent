import { ElementHandle } from 'playwright';

type HTMLElementMethods = Pick<HTMLElement, 'click' | 'focus' | 'blur'>;
type HTMLInputElementMethods = Pick<HTMLInputElement, 'select'>;
export type MethodName = keyof HTMLElementMethods | keyof HTMLInputElementMethods;

export async function invokeMethodOnHandle(
  methodName: MethodName,
  selector: ElementHandle<Element> | undefined | null,
  selectorName: string,
): Promise<void> {
  if (!selector) {
    throw new Error(
      `Cannot invoke method '${methodName}' on '${selectorName}' because selector was not found in DOM`,
    );
  }

  const hasBeenInvoked = await selector.evaluate((el, methodName) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (el && (el as any)[methodName] && typeof (el as any)[methodName] === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el as any)[methodName]();
      return true;
    }
    return false;
  }, methodName);

  if (hasBeenInvoked) {
    return;
  }

  throw new Error(
    `Cannot invoke method '${methodName}' on '${selectorName}' because this method does not exist.`,
  );
}
