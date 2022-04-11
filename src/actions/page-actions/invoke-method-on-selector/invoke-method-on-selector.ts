import { Frame, Page } from 'playwright';
import { MethodName, invokeMethodOnHandle } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions, defaultWaitUntilOptions } from '../../../utils';

export interface InvokeOptions {
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}
export const defaultInvokeOptions: InvokeOptions = {
  stabilityInMilliseconds: 300,
  timeoutInMilliseconds: 30000,
  verbose: false,
};

export async function invokeMethodOnSelector(
  methodName: MethodName,
  selector: string,
  page: Page | Frame | undefined,
  options: InvokeOptions,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Cannot invoke method '${methodName}' on '${selector}' because no browser has been launched`,
    );
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  const handle = await getHandleOf(selector, page, waitOptions);
  await invokeMethodOnHandle(methodName, handle, selector);
}
