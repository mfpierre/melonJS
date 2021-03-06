/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2014 Olivier Biot, Jason Oster, Aaron McLeod
 * http://www.melonjs.org
 *
 * A QuadTree implementation in JavaScript, a 2d spatial subdivision algorithm.
 * Based on the QuadTree Library by Mike Chambers and released under the MIT license
 * https://github.com/mikechambers/ExamplesByMesh/tree/master/JavaScript/QuadTree
**/

(function () {

    /****************** QuadTree ****************/

    /**
    * QuadTree data structure.
    * @class QuadTree
    * @constructor
    * @ignore
    * @param {Object} An object representing the bounds of the top level of the QuadTree. The object 
    * should contain the following properties : {x, y}, width, height
    * @param {Number} maxDepth The maximum number of levels that the quadtree will create. Default is 4.
    * @param {Number} maxChildren The maximum number of children that a node can contain before it is split into sub-nodes.
    **/
    function QuadTree(bounds, maxDepth, maxChildren) {
        this.root = new BoundsNode(bounds, 0, maxDepth, maxChildren);
    }

    /**
    * The root node of the QuadTree which covers the entire area being segmented.
    * @property root
    * @type Node
    **/
    QuadTree.prototype.root = null;

   
    /**
    * Inserts an item into the QuadTree.
    * @method insert
    * @ignore
    * @param {Entity|Array} item The item or Array of items to be inserted into the QuadTree. The item should expose x, y 
    * properties that represents its position in 2D space.
    **/
    QuadTree.prototype.insert = function (item) {
        if (item instanceof Array) {
            var len = item.length;

            var i;
            for (i = 0; i < len; i++) {
                this.root.insert(item[i]);
            }
        } else {
            this.root.insert(item);
        }
    };
    
    /**
    * Clears all nodes and children from the QuadTree
    * @ignore
    * @param {Object} An optional object representing the bounds of the top level of the QuadTree. The object 
    * should contain the following properties : {x, y}, width, height
    * @method clear
    **/
    QuadTree.prototype.clear = function (bounds) {
        this.root.clear();
        if (typeof bounds !== "undefined") {
            this.root._bounds.pos.setV(bounds.pos);
            this.root._bounds.width = bounds.width;
            this.root._bounds.height = bounds.height;
        }
    };

    /**
    * Retrieves all items / points in the same node as the specified item / point. If the specified item
    * overlaps the bounds of a node, then all children in both nodes will be returned.
    * @ignore
    * @method retrieve
    * @param {Entity} item An object entity with bounds property representing a 2D coordinate point (with x, y properties), or a shape
    * with dimensions (x, y, width, height) properties.
    **/
    QuadTree.prototype.retrieve = function (item) {
        //get a copy of the array of items
        var out = this.root.retrieve(item).slice(0);
        return out;
    };


    /******************** BoundsQuadTree ****************/

    function BoundsNode(bounds, depth, maxChildren, maxDepth) {
        this._bounds = bounds;
        this.children = [];
        this.nodes = [];

        if (maxChildren) {
            this._maxChildren = maxChildren;
        }

        if (maxDepth) {
            this._maxDepth = maxDepth;
        }

        if (depth) {
            this._depth = depth;
        }
        this._stuckChildren = [];
    }
    
    //subnodes
    BoundsNode.prototype.nodes = null;

    //children contained directly in the node
    BoundsNode.prototype.children = null;
    BoundsNode.prototype._stuckChildren = null;
    BoundsNode.prototype._bounds = null;

    //read only
    BoundsNode.prototype._depth = 0;

    BoundsNode.prototype._maxChildren = 4;
    BoundsNode.prototype._maxDepth = 4;

    BoundsNode.TOP_LEFT = 0;
    BoundsNode.TOP_RIGHT = 1;
    BoundsNode.BOTTOM_LEFT = 2;
    BoundsNode.BOTTOM_RIGHT = 3;


    //we use this to collect and concatenate items being retrieved. This way
    //we dont have to continuously create new Array instances.
    //Note, when returned from QuadTree.retrieve, we then copy the array
    BoundsNode.prototype._out = [];

    BoundsNode.prototype.insert = function (item) {
        if (this.nodes.length) {
            var index = this._findIndex(item);
            var node = this.nodes[index];
            var itemBounds = item.getBounds();

            //todo: make _bounds bounds
            if (itemBounds.pos.x >= node._bounds.pos.x &&
                itemBounds.pos.x + itemBounds.width <= node._bounds.pos.x + node._bounds.width &&
                itemBounds.pos.y >= node._bounds.pos.y &&
                itemBounds.pos.y + itemBounds.height <= node._bounds.pos.y + node._bounds.height) {
                
                this.nodes[index].insert(item);
                
            } else {
                this._stuckChildren.push(item);
            }

            return;
        }

        this.children.push(item);

        var len = this.children.length;

        if (len > this._maxChildren && this._depth < this._maxDepth) {
            
            this.subdivide();

            var i;
            for (i = 0; i < len; i++) {
                this.insert(this.children[i]);
            }

            this.children.length = 0;
        }
    };

    BoundsNode.prototype.getChildren = function () {
        return this.children.concat(this._stuckChildren);
    };

    BoundsNode.prototype.retrieve = function (item) {
        var out = this._out;
        out.length = 0;
        if (this.nodes.length) {
            var index = this._findIndex(item);
            var node = this.nodes[index];
            var itemBounds = item.getBounds();

            if (itemBounds.pos.x >= node._bounds.pos.x &&
                itemBounds.pos.x + itemBounds.width <= node._bounds.pos.x + node._bounds.width &&
                itemBounds.pos.y >= node._bounds.pos.y &&
                itemBounds.pos.y + itemBounds.height <= node._bounds.pos.y + node._bounds.height) {
                
                out.push.apply(out, this.nodes[index].retrieve(item));
            } else {
                //Part of the item are overlapping multiple child nodes. For each of the overlapping nodes, return all containing objects.

                if (itemBounds.pos.x <= this.nodes[BoundsNode.TOP_RIGHT]._bounds.pos.x) {
                    if (itemBounds.pos.y <= this.nodes[BoundsNode.BOTTOM_LEFT]._bounds.pos.y) {
                        out.push.apply(out, this.nodes[BoundsNode.TOP_LEFT].getAllContent());
                    }
                    
                    if (itemBounds.pos.y + itemBounds.height > this.nodes[BoundsNode.BOTTOM_LEFT]._bounds.pos.y) {
                        out.push.apply(out, this.nodes[BoundsNode.BOTTOM_LEFT].getAllContent());
                    }
                }
                
                if (itemBounds.pos.x + itemBounds.width > this.nodes[BoundsNode.TOP_RIGHT]._bounds.pos.x) {//position+width bigger than middle x
                    if (itemBounds.pos.y <= this.nodes[BoundsNode.BOTTOM_RIGHT]._bounds.pos.y) {
                        out.push.apply(out, this.nodes[BoundsNode.TOP_RIGHT].getAllContent());
                    }
                    
                    if (itemBounds.pos.y + itemBounds.height > this.nodes[BoundsNode.BOTTOM_RIGHT]._bounds.pos.y) {
                        out.push.apply(out, this.nodes[BoundsNode.BOTTOM_RIGHT].getAllContent());
                    }
                }
            }
        }

        out.push.apply(out, this._stuckChildren);
        out.push.apply(out, this.children);

        return out;
    };

    //Returns all contents of node.
    BoundsNode.prototype.getAllContent = function () {
        var out = this._out;
        if (this.nodes.length) {
            
            var i;
            for (i = 0; i < this.nodes.length; i++) {
                this.nodes[i].getAllContent();
            }
        }
        out.push.apply(out, this._stuckChildren);
        out.push.apply(out, this.children);
        return out;
    };
    
    BoundsNode.prototype._findIndex = function (item) {
        var b = this._bounds;
        var itemBounds = item.getBounds();
        var left = (itemBounds.pos.x > b.pos.x + b.width / 2) ? false : true;
        var top = (itemBounds.pos.y > b.pos.y + b.height / 2) ? false : true;

        //top left
        var index = BoundsNode.TOP_LEFT;
        if (left) {
            //left side
            if (!top) {
                //bottom left
                index = BoundsNode.BOTTOM_LEFT;
            }
        } else {
            //right side
            if (top) {
                //top right
                index = BoundsNode.TOP_RIGHT;
            } else {
                //bottom right
                index = BoundsNode.BOTTOM_RIGHT;
            }
        }

        return index;
    };

    
    BoundsNode.prototype.subdivide = function () {
        var depth = this._depth + 1;

        var bx = this._bounds.pos.x;
        var by = this._bounds.pos.y;

        //floor the values
        var b_w_h = (this._bounds.width / 2) | 0; //todo: Math.floor?
        var b_h_h = (this._bounds.height / 2) | 0;
        var bx_b_w_h = bx + b_w_h;
        var by_b_h_h = by + b_h_h;

        //top left
        this.nodes[BoundsNode.TOP_LEFT] = new BoundsNode({
            pos: new me.Vector2d(bx, by),
            width: b_w_h,
            height: b_h_h
        },
        depth, this._maxDepth, this._maxChildren);

        //top right
        this.nodes[BoundsNode.TOP_RIGHT] = new BoundsNode({
            pos: new me.Vector2d(bx_b_w_h, by),
            width: b_w_h,
            height: b_h_h
        },
        depth, this._maxDepth, this._maxChildren);

        //bottom left
        this.nodes[BoundsNode.BOTTOM_LEFT] = new BoundsNode({
            pos: new me.Vector2d(bx, by_b_h_h),
            width: b_w_h,
            height: b_h_h
        },
        depth, this._maxDepth, this._maxChildren);


        //bottom right
        this.nodes[BoundsNode.BOTTOM_RIGHT] = new BoundsNode({
            pos: new me.Vector2d(bx_b_w_h, by_b_h_h),
            width: b_w_h,
            height: b_h_h
        },
        depth, this._maxDepth, this._maxChildren);
    };

    BoundsNode.prototype.clear = function () {

        this._stuckChildren.length = 0;

        //array
        this.children.length = 0;

        var len = this.nodes.length;

        if (!len) {
            return;
        }

        var i;
        for (i = 0; i < len; i++) {
            this.nodes[i].clear();
        }

        //array
        this.nodes.length = 0;
    };

    // expose QuadTree under the me namespace
    me.QuadTree = QuadTree;

}());
