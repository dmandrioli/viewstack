define([
    "dojo/_base/declare",
    "dijit/_WidgetBase", "dojo/dom-geometry"],
    function(declare, WidgetBase, domGeom){
        return declare(WidgetBase, {
            // summary:
            //		xxx

            // description:
            //		xxx

            // baseClass: String
            //		The name of the CSS class of this widget.
            baseClass: "mblViewStack",

            postCreate: function(){
                this.inherited(arguments);

            },

            buildRendering: function(){
                this.inherited(arguments);
                var clipStr = "rect(0px, W, H, 0px)";
                var cb = domGeom.getContentBox(this.domNode);
                this.domNode.style.clip = clipStr.replace("W", cb.w + "px").replace("H", cb.h + "px");

            },

            _leftMargin:0,
            next:function(){
                this._leftMargin -= 100;
                this.domNode.children[0].style.marginLeft = this._leftMargin + "%";
            },
            previous:function(){
                this._leftMargin += 100;
                this.domNode.children[0].style.marginLeft = this._leftMargin + "%";
            },

            destroy: function(){
            }
        });
    });
