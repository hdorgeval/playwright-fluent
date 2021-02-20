import { waitUntil, report } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { invokeMethodOnHandle, MethodName } from '../../handle-actions';
import { InvokeOptions } from '../../page-actions';

export async function invokeMethodOnSelectorObject(
  methodName: MethodName,
  selector: SelectorFluent,
  options: InvokeOptions,
): Promise<void> {
  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot invoke method '${methodName}' on '${selector.toString()}' because this selector was not found in DOM`,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
      stabilityInMilliseconds: options.stabilityInMilliseconds,
      throwOnTimeout: true,
      verbose: options.verbose,
    },
  );

  const handle = await selector.getHandle();
  await invokeMethodOnHandle(methodName, handle, selector.toString());
}
