const { ArrayElement } = require('minim');

/**
 * @class Resource
 *
 * @param {Array} content
 * @param meta
 * @param attributes
 *
 * @extends ArrayElement
 */
class Resource extends ArrayElement {
  constructor(...args) {
    super(...args);

    this.element = 'resource';
  }

  /**
   * @name hosts
   * @type ArraySlice
   * @memberof Resource.prototype
   */
  get hosts() {
    return this.attributes.get('hosts');
  }

  set hosts(value) {
    this.attributes.set('hosts', value);
  }

  /**
   * @name href
   * @type StringElement
   * @memberof Resource.prototype
   */
  get href() {
    return this.attributes.get('href');
  }

  set href(value) {
    this.attributes.set('href', value);
  }

  /**
   * @name hrefVariables
   * @type HrefVariables
   * @memberof Resource.prototype
   */
  get hrefVariables() {
    return this.attributes.get('hrefVariables');
  }

  set hrefVariables(value) {
    this.attributes.set('hrefVariables', value);
  }

  /**
   * @name transitions
   * @type ArraySlice
   * @memberof Resource.prototype
   */
  get transitions() {
    return this.children.filter(item => item.element === 'transition');
  }

  /**
   * @name dataStructure
   * @type DataStructure
   * @memberof Resource.prototype
   */
  get dataStructure() {
    return this.children.filter(item => item.element === 'dataStructure').first;
  }

  /**
   * @name host
   * @type StringElement
   * @memberof ParseResult.prototype
   */
  get host() {
    return this.children
      .filter(item => item.classes.contains('host'));
  }
}

module.exports = Resource;
