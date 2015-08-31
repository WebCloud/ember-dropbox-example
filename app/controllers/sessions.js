import Ember from 'ember';

export default Ember.Controller.extend({
  assets: [],
  actions:{
    receiveFile(file){
      var _this = this;
      this.set('uploadDisabled', true);

      var reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = ({target:{result}})=> {
        Ember.$.ajax({
          headers: {
            Authorization: `Bearer ${_this.get('model.accessToken')}`
          },

          url: `https://content.dropboxapi.com/1/files_put/auto/${file.name}`,
          type: 'PUT',
          data: result,
          contentType: file.type,
          dataType: 'json',
          processData: false,
          crossDomain: true,
          crossOrigin: true,

          success: ({path, size})=> {
            var asset = _this.store.createRecord('asset', {
              name: file.name,
              path: path,
              size: size,
              type: file.type
            });
            asset.save();
            _this.get('assets').pushObject(asset);
          },

          xhr: ()=>{
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", (evt)=>{
              if (evt.lengthComputable){
                var percentComplete = evt.loaded / evt.total;
                Ember.$('[data-uploader]').trigger({
                  type:"uploadProgress",
                  progress:percentComplete
                });
              }
            }, false);
            //Download progress
            xhr.addEventListener("progress", (evt)=>{
              if (evt.lengthComputable){
                var percentComplete = evt.loaded / evt.total;
                Ember.$('[data-uploader]').trigger({
                  type:"downloadProgress",
                  progress:percentComplete
                });
              }
            }, false);
            return xhr;
          }
        });
      };
    },

    uploadProgress(progress){
      this.set('assets.lastObject.progress', progress);
    },

    downloadProgress(progress){
      if(progress === 1) {
        this.set('isDownloading', false);
      } else if(!this.get('isDownloading')) {
        this.set('isDownloading', true);
      }
    },

    downloadFile(file){
      var xhr = new XMLHttpRequest();

      xhr.open("GET", `https://content.dropboxapi.com/1/files/auto${file.get('path')}?access_token=${this.get('model.accessToken')}`, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = ()=> {
        var blob = new Blob([xhr.response], {type: file.get('type')});
        var objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl);
      };

      xhr.send();
    }
  }
});
