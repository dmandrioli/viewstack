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

            buildRendering: function(){
                this.inherited(arguments);
                for(var i=1; i < this.domNode.children.length; i++){
                    this._setVisibility(this.domNode.children[i], false);
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

            _setAfterTransitionHandlers: function(node){
                node.addEventListener("webkitTransitionEnd", lang.hitch(this,this._afterTransitionHandle));
                node.addEventListener("transitionend", lang.hitch(this,this._afterTransitionHandle)); // IE10 + FF
            },

            _removeAfterTransitionHandlers: function(node){
                node.removeEventListener("webkitTransitionEnd", lang.hitch(this,this._afterTransitionHandle));
                node.removeEventListener("transitionend", lang.hitch(this,this._afterTransitionHandle)); // IE10 + FF
            },

            show: function(childIndex, props){
                if(!props.transition || props.transition == "slide"){
                    var toNode = this.domNode.children[childIndex];
                    this._setVisibility(toNode, true);
                    var fromNode = this.domNode.children[this._visibleIndex];
                    this._setAfterTransitionHandlers(fromNode);
                    this._setAfterTransitionHandlers(toNode);

                    this._disableAnimation(toNode);
                    props.direction == "start" ? this._leftTranslated(toNode) : this._rightTranslated(toNode);
                    setTimeout(lang.hitch(this, function(){
                        this._enableAnimation(toNode);
                        this._enableAnimation(fromNode);
                        props.direction == "start" ? this._rightTranslated(fromNode) : this._leftTranslated(fromNode);
                        this._notTranslated(toNode);
                    }),0);
                    this._visibleIndex = childIndex;
                }
            },

            addElement: function(node){
                this.domNode.children.push(node);
                this._setVisibility(node, false);
            },

            _setVisibility: function(node, val){
                node.style.visibility = val ? "visible" : "hidden";
            },

            _afterTransitionHandle: function(event){
                var node = event.target;
                if(domClass.contains(node, "leftTranslated") || domClass.contains(node, "rightTranslated")){
                    this._setVisibility(node, false);
                }
                domClass.remove(node, "rightTranslated");
                domClass.remove(node, "leftTranslated");
                domClass.remove(node, "notTranslated");
                domClass.remove(node, "mblSlideAnim");
                this._removeAfterTransitionHandlers(node);
            },

            destroy: function(){
            }
        });
    });
