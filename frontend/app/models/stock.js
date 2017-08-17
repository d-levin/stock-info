import DS from 'ember-data';

export default DS.Model.extend({
  symbol: DS.attr('string'),
  name: DS.attr('string')
});
