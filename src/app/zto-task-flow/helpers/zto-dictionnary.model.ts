export class ZtoDictionnary<T = any> {

  [key: string]: T;

  constructor(objectOrArray?: ZtoDictionnary<T> | Array<T>, selector: string = 'id') {
    if (objectOrArray && Array.isArray(objectOrArray)) {

      const validateItem = (item: T) => item && typeof (item[selector]) === 'string';
      const selectAndAssignToThis = (item: T) => this[item[selector]] = item;
      objectOrArray.filter(validateItem).forEach(selectAndAssignToThis);

    } else {

      const assignToThis = ([key, item]: [string, T]) => this[key] = item;
      Object.entries(objectOrArray || {}).forEach(assignToThis);

    }
  }

}
