define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase", "dojo/dom-geometry", "dojo/dom-class", "dojo/_base/array"],
    function(declare, lang, WidgetBase, domGeom, domClass, array){
        return declare(WidgetBase, {
            // summary:
            //		xxx

            // description:
            //		xxx

            // baseClass: String
            //		The name of the CSS class of this widget.
            baseClass: "mblViewStack",

            _clipArea: function(){
                var cb = domGeom.getContentBox(this.domNode);
                var clipStr = "rect(0px, Wpx, Hpx, 0px)";
                this.domNode.style.clip = clipStr.replace("W", cb.w).replace("H", cb.h);
            },

            resize: function(){

                this._clipArea();
            },

            buildRendering: function(){
                this.inherited(arguments);
                this._clipArea();

                for(var i=1; i < this.domNode.children.length; i++){
                    this.domNode.children[i].style.display = "none";
                }
            },

            _leftMargin:0,
            _visibleIndex:0,

            _enableAnimation: function (node){
                domClass.add(node, "mblSlideAnim");
            },
            _disableAnimation: function (node){
                domClass.remove(node, "mblSlideAnim");
            },

            show: function(childIndex, from){

                var child = this.domNode.children[childIndex];
                child.style.display = "";

                var current = this.domNode.children[this._visibleIndex];

                if(from == "start"){
                    this._disableAnimation(child);
                    child.style.marginLeft = "-100%";

                    setTimeout(lang.hitch(this, function(){
                        this._enableAnimation(child);
                        this._enableAnimation(current);
                        current.style.marginLeft = "100%";

                        child.style.marginLeft = 0;
                    }),0);

                }else{
                    this._disableAnimation(child);
                    child.style.marginLeft = "100%";

                    setTimeout(lang.hitch(this, function(){
                        this._enableAnimation(child);
                        this._enableAnimation(current);
                        current.style.marginLeft = "-100%";

                        child.style.marginLeft = 0;
                    }),0);

                }
                current.addEventListener("webkitTransitionEnd", lang.hitch(this,this._hideAfterTransition));
                this._visibleIndex = childIndex;

            },
            _hideAfterTransition: function(event){
                if(event.target.style.marginLeft == "100%" || event.target.style.marginLeft == "-100%"){
                    event.target.style.display = "none";
                }
            },
            destroy: function(){
            }
        });
    });
