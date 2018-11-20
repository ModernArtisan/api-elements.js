const { expect } = require('chai');
const { Fury } = require('fury');

const parseInfo = require('../../lib/parser/info');

const { minim } = new Fury();

describe('#parseInfo', () => {
  it('provides error when info is non-object', () => {
    const info = new minim.elements.String();

    const result = parseInfo(minim, info);

    expect(result.length).to.equal(1);
    expect(result.errors.get(0).toValue()).to.equal("'Info Object' is not an object");
  });

  describe('missing required properties', () => {
    it('provides error for missing title', () => {
      const info = new minim.elements.Object({
        version: '1.0.0',
      });

      const result = parseInfo(minim, info);

      expect(result.length).to.equal(1);
      expect(result.errors.get(0).toValue()).to.equal("'Info Object' is missing required property 'title'");
    });

    it('provides error for missing version', () => {
      const info = new minim.elements.Object({
        title: 'My API',
      });

      const result = parseInfo(minim, info);

      expect(result.length).to.equal(1);
      expect(result.errors.get(0).toValue()).to.equal("'Info Object' is missing required property 'version'");
    });
  });

  describe('required property type checking', () => {
    it('provides error when title is non-string', () => {
      const info = new minim.elements.Object({
        title: 1,
        version: '1.0.0',
      });

      const result = parseInfo(minim, info);

      expect(result.length).to.equal(1);
      expect(result.errors.get(0).toValue()).to.equal("'Info Object' 'title' is not a string");
    });

    it('provides error when version is non-string', () => {
      const info = new minim.elements.Object({
        title: 'My API',
        version: 1,
      });

      const result = parseInfo(minim, info);

      expect(result.length).to.equal(1);
      expect(result.errors.get(0).toValue()).to.equal("'Info Object' 'version' is not a string");
    });
  });

  describe('optional property type checking', () => {
    it('provides warning when description is non-string', () => {
      const info = new minim.elements.Object({
        title: 'My API',
        version: '1.0.0',
        description: 1,
      });

      const result = parseInfo(minim, info);
      expect(result.warnings.length).to.equal(1);
      expect(result.warnings.get(0).toValue()).to.equal("'Info Object' 'description' is not a string");
    });
  });

  describe('warnings for unsupported properties', () => {
    it('provides warning for unsupported termsOfService key', () => {
      const object = new minim.elements.Object({
        title: 'My API',
        version: '1.0.0',
        termsOfService: '',
      });

      const result = parseInfo(minim, object);

      expect(result.warnings.length).to.equal(1);
      expect(result.warnings.get(0).toValue()).to.equal("'Info Object' contains unsupported key 'termsOfService'");
    });

    it('provides warning for unsupported contact key', () => {
      const object = new minim.elements.Object({
        title: 'My API',
        version: '1.0.0',
        contact: {},
      });

      const result = parseInfo(minim, object);

      expect(result.warnings.length).to.equal(1);
      expect(result.warnings.get(0).toValue()).to.equal("'Info Object' contains unsupported key 'contact'");
    });

    it('provides warning for unsupported license key', () => {
      const object = new minim.elements.Object({
        title: 'My API',
        version: '1.0.0',
        license: {},
      });

      const result = parseInfo(minim, object);

      expect(result.warnings.length).to.equal(1);
      expect(result.warnings.get(0).toValue()).to.equal("'Info Object' contains unsupported key 'license'");
    });

    it('does not provide warning for Info Object extensions', () => {
      const object = new minim.elements.Object({
        title: 'My API',
        version: '1.0.0',
        'x-extension': {},
      });

      const result = parseInfo(minim, object);

      expect(result.annotations.length).to.equal(0);
    });

    it('provides warning for invalid keys', () => {
      const object = new minim.elements.Object({
        title: 'My API',
        version: '1.0.0',
        invalid: {},
      });

      const result = parseInfo(minim, object);

      expect(result.warnings.length).to.equal(1);
      expect(result.warnings.get(0).toValue()).to.equal("'Info Object' contains invalid key 'invalid'");
    });
  });

  it('provides api category with title and version', () => {
    const info = new minim.elements.Object({
      title: 'My API',
      version: '1.0.0',
    });

    const result = parseInfo(minim, info);
    expect(result.length).to.equal(1);
    expect(result.api.classes.toValue()).to.deep.equal(['api']);
    expect(result.api.title.toValue()).to.equal('My API');
    expect(result.api.attributes.get('version').toValue()).to.equal('1.0.0');
  });

  it('provides api category with description', () => {
    const info = new minim.elements.Object({
      title: 'My API',
      version: '1.0.0',
      description: 'My API Description',
    });

    const result = parseInfo(minim, info);
    expect(result.length).to.equal(1);
    expect(result.api.copy.toValue()).to.deep.equal(['My API Description']);
  });
});
