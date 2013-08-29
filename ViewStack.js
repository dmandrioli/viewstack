define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase", "dojo/dom-geometry", "dojo/dom-class", "dojo/dom-style", "dojo/_base/array"],
    function(declare, lang, WidgetBase, domGeom, domClass, domStyle, array){
        return declare(WidgetBase, {
            // summary:
            //		xxx

            // description:
            //		Bugs:
            // - FF: transition broken, setTimeout(xxx, 0) must be setTimeout(xxx, 17)...
            // - Chrome Android: Sometimes the first screen flip does not fire widget.resize()

            // baseClass: String
            //		The name of the CSS class of this widget.
            baseClass: "mblViewStack",

            _clipArea: function(){
                if(this.domNode.style.width != "100%"){
                    var cb = domGeom.getContentBox(this.domNode);
                    var clipStr = "rect(0px, Wpx, Hpx, 0px)";
                    this.domNode.style.clip = clipStr.replace("W", cb.w).replace("H", cb.h);
                }
            },

            resize: function(){
                this._clipArea();
            },

            buildRendering: function(){
                this.inherited(arguments);
                this._clipArea();

                for(var i=0; i < this.domNode.children.length; i++){
                    if(i>0){
                        this.domNode.children[i].style.display = "none";
                    }
                    this.domNode.children[i].addEventListener("webkitTransitionEnd", lang.hitch(this,this._hideAfterTransition));
                    this.domNode.children[i].addEventListener("transitionend", lang.hitch(this,this._hideAfterTransition)); // IE10 + FF
                }
            },

            _visibleIndex:0,

            _enableAnimation: function (node){
                domClass.add(node, "mblSlideAnim");
            },

            _disableAnimation: function (node){
                domClass.remove(node, "mblSlideAnim");
            },

            _notTranslated: function(node){
                domClass.add(node, "notTranslated");
                domClass.remove(node, "leftTranslated");
                domClass.remove(node, "rightTranslated");
            },

            _leftTranslated: function(node){
                domClass.add(node, "leftTranslated");
                domClass.remove(node, "notTranslated");
                domClass.remove(node, "rightTranslated");
            },

            _rightTranslated: function(node){
                domClass.add(node, "rightTranslated");
                domClass.remove(node, "notTranslated");
                domClass.remove(node, "notTranslated");
            },

            show: function(childIndex, fromDirection){
                var toNode = this.domNode.children[childIndex];
                toNode.style.display = "";
                var fromNode = this.domNode.children[this._visibleIndex];

                this._disableAnimation(toNode);
                fromDirection == "start" ? this._leftTranslated(toNode) : this._rightTranslated(toNode);
                setTimeout(lang.hitch(this, function(){
                    this._enableAnimation(toNode);
                    this._enableAnimation(fromNode);
                    fromDirection == "start" ? this._rightTranslated(fromNode) : this._leftTranslated(fromNode);
                    this._notTranslated(toNode);
                }),0);
                this._visibleIndex = childIndex;
            },

            _hideAfterTransition: function(event){
                var node = event.target;
                if(domClass.contains(node, "leftTranslated") || domClass.contains(node, "rightTranslated")){
                    node.style.display = "none";
                }
                domClass.remove(node, "rightTranslated");
                domClass.remove(node, "leftTranslated");
                domClass.remove(node, "notTranslated");
                domClass.remove(node, "mblSlideAnim");

            },
            destroy: function(){
            }
        });
    });
