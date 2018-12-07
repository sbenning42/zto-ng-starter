


/**
 * Gotcha:
 *
 * The key motivation for arrow function is not to save keystrokes (even if it is).
 * It's key motivation is to alter regular javascript's rules about "this", "super" and "arguments"
 * special keywords binding. More here.
 */

// Pre ES6

function _isOdd(x) {
  return x % 2;
}

// ES6
const isOdd = x => x % 2;

/**
 * Rules (might be not exaustive):
 *  - An arrow function preserve "this", "super" and "arguments" binding of the scope where it is define
 *    (it does not bind them to it's own scope)
 *  - If an arrow function has just one (and only one) parameter (and it is not a computed one), you can skip the () around it
 *  - If an arrow function has just one (and only one) instruction, you can skip the { } around it's body
 *  - If an arrow function has just one (and only one) instruction, it implicitly return it's intruction evaluation result
 *  - If an arrow function return a Plain Old Java Object it must be braced with () // aka: () => ({ ... })
 *  - An arrow function is not allowed to call "super()" but it can access super.foo or super.bar() properties and methods.
 *  - ... ?
 *
 */


// Computeted properties

const prop = 'foo';
const prefix = 'bar_';
const obj = { [prefix + foo]: 42 }; // === obj = { bar_foo: 42 };

// Spread operator

const array = [1, 2, 3];
foo(...array) // foo(1, 2, 3);

// Rest operator in foo // [1, 2, 3]. // console.log do that

function foo(...items) {
  items.forEach(item => doSomething(item));
}

/**
 * Spread and Rest comes with a much bigger syntax honey pot called destructuration / restructuration
 * I will not go much around it cause of lack of time, but here is a complete guide
 */

 // just a taste + some usefull Object static function

const localStorageEntries = getSomeLocalStorageFn(); // {foo: '42', bar: 'blah', ...}

Object.keys(localStorageEntries).forEach(key => doSomething(key)); // 'foo', 'bar', ...
Object.values(localStorageEntries).forEach(value => doSomething(value)); // '42', 'blah', ...

// but
Object.entries(localStorageEntries).forEach(entry => doSomething(entry[0], entry[1])); // ['foo', '42'], ['bar', 'blah'], ...
// is not really verbose what's in entry[x] ... until restructuration
Object.entries(localStorageEntries).forEach(([entryName, entryValue]) => doSomething(entryName, entryValue)); // ['foo', '42'], ['bar', 'blah'], ...

// Array functions

// Filter

const sampleArray = [1, 2, 3, 4, 5];

const oddArray = sampleArray.filter(x => x % 2); // [1, 3, 5]

// or more declaratively
const isOddFn = x => x % 2
const oddArray = sampleArray.filter(isOddFn); // [1, 3, 5]

// still dont consider the following possible (I saw it)
const evenArray = sampleArray.filter(!isOddFn); // Not syntaxicaly incorrect, but NOT what you want .. (Error can't call apply on undefined)

// instead
const isEvenFn = x => !isOddFn(x);
const evenArray = sampleArray.filter(isEvenFn); // [2, 4]


// Transforme (in place) (aka: map)

//closure function
function multipleClFn(mult) {
  return x => x * mult;
};

const doubleFn = multipleClFn(2);
const tripleFn = multipleClFn(3);

const doubleArray = sampleArray.map(doubleFn); // [2, 4, 6, 8, 10]
const tripleArray = sampleArray.map(tripleFn); // [3, 6, 9, 12, 15]

// Assertion (aka: return boolean) all assertion function stop their iteration as soon as they know their return value

doubleArray.every(isEvenFn); // true

tripleArray.every(isOddFn); // false
tripleArray.some(isOddFn); // true
tripleArray.includes(9); // true

// Aggregate

const sumFn = (aggregateItem, xItem) => aggregateItem + xItem;
const multFn = (aggregateItem, xItem) => aggregateItem * xItem;

const oddArraySum = oddArray.reduce(sumFn, 0); // 9
const evenArrayMult = evenArray.reduce(multFn, 1); // 8


// Note reduce can also be use to transforme a data format

const users = someGetUserArrayFn();
/**
 *
 *  [{
 *    id: 'foo',
 *    name: 'sacré Brian',
 *    roles: ['user']
 *  },
 *  {
 *    id: 'bar',
 *    name: 'la fameuse Alice',
 *    roles: ['user', 'admin']
 *  }]
 *
 */

const pairUserWithIdFn = user => [user, user.id];
const indexUserIdPairsFn = (indexed, [user, id]) => ({ ...indexed, [id]: user }); // Spread also work's in POJO !

const userIdPairs = users.map(pairUserWithId);
/**
 *
 * [
 *    ['foo', {id: 'foo', name ....}],
 *    ['bar', {id: 'bar', name ...}]
 * ]
 *
 */


const indexedUsers = userIdPairs.reduce(indexUserIdPairsFn, {});
/**
 *
 * {
 *    foo: { id: 'foo', name ... },
 *    bar: { id: 'bar', name ... },
 * }
 *
 */


 // We can combine all together

const pairUserWithIdFn = user => [user, user.id];
const indexUserIdPairsFn = (indexed, [user, id]) => ({ ...indexed, [id]: user });
const hasUserRoleFn = user => user.roles.includes('user');
const hasAdminRoleFn = user => user.roles.includes('admin');

const allUsers = someGetUserArrayFn();

const indexedUsers = allUsers
  .filter(hasUserRoleFn)
  .map(pairUserWithIdFn)
  .reduce(indexUserIdPairsFn);

const indexedAdmins = allUsers
  .filter(hasAdminRoleFn)
  .map(pairUserWithIdFn)
  .reduce(indexUserIdPairsFn);

// we can do it from an indexed obj to an array

Object.values(indexedAdmins)
