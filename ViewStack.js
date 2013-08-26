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

            postCreate: function(){
                this.inherited(arguments);

            },

            buildRendering: function(){
                this.inherited(arguments);
                var clipStr = "rect(0px, W, H, 0px)";
                var cb = domGeom.getContentBox(this.domNode);
               // this.domNode.style.clip = clipStr.replace("W", cb.w + "px").replace("H", cb.h + "px");
//                array.forEach(this.children, function(v){
//                    v.domNode.style.display = (v === this) ? "" : "none";
//                }, this);

            },

            _leftMargin:0,
            _visibleIndex:0,
            next:function(){
                this._leftMargin -= 100;
                this._visibleIndex++;
                this.domNode.children[0].style.marginLeft = this._leftMargin + "%";
            },
            previous:function(){
                this._leftMargin += 100;
                this._visibleIndex--;
                this.domNode.children[0].style.marginLeft = this._leftMargin + "%";
            },

            _enableAnimation: function (){
                domClass.add(this.domNode.children[0], "mblSlideAnim");
            },
            _disableAnimation: function (){
                domClass.remove(this.domNode.children[0], "mblSlideAnim");
            },

            show: function(childIndex, direction){

                if(direction == "start"){
                    if(this._visibleIndex == childIndex + 1){

                    }else{
                        console.log("start", childIndex);
                        this._disableAnimation();
                        domClass.add(this.domNode.children[0].children[childIndex], "order" + (this._visibleIndex-1).toString());
                        this.next();
                        setTimeout(lang.hitch(this, function(){
                        this._enableAnimation();
                        this.previous();
                        }),0);
                    }
                }else{

                }
            },
            destroy: function(){
            }
        });
    });
