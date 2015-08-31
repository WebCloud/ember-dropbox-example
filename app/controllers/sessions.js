import Ember from 'ember';

export default Ember.Controller.extend({
  assets: [],
  uploader: Ember.inject.service('dropbox-uploader'),

  initializeUploader: function(){
    this.set('uploader.accessToken', this.get('model.accessToken'));
  }.observes('model.accessToken'),

  actions:{
    receiveFile(file){
      var _this = this;
      this.set('uploadDisabled', true);

      this.get('uploader').upload(file).then((file)=>{
        var asset = _this.store.createRecord('asset', file);
        asset.save();
        _this.get('assets').pushObject(asset);
        _this.set('isDownloading', false);
      });

    },

    uploadProgress(progress){
      if(progress === 1) {
        this.set('isDownloading', true);
      }
    },

    downloadFile(file){
      this.set('isDownloading', true);
      this.get('uploader').download(file).then((objectUrl)=>{
        window.open(objectUrl);
        this.set('isDownloading', false);
      });
    }
  }
});
