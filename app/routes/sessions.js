import Ember from 'ember';

export default Ember.Route.extend({
  utils: Ember.inject.service('dropbox-utils'),

  model() {
    var params,
        credential,
        _this;

    params = this.get('utils').getAuthorisationData();
    _this = this;

    return this.store.query('credential', {
                                            orderBy: 'userId',
                                            equalTo: params.userId
                                          }).then((cred)=>{
      if(Ember.isPresent(cred)) {
        return cred.get('firstObject');
      } else {
        credential = _this.store.createRecord('credential', params);
        credential.save();

        return credential;
      }
    });
  },

  afterModel(model) {
    var _this = this;

    model.get('user').then((user)=>{
      if(Ember.isPresent(user)) {
        model.set('user', user);
      } else {
        this.get('utils').getUserInfo(model.get('accessToken'))
                         .then(({display_name:name, email})=>{

          _this.store.createRecord('user', {name, email}).save().then((user)=>{
            model.set('user', user);
            model.save();
          });
        });
      }
    });
  }
});
