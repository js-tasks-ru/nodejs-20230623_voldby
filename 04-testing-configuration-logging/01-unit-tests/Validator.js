module.exports = class Validator {
  constructor(rules) {

    if (rules === null || rules === undefined) {
      throw new Error("rules is not valid: "+rules);
    }

    let rFields = Object.keys(rules);
    if (rFields.length === 0)
      throw new Error("rules does not contain fields");

    let rule;
    for (const field of rFields) {
      rule = rules[field];

      if (rule === null || rule === undefined)
        throw new Error(`Rule '${field}' is not defined: ${rule}`);

      if (rule.type !== 'string' && rule.type !== 'number')
        throw new Error(`Rule '${field}': the Validator expects types: string, number. The rule's type is: '${rule.type}'`);

      if (rule.min === undefined || rule.min === null || rule.max === undefined || rule.max === null)
        throw new Error(`Rule '${field}': range is not defined; min=${rule.min}, max=${rule.max}'`);

      if (rule.type === 'string') {
        if (rule.min < 0 || rule.max < 0)
          throw new Error(`Rule '${field}': range values can't be negative for the type 'string'; min=${rule.min}, max=${rule.max}'`);
      }

      if (rule.min > rule.max){
        throw new Error(`Rule '${field}': min can't be greater than max`);
      }
    }

    this.rules = rules;
  }

  validate(obj) {

    if (obj === null || obj === undefined) {
      throw new Error("obj is not valid: "+obj);
    }

    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];
      const value = obj[field];

      if (value === undefined) {
        errors.push({field, error: `Rules field '${field}' is undefined in the validating obj`});
        return errors;
      }

      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          else if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          else if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
