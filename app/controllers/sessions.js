import Ember from 'ember';

export default Ember.Controller.extend({
  assets: [],
  actions:{
    receiveFile: function(file){
      var asset,
          _this;

      _this = this;

      this.set('uploadDisabled', true);

      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (evt)=> {
        Ember.$.ajax({
          headers: {
            Authorization: `Bearer ${_this.get('model.accessToken')}`
          },
          url: `https://content.dropboxapi.com/1/files_put/auto/${file.name}`,
          type: 'PUT',
          data: evt.target.result,
          contentType: file.type,
          dataType: 'json',
          processData: false,
          crossDomain: true,
          crossOrigin: true,
          success: (data)=> {
            asset = _this.store.createRecord('asset', {
              name: file.name,
              path: data.path,
              size: data.size,
              type: file.type
            });

            // Ember.$.ajax({
            //   headers:{Authorization: `Bearer ${_this.get('model.accessToken')}`},
            //   url:`https://content.dropboxapi.com/1/files/auto${data.path}`
            // }).done((data)=>{
            //   var blob = new Blob([data], {type: file.type});
            //   var objectUrl = URL.createObjectURL(blob);
            //   window.open(objectUrl);
            // });

            var oReq = new XMLHttpRequest();
            oReq.open("GET", `https://content.dropboxapi.com/1/files/auto${data.path}?access_token=${_this.get('model.accessToken')}`, true);
            oReq.responseType = "arraybuffer";

            oReq.onload = function() {
              var blob = new Blob([oReq.response], {type: file.type});
              var objectUrl = URL.createObjectURL(blob);
              window.open(objectUrl);
            };

            oReq.send();

            asset.save();
          },
          xhr: ()=>{
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt){
              if (evt.lengthComputable){
                var percentComplete = evt.loaded / evt.total;
                console.info('upload...', percentComplete);
              }
            }, false);
            //Download progress
            xhr.addEventListener("progress", function(evt){
              if (evt.lengthComputable){
                var percentComplete = evt.loaded / evt.total;
                console.info('download...', percentComplete);
              }
            }, false);
            return xhr;
          }
        });
      };
    },

    uploadProgress: function(progress){
      this.set('assets.lastObject.progress', progress);
    }
  }
});
