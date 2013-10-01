define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase", "dojo/dom-geometry", "dojo/dom-class", "dojo/dom-construct", "dijit/registry"],
    function(declare, lang, WidgetBase, domGeom, domClass, domConstruct, registry){
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

            showNext: function(props){
                if(!this._visibleChild){
                    this._visibleChild = registry.byNode(this.domNode.children[0]);
                }
                if(this._visibleChild){
                    this.show(this._visibleChild.getNextSibling(), props);
                }
            },

            showPrevious: function(props){
                if(!this._visibleChild){
                    this._visibleChild = registry.byNode(this.domNode.children[0]);
                }
                if(this._visibleChild){
                    this.show(this._visibleChild.getPreviousSibling(), props);
                }

            },

            show: function(widgetOrId, props){
                if(!this._visibleChild){
                    this._visibleChild = registry.byNode(this.domNode.children[0]);
                }
                if(this._visibleChild){
                    var widget = this._getWidget(widgetOrId);
                    if(widget){
                        if (!props){
                            props = {transition: "slide", direction: "end"};
                        }
                        if(!props.transition || props.transition == "slide"){

                            var toNode = widget.domNode;
                            this._setVisibility(toNode, true);
                            var fromNode = this._visibleChild.domNode;
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
                            this._visibleChild = widget;
                        }
                    }
                }
            },

            addChild: function(widgetOrId){
                var widget = this._getWidget(widgetOrId);
                if(widget){
                    domConstruct.place(widget.domNode, this.domNode);
                    this._setVisibility(widget.domNode, false);
                }
            },

            removeChild: function(widgetOrId){
                var widget = this._getWidget(widgetOrId);
                if(widget){
                    domConstruct.destroy(widget.domNode);
                }
            },

            _getWidget: function(widgetOrId){
                return typeof widgetOrId == "string" ? registry.byId(widgetOrId) : widgetOrId;
            },

            buildRendering: function(){
                this.inherited(arguments);
                for(var i=1; i < this.domNode.children.length; i++){
                    this._setVisibility(this.domNode.children[i], false);
                }
            },

            _visibleChild: null,

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
                domClass.remove(node, "leftTranslated");
            },

            _setAfterTransitionHandlers: function(node){
                node.addEventListener("webkitTransitionEnd", lang.hitch(this,this._afterTransitionHandle));
                node.addEventListener("transitionend", lang.hitch(this,this._afterTransitionHandle)); // IE10 + FF
            },

            _removeAfterTransitionHandlers: function(node){
                node.removeEventListener("webkitTransitionEnd", lang.hitch(this,this._afterTransitionHandle));
                node.removeEventListener("transitionend", lang.hitch(this,this._afterTransitionHandle)); // IE10 + FF
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
