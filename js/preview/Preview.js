/*global variables Class, PreviewHandler, Actions, Utils, EventHandler*/
var Preview = Class("Preview", {
    const: function(){
        var n = Utils.createTemplateElement(this.className, this.template);
        this.element = n.element;
        this.element.css({width:"100%",height:"100%",display:"none"});
        this.$ = n.querier;
        this.htmlClassName = n.htmlClassName;
    },
    extensions: [],
    template: {
        html:"",
        style: ""        
    },
    showGeneralData: true,
    htmlInitialisation: function(){},
    loadFile: function(file){
        if(EventHandler.trigger("openFile:pre", this, {newFile:file, file:this.file})){
            this.file = file;
            this.resetFile();
            if(this.showGeneralData){
                this.setGeneralData();   
                PreviewHandler.showGeneralData();
            }else{
                PreviewHandler.hideGeneralData();
            }
            
            var open = this.open();
            this.onLoadFile(file);
            
            if(!open)
                return false;
            
            EventHandler.trigger("openFile:post", this, {file:file});
            return true;
        }
        return false;
    },
    onLoadFile: function(file){
          
    },
    onDatesLoad: function(){},
    onSizeLoad: function(){},
    setGeneralData: function(){
        var file = this.file;
        var path = file.getPath();
        var t = this;
        
        PreviewHandler.setGeneralData(null, null, null, null, path);       
        Actions.file.getDates(path, function(dates){
            if(dates){
                if(t.file == file){
                    PreviewHandler.setGeneralData(null, dates.dateCreated, dates.dateModified, dates.dateAccessed, null);
                    t.onDatesLoad(dates.dateCreated, dates.dateModified, dates.dateAccessed);
                }
            }
        });
        Actions.file.getSize(path, function(size){
            if(size){
                var ar = [[1, " Bit", "s"], [8, " Byte", "s"], [1024, "KB"], [1024, "MB"], [1024, "GB"]];
                var formattedSize = "0 Bits";
                for(var i=0; i<ar.length; i++){
                    if(size>=ar[i][0]){
                        size = Math.round(size/ar[i][0]);
                        formattedSize = size+ar[i][1]+(size.length!=1&&ar[i][2]?ar[i][2]:"");
                    }else
                        break;
                
                }
                if(t.file == file){
                    PreviewHandler.setGeneralData(formattedSize, null, null, null, null);
                    t.onSizeLoad(size, formattedSize);
                }
            }
        });
    },
    resetFile: function(){},
    
    open: function(){
        if(PreviewHandler.setOpenedPreview(this)){
            if(EventHandler.trigger("open:pre", this, {file:this.file})){
                this.element.show();
                EventHandler.trigger("open:post", this, {file:this.file});
                return true;
            }
        }
        return false;
    },
    close: function(){
        if(EventHandler.trigger("close:pre", this, {file:this.file})){
            this.element.hide();
            EventHandler.trigger("close:post", this, {file:this.file});
            return true;
        }
        return false;
    }
});