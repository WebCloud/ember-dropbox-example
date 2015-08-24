import Ember from 'ember';
import FormDataAdapterMixin from '../../../mixins/form-data-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | form data adapter');

// Replace this with your real tests.
test('it works', function(assert) {
  var FormDataAdapterObject = Ember.Object.extend(FormDataAdapterMixin);
  var subject = FormDataAdapterObject.create();
  assert.ok(subject);
});
