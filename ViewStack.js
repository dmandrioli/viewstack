define([
    "dojo/_base/declare",
    "dijit/_WidgetBase"],
    function(declare, WidgetBase){
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
            },

            next:function(){
                this.domNode.children[0].style.marginLeft = "-100%";
            },

            destroy: function(){
            }
        });
    });
