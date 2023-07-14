const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {

    describe('валидация: строковые поля', () => {

      const str0_rules = {
        name: {
          type: 'string',
          min: 10,
          max: 20,
        }
      };

      const validator = new Validator(str0_rules);

      it('строка короче заданного min', () => {
        const testObj = { name: 'Lalala' };
        const errors = validator.validate(testObj );
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`too short, expect ${str0_rules.name.min}, got ${testObj.name.length}`);
      });

      it('строка длинее заданного max', () => {
        const testObj = { name: '01234567890_01234567890' };
        const errors = validator.validate(testObj);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`too long, expect ${str0_rules.name.max}, got ${testObj.name.length}`);
      });

      it('длина строки в диапазоне [min, max]', () => {
        const testObj = { name: '01234567890' };
        const errors = validator.validate(testObj);
        expect(errors).to.have.length(0);
      });


    });

    describe('валидация: числовые поля', () => {
      const num0_rules = {
        cst_id: {
          type: 'number',
          min: 1024,
          max: 20000,
        }
      };

      const validator = new Validator(num0_rules);

      it('число меньше заданного min', () => {
        const testObj = { cst_id: num0_rules.cst_id.min-1 };
        const errors = validator.validate(testObj);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('cst_id');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`too little, expect ${num0_rules.cst_id.min}, got ${testObj.cst_id}`);
      });

      it('число больше заданного max', () => {
        const testObj = { cst_id: num0_rules.cst_id.max+1 };
        const errors = validator.validate(testObj);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('cst_id');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`too big, expect ${num0_rules.cst_id.max}, got ${testObj.cst_id}`);
      });

      it('число в диапазоне [min, max]', () => {
        const testObj = { cst_id: num0_rules.cst_id.max-10 };
        const errors = validator.validate(testObj);
        expect(errors).to.have.length(0);
      });
    });

    describe('невалидный объект', () => {
      const c_rules = {
        name: {
          type: 'string',
          min: 10,
          max: 15,
        },
        code_id: {
          type: 'number',
          min: 1000,
          max: 65536,
        },
      };

      const validator = new Validator(c_rules);

      it('поле конфигурации отсутствует в объекте', () => {
        const testObj0 = { name0: '01234567890', code_id: 10000 };
        let errors = validator.validate(testObj0);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`Rules field 'name' is undefined in the validating obj`);

        const testObj1 = { name: '01234567890', weight: 33 };
        errors = validator.validate(testObj1);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('code_id');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`Rules field 'code_id' is undefined in the validating obj`);

        const testObj2 = { name: '01234567890_01234567890', weight: 33 };
        errors = validator.validate(testObj2);
        expect(errors).to.have.length(2);
        expect(errors[1]).to.have.property('field').and.to.be.equal('code_id');
        expect(errors[1]).to.have.property('error').and.to.be.equal(`Rules field 'code_id' is undefined in the validating obj`);
      });

      it('неправильный тип поля в проверяемом объекте', () => {
        const testObj0 = { name: '01234567890', code_id: {id: '1000'} };
        let errors = validator.validate(testObj0);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('code_id');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`expect number, got object`);
      });

      it('неопределенный объект валидации', () => {
        let testObj = undefined;
        expect(function(){validator.validate(testObj);}).to.throw('obj is not valid: undefined');
        testObj = null;
        expect(function(){validator.validate(testObj);}).to.throw('obj is not valid: null');
      });
    });

    describe('создание валидатора', () => {

        it('rules не определен', () => {
          const c_rules0 = null;
          const c_rules1 = undefined;
          expect(function(){new Validator(c_rules0);}).to.throw(`rules is not valid: null`);
          expect(function(){new Validator(c_rules1);}).to.throw(`rules is not valid: undefined`);
        });

        it('rules не содержит полей', () => {
          const c_rules0 = {};
          expect(function(){new Validator(c_rules0);}).to.throw(`rules does not contain fields`);
        });

        it('rules содержит неопределенный объект', () => {
          const c_rules0 = {
            name: null,
            code_id: {
              type: 'number',
              min: 1000,
              max: 65536,
            },
          };

          const c_rules1 = {
            name: {
              type: 'string',
              min: 10,
              max: 15,
            },
            code_id: undefined
          };

          expect(function(){new Validator(c_rules0);}).to.throw(`Rule 'name' is not defined: null`);
          expect(function(){new Validator(c_rules1);}).to.throw(`Rule 'code_id' is not defined: undefined`);
        });

        it('неподдерживаемый тип в rules', () => {
          const c_rules0 = {
            name: {
              type: 'string',
              min: 10,
              max: 15,
            },
            code_id: {
              min: 1000,
              max: 65536,
            },
          };

          const c_rules1 = {
            name: {
              type: null,
              min: 10,
              max: 15,
            },
            code_id: {
              type: 'number',
              min: 1000,
              max: 65536,
            },
          };

          const c_rules2 = {
            name: {
              type: 'number',
              min: 10,
              max: 15,
            },
            code_id: {},
          };

          expect(function(){new Validator(c_rules0);}).to.throw(`Rule 'code_id': the Validator expects types: string, number. The rule's type is: 'undefined'`);
          expect(function(){new Validator(c_rules1);}).to.throw(`Rule 'name': the Validator expects types: string, number. The rule's type is: 'null'`);
          expect(function(){new Validator(c_rules2);}).to.throw(`Rule 'code_id': the Validator expects types: string, number. The rule's type is: 'undefined'`);
        });

        it('не задан диапазон (min и/или max не определен)', () => {
          const c_rules0 = {
            name: {
              type: 'string',
              min: 10,
              max: 15,
            },
            code_id: {
              type: 'number',
              min: 1000
            },
          };

          const c_rules1 = {
            name: {
              type: 'string',
            },
            code_id: {
              type: 'number',
              min: 1000,
              max: 65536,
            },
          };

          expect(function(){new Validator(c_rules0);}).to.throw(`Rule 'code_id': range is not defined; min=1000, max=undefined`);
          expect(function(){new Validator(c_rules1);}).to.throw(`Rule 'name': range is not defined; min=undefined, max=undefined`);
        });

        it('отрицательное значение min и/или max для типа string', () => {
          const c_rules0 = {
            code_id: {
              type: 'number',
              min: -1000,
              max: 15
            },
            name: {
              type: 'string',
              min: -10,
              max: 15
            }
          };
          expect(function(){new Validator(c_rules0);}).to.throw(`Rule 'name': range values can't be negative for the type 'string'; min=-10, max=15`);
        });

        it('неправильное задание диапазона: min > max', () => {
          const c_rules0 = {
            code_id: {
              type: 'number',
              min: 1000,
              max: -15
            },
            name: {
              type: 'string',
              min: 10,
              max: 15
            }
          };
          expect(function(){new Validator(c_rules0);}).to.throw(`Rule 'code_id': min can't be greater than max`);
        });
    });
  });

});
