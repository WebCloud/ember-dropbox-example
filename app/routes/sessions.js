import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    var params,
        credential,
        _this;

    params = {};
    _this = this;

    window.location.hash.replace('#', '').split('&').forEach((item)=>{
      var parsed = item.split('=');
      params[parsed[0].camelize()] = parsed[1];
    });

    params.authMethod = "dropbox";
    params.userId = params.uid;

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
        Ember.$.ajax({
          url: `https://api.dropbox.com/1/account/info?access_token=${model.get('accessToken')}`,
          dataType: 'json'
        }).done(({display_name, email})=>{
          var user = {name: display_name, email: email};
          _this.store.createRecord('user', user).save().then((user)=>{
            model.set('user', user);
            model.save();
          });
        });
      }
    });
  }
});
