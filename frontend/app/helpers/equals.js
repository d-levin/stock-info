import Ember from 'ember';

export function equals([arg1, arg2]) {
  return arg1 === arg2
}

export default Ember.Helper.helper(equals);
