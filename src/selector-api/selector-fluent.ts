import * as action from '../actions';
import { PlaywrightFluent } from '../fluent-api';
import {
  ClickOptions,
  defaultClickOptions,
  defaultHoverOptions,
  defaultVerboseOptions,
  HoverOptions,
  SelectOptionInfo,
  VerboseOptions,
} from '../actions';
import { ElementHandle } from 'playwright';
type Action = (handles: ElementHandle<Element>[]) => Promise<ElementHandle<Element>[]>;

interface ActionInfoWithoutParam {
  name: 'parent' | 'nextSibling' | 'unknown';
}
interface ActionInfoWithSelector {
  name: 'querySelectorAllInPage' | 'find';
  selector: string;
}
interface ActionInfoWithText {
  name: 'withText' | 'withValue' | 'withPlaceholder';
  text: string;
}
interface ActionInfoWithIndex {
  name: 'nth';
  index: number;
}

type ActionInfo =
  | ActionInfoWithoutParam
  | ActionInfoWithSelector
  | ActionInfoWithText
  | ActionInfoWithIndex;

interface SelectorState {
  actions: ActionInfo[];
  chainingHistory: string;
}

export class SelectorFluent {
  private chainingHistory = '';
  private pwf: PlaywrightFluent;

  private actionInfos: ActionInfo[] = [];

  private getActionFrom(actionInfo: ActionInfo): Action {
    switch (actionInfo.name) {
      case 'querySelectorAllInPage':
        return () => action.querySelectorAllInPage(actionInfo.selector, this.pwf.currentPage());

      case 'find':
        return (handles) => action.querySelectorAllFromHandles(actionInfo.selector, [...handles]);

      case 'nth':
        return (handles) => action.getNthHandle(actionInfo.index, [...handles]);

      case 'parent':
        return (handles) => action.getParentsOf([...handles]);

      case 'nextSibling':
        return (handles) => action.getNextSiblingsOf([...handles]);

      case 'withText':
        return (handles) => action.getHandlesWithText(actionInfo.text, [...handles]);

      case 'withValue':
        return (handles) => action.getHandlesWithValue(actionInfo.text, [...handles]);

      case 'withPlaceholder':
        return (handles) => action.getHandlesWithPlaceholder(actionInfo.text, [...handles]);

      default:
        throw new Error(`Action '${actionInfo.name}' is not yet implemented`);
    }
  }

  private async executeActions(): Promise<ElementHandle<Element>[]> {
    let handles: ElementHandle<Element>[] = [];
    for (let index = 0; index < this.actionInfos.length; index++) {
      const action = this.getActionFrom(this.actionInfos[index]);
      handles = await action([...handles]);
    }
    return handles;
  }

  /**
   * Executes the search.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @returns {Promise<ElementHandle<Element>[]>} will return an empty array if no elements are found, will return all found elements otherwise.
   * @memberof SelectorFluent
   */
  public async getAllHandles(): Promise<ElementHandle<Element>[]> {
    const handles = await this.executeActions();
    return handles;
  }

  /**
   * Obsolete: please use the getHandle() method
   * Executes the search and returns the first found element.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @returns {Promise<ElementHandle<Element> | null>} will return null if no elements are found, will return first found element otherwise.
   * @memberof SelectorFluent
   */
  public async getFirstHandleOrNull(): Promise<ElementHandle<Element> | null> {
    const handles = await this.executeActions();
    if (handles.length === 0) {
      return null;
    }
    return handles[0];
  }

  /**
   * Executes the search and returns the first found element.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @returns {Promise<ElementHandle<Element> | null>} will return null if no elements are found, will return first found element otherwise.
   * @memberof SelectorFluent
   */
  public async getHandle(): Promise<ElementHandle<Element> | null> {
    const handles = await this.executeActions();
    if (handles.length === 0) {
      return null;
    }
    return handles[0];
  }

  /**
   * Gets the number of found elements.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @returns {Promise<number>} will return 0 if no elements are found.
   * @memberof SelectorFluent
   */
  public async count(): Promise<number> {
    const handles = await this.executeActions();
    return handles.length;
  }

  /**
   *
   */
  constructor(selector: string, pwf: PlaywrightFluent, stringifiedState?: string) {
    this.pwf = pwf;

    if (stringifiedState) {
      const state = JSON.parse(stringifiedState) as SelectorState;
      this.chainingHistory = state.chainingHistory;
      this.actionInfos = state.actions;
      return;
    }

    this.chainingHistory = `selector(${selector})`;
    this.actionInfos.push({ name: 'querySelectorAllInPage', selector });
  }

  public toString(): string {
    return this.chainingHistory;
  }

  private createSelectorFrom(
    selector: string,
    actions: ActionInfo[],
    chainingHistory: string,
  ): SelectorFluent {
    const state: SelectorState = {
      actions,
      chainingHistory,
    };

    return new SelectorFluent(selector, this.pwf, JSON.stringify(state));
  }
  public find(selector: string): SelectorFluent {
    const actions = [...this.actionInfos];
    actions.push({ name: 'find', selector });

    const chainingHistory = `${this.chainingHistory}
  .find(${selector})`;

    return this.createSelectorFrom(selector, actions, chainingHistory);
  }

  /**
   * Finds, from previous search, all elements whose innerText contains the specified text
   *
   * @param {string} text
   * @returns {SelectorFluent}
   * @memberof SelectorFluent
   */
  public withText(text: string): SelectorFluent {
    const actions = [...this.actionInfos];
    actions.push({ name: 'withText', text });

    const chainingHistory = `${this.chainingHistory}
  .withText(${text})`;

    return this.createSelectorFrom(text, actions, chainingHistory);
  }

  /**
   * Finds, from previous search, all elements whose value contains the specified text
   *
   * @param {string} text
   * @returns {SelectorFluent}
   * @memberof SelectorFluent
   */
  public withValue(text: string): SelectorFluent {
    const actions = [...this.actionInfos];
    actions.push({ name: 'withValue', text });

    const chainingHistory = `${this.chainingHistory}
  .withValue(${text})`;

    return this.createSelectorFrom(text, actions, chainingHistory);
  }

  /**
   * Finds, from previous search, all elements whose placeholder contains the specified text
   *
   * @param {string} text
   * @returns {SelectorFluent}
   * @memberof SelectorFluent
   */
  public withPlaceholder(text: string): SelectorFluent {
    const actions = [...this.actionInfos];
    actions.push({ name: 'withPlaceholder', text });

    const chainingHistory = `${this.chainingHistory}
  .withPlaceholder(${text})`;

    return this.createSelectorFrom(text, actions, chainingHistory);
  }

  public parent(): SelectorFluent {
    const actions = [...this.actionInfos];
    actions.push({ name: 'parent' });

    const chainingHistory = `${this.chainingHistory}
  .parent()`;

    return this.createSelectorFrom('', actions, chainingHistory);
  }

  public nextSibling(): SelectorFluent {
    const actions = [...this.actionInfos];
    actions.push({ name: 'nextSibling' });

    const chainingHistory = `${this.chainingHistory}
  .nextSibling()`;

    return this.createSelectorFrom('', actions, chainingHistory);
  }

  /**
   * Takes the nth element found at the previous step
   *
   * @param {number} index : 1-based index
   * @returns {SelectorFluent}
   * @memberof SelectorFluent
   * @example
   * nth(1): take the first element found at previous step.
   * nth(-1): take the last element found at previous step.
   */
  public nth(index: number): SelectorFluent {
    const actions = [...this.actionInfos];
    actions.push({ name: 'nth', index });

    const chainingHistory = `${this.chainingHistory}
  .nth(${index})`;

    return this.createSelectorFrom('', actions, chainingHistory);
  }

  /**
   * Checks if selector exists.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the disability status is the one known when executing this method.
   *
   * @returns {Promise<boolean>}
   * @memberof SelectorFluent
   */
  public async exists(): Promise<boolean> {
    const handle = await this.getFirstHandleOrNull();
    if (handle === null) {
      return false;
    }

    return true;
  }

  /**
   * Checks if the selector is visible.
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the visibilty status is the one known when executing this method.
   * @param {Partial<VerboseOptions>} [options=defaultVerboseOptions]
   * @returns {Promise<boolean>}
   * @memberof SelectorFluent
   */
  public async isVisible(
    options: Partial<VerboseOptions> = defaultVerboseOptions,
  ): Promise<boolean> {
    const verboseOptions = {
      ...defaultVerboseOptions,
      options,
    };
    const handle = await this.getHandle();
    const isElementVisible = await action.isHandleVisible(handle, verboseOptions);
    return isElementVisible;
  }

  /**
   * Checks that the selector is not visible.
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the visibilty status is the one known when executing this method.
   * @param {Partial<VerboseOptions>} [options=defaultVerboseOptions]
   * @returns {Promise<boolean>}
   * @memberof SelectorFluent
   */
  public async isNotVisible(
    options: Partial<VerboseOptions> = defaultVerboseOptions,
  ): Promise<boolean> {
    const verboseOptions = {
      ...defaultVerboseOptions,
      options,
    };
    const handle = await this.getHandle();
    const isElementNotVisible = await action.isHandleNotVisible(handle, verboseOptions);
    return isElementNotVisible;
  }

  /**
   * Checks if the selector is enabled.
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the enability status is the one known when executing this method.
   * @param {Partial<VerboseOptions>} [options=defaultVerboseOptions]
   * @returns {Promise<boolean>}
   * @memberof SelectorFluent
   */
  public async isEnabled(
    options: Partial<VerboseOptions> = defaultVerboseOptions,
  ): Promise<boolean> {
    const verboseOptions = {
      ...defaultVerboseOptions,
      options,
    };
    const handle = await this.getHandle();
    const isElementVisible = await action.isHandleEnabled(handle, verboseOptions);
    return isElementVisible;
  }

  public async innerText(): Promise<string | undefined | null> {
    const handle = await this.getHandle();
    const innerText = await action.getInnerTextOfHandle(handle);
    return innerText;
  }

  public async value(): Promise<string | undefined | null> {
    const handle = await this.getHandle();
    const value = await action.getValueOfHandle(handle);
    return value;
  }

  public async classList(): Promise<string[]> {
    const handle = await this.getHandle();
    const result = await action.getClassListOfHandle(handle);
    return result;
  }

  public async getAttribute(attributeName: string): Promise<string | null> {
    const handle = await this.getHandle();
    const result = await action.getAttributeOfHandle(attributeName, handle);
    return result;
  }

  /**
   * Get the placeholder content
   *
   * @returns {(Promise<string | null>)}
   * @memberof SelectorFluent
   */
  public async placeholder(): Promise<string | null> {
    return this.getAttribute('placeholder');
  }

  /**
   * Checks that selector has the specified class
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @param {string} expectedClass
   * @returns {Promise<boolean>}
   * @memberof SelectorFluent
   */
  public async hasClass(expectedClass: string): Promise<boolean> {
    const handle = await this.getHandle();
    const result = await action.hasHandleClass(handle, expectedClass);
    return result;
  }

  /**
   * Checks that selector does not have the specified class
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @param {string} expectedClass
   * @returns {Promise<boolean>}
   * @memberof SelectorFluent
   */
  public async doesNotHaveClass(expectedClass: string): Promise<boolean> {
    const handle = await this.getHandle();
    const result = await action.hasNotHandleClass(handle, expectedClass);
    return result;
  }

  /**
   * Checks that the selector is checked.
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the checked status is the one known when executing this method.
   *
   * @param {Partial<VerboseOptions>} [options=defaultVerboseOptions]
   * @returns {Promise<boolean>}
   * @memberof SelectorFluent
   */
  public async isChecked(
    options: Partial<VerboseOptions> = defaultVerboseOptions,
  ): Promise<boolean> {
    const verboseOptions = {
      ...defaultVerboseOptions,
      options,
    };
    const handle = await this.getHandle();
    const result = await action.isHandleChecked(handle, verboseOptions);
    return result;
  }

  public async isUnchecked(
    options: Partial<VerboseOptions> = defaultVerboseOptions,
  ): Promise<boolean> {
    const verboseOptions = {
      ...defaultVerboseOptions,
      options,
    };
    const handle = await this.getHandle();
    const result = await action.isHandleUnchecked(handle, verboseOptions);
    return result;
  }

  public async options(): Promise<SelectOptionInfo[]> {
    const handle = await this.getHandle();
    const result = await action.getAllOptionsOfHandle(handle, this.toString());
    return result;
  }

  /**
   * hover over selector
   * @param {Partial<HoverOptions>} [options=defaultHoverOptions]
   * @returns {Promise<void>}
   * @memberof SelectorFluent
   */
  public async hover(options: Partial<HoverOptions> = defaultHoverOptions): Promise<void> {
    const handle = await this.getHandle();
    const hoverOptions = {
      ...defaultHoverOptions,
      ...options,
    } as HoverOptions;
    await action.hoverOnHandle(handle, this.toString(), this.pwf.currentPage(), hoverOptions);
  }

  /**
   * click on selector
   *
   * @param {Partial<ClickOptions>} [options=defaultClickOptions]
   * @returns {Promise<void>}
   * @memberof SelectorFluent
   */
  public async click(options: Partial<ClickOptions> = defaultClickOptions): Promise<void> {
    const handle = await this.getHandle();
    const clickOptions = {
      ...defaultClickOptions,
      ...options,
    } as ClickOptions;
    await action.clickOnHandle(handle, this.toString(), this.pwf.currentPage(), clickOptions);
  }
}
